---
layout: post
date: 2021-10-04T20:47:17.128Z
title: Off To The Cloud - Part 2
publish: false
image: /content/img/netlifyCMS/cloudCastle.jpg
tags:
  - aws
  - terraform
  - cloud
---

This is part 2 of the off to the cloud series, where I put together some AWS and other cloud infra as a PoC into what we
can do with the tools they provide. This section will cover RDS and ECS. [Part 1](/blog/off-to-the-cloud-part-1/)
covered simple ECS setup and some AWS VPC networking.

**This is meant to be a PoC and has some security holes (looked at in detail in the last section) that should be patched
before deploying.**

## Step 2 - Cloud Native

This section of this tutorial assumes you've got experience with Docker & can containerize this runtime. There are ways
of containerizing and running almost any application even if it needs access to a file system or some sort of
specialized hardware. This currently post has no requirements for anything other than the stateless database access.

In this part we will migrate to ECS for the app runtime and RDS for the database. We will also take into account some
resiliency. I will assume you have your provider set up and can run terraform deployments, if not, start with some
terraform getting started guides.

Note that our default tags look as below. Its good practice to tag your infra for billing and general identification.

```hcl
locals {
  default_tags = {
    version : "2.2.4"
    project : "offToTheCloud"
  }
}
```

### 2.1 Networking

At a start we will need a network; enough to provide some failover, so multi az, and some flow logs so we can monitor
the flow of traffic on our vpc.

```hcl
data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

module "vpc" {
  source               = "terraform-aws-modules/vpc/aws"
  version              = "2.77.0"
  name                 = "step_2_vpc"
  cidr                 = "10.0.0.0/16"
  public_subnets       = [
    "10.0.0.0/24",
    "10.0.1.0/24"
  ]
  azs                  = [
    "${data.aws_region.current.name}a",
    "${data.aws_region.current.name}b"
  ]
  enable_dns_support   = true
  enable_dns_hostnames = true

  enable_flow_log                          = true
  create_flow_log_cloudwatch_iam_role      = true
  create_flow_log_cloudwatch_log_group     = true
  flow_log_cloudwatch_log_group_kms_key_id = aws_kms_key.flow_log_key.arn

  tags = merge(local.default_tags, {
    Name = "Step 2 VPC"
  })
}

resource "aws_kms_key" "flow_log_key" {
  description             = "flow_log_key"
  deletion_window_in_days = 7
  policy                  = data.aws_iam_policy_document.kms_log_policy.json
  tags                    = local.default_tags
}
resource "aws_kms_alias" "flow_log_key" {
  target_key_id = aws_kms_key.flow_log_key.arn
  name_prefix   = "alias/flow_log_key_"
  tags          = local.default_tags
}

data "aws_iam_policy_document" "kms_log_policy" {
  policy_id = "kms_log_policy"
  statement {
    principals {
      type        = "AWS"
      identifiers = [data.aws_caller_identity.current.arn]
    }
    actions   = ["*"]
    resources = ["arn:aws:kms:*"]
  }
  statement {
    principals {
      type        = "Service"
      identifiers = ["logs.${data.aws_region.current.name}.amazonaws.com"]
    }
    actions   = [
      "kms:Encrypt*",
      "kms:Decrypt*",
      "kms:ReEncrypt*",
      "kms:GenerateDataKey*",
      "kms:Describe*"
    ]
    resources = ["arn:aws:kms:*"]
  }
}
```

The above is relatively complex, but does what it says on the tin. The kms keys are for encrypting our flow logs and the
dns names are for ease of use.

### 2.2 - ECS

ECS is the runtime we will be using, it's a managed container solution by AWS. You provide the image, they will run it
for you. There are some "easy mode" configs we've selected to get started, which will be pointed out as we go through
this tutorial. ECS is formed by a couple parts:

* **Cluster**
* **Service**
* **Task**
* **Container**

A **Cluster** can have multiple **Services** which are composed of **Tasks** and a **Task** can have multiple **
Containers**. For example, a microservice arch might have a web API and a booking service. These 2 tasks can run in the
same **Cluster** as individual **Services**, each with a service definition. **Services** can then be broken down by
instances of sets of containers known as **Tasks**. Then each of these **Tasks** might be composed of 1 or more
containers, maybe a monitoring sidecar scraping metrics or a secrets manager sidecar providing secrets to the main
container.

With these definitions defined, we can look into our implementation. Let's start with the Cluster.

```hcl
resource "aws_kms_key" "ecs_command_key" {
  description             = "ecs_command_key"
  deletion_window_in_days = 7
  tags                    = local.default_tags

}
resource "aws_kms_alias" "ecs_command_key" {
  target_key_id = aws_kms_key.ecs_command_key.arn
  name_prefix   = "alias/ecs_command_key_"
  tags          = local.default_tags

}

resource "aws_cloudwatch_log_group" "ecs_logs" {
  name_prefix       = "ecs_logs_"
  retention_in_days = 7
  kms_key_id        = aws_kms_key.ecs_log_key.arn
  tags              = local.default_tags

}

resource "aws_ecs_cluster" "my_ecs_cluster" {
  name               = "main_cluster"
  capacity_providers = [
    "FARGATE",
    "FARGATE_SPOT"
  ]
  configuration {
    execute_command_configuration {
      // https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ExecuteCommandConfiguration.html
      kms_key_id = aws_kms_key.ecs_command_key.arn
      logging    = "OVERRIDE"
      log_configuration {
        cloud_watch_encryption_enabled = true
        cloud_watch_log_group_name     = aws_cloudwatch_log_group.ecs_logs.name
      }
    }
  }
  depends_on         = [
    module.vpc
  ]
  tags               = local.default_tags
}
```

This block creates us a command key, to secure our data in transit to the container, a log group with 7 days of
retention in cloudwatch and a cluster that leverages these assets. The cluster itself has a name and uses fargate as a
capacity provider rather than try to roll our own EC2 provider; this means we dont have control over the underlying
hosts afaik - advanced usecases may require known infra via
the [EC2 provider](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/cluster-capacity-providers.html).

Now we have a cluster, let put define our task task on it. We only have an API which runs in docker, you can assume its
prebuilt and in docker hub for this example. This is another easy mode step we cover below. This means to define our
task we just need a few bits and pieces. Namely, the rest of the definition and the IAM roles, lets start on the task
def.

```hcl

locals {
  ecs_service_name   = "api_service"
  ecs_container_name = "my_first_api"
  ecs_app_port       = 80
}

resource "aws_ecs_task_definition" "api_task" {
  family                   = local.ecs_service_name
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  task_role_arn            = aws_iam_role.ecs_task_role.arn
  # https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_ContainerDefinition.html
  container_definitions    = jsonencode([
    {
      name             = local.ecs_container_name
      image            = "mradjunctpanda/off-to-the-cloud:0.1.0"
      essential        = true
      portMappings     = [
        {
          containerPort = local.ecs_app_port
          hostPort      = local.ecs_app_port
        }
      ]
      environment      = [
        {
          name  = "PORT"
          value = "80"
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options   = {
          awslogs-group         = aws_cloudwatch_log_group.ecs_logs.name
          awslogs-region        = data.aws_region.current.name
          awslogs-stream-prefix = "ecs"
        }
      }
    }
  ])
  network_mode             = "awsvpc"
  requires_compatibilities = [
    "FARGATE"
  ]
  cpu                      = 256
  memory                   = 512
  tags                     = local.default_tags
}
```

The majority of this is self-explanatory with the complicated bits coming as the AWS specific parts.
The `log-configuration` really is just the settings AWS needs to fufil your logging requirements, we created the pieces
needed earlier. The [docs](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/using_awslogs.html) have some
more info on how this works.

One significant piece to understand is how ECS uses IAM to execute and schedule tasks. In fact, we have a whole file
dedicated to creating these users.

```hcl
data "aws_iam_policy_document" "ecs_execution_assume_policy_doc" {
  policy_id = "ecs_execution_assume_policy_doc"
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["ecs-tasks.amazonaws.com"]
    }
  }
}

data "aws_iam_policy_document" "ecs_execution_logging_policy_doc" {
  policy_id = "ecs_execution_logging_policy_doc"
  statement {
    actions   = [
      "logs:*"
    ]
    resources = ["arn:aws:logs:*"]
  }
}

# The Execution Role is for executing the runtime, which things the container can access
resource "aws_iam_role" "ecs_execution_role" {
  name               = "off_to_cloud_ecs_execution_role"
  assume_role_policy = data.aws_iam_policy_document.ecs_execution_assume_policy_doc.json
  tags               = local.default_tags
}

# The Task Role is for the service running the tasks, wha needs to be accessed to start the containers
resource "aws_iam_role" "ecs_task_role" {
  name               = "off_to_cloud_ecs_task_role"
  assume_role_policy = data.aws_iam_policy_document.ecs_execution_assume_policy_doc.json
  tags               = local.default_tags
}


resource "aws_iam_role_policy" "ecs_execution_logging" {
  name   = "ecs_logging"
  role   = aws_iam_role.ecs_execution_role.id
  policy = data.aws_iam_policy_document.ecs_execution_logging_policy_doc.json
}


resource "aws_iam_role" "ecs_service_role" {
  name               = "ecs_service_role"
  assume_role_policy = data.aws_iam_policy_document.ecs_execution_assume_policy_doc.json
}
```

So what is this saying? Well we need 3 user roles - One for setting up the tasks (execution role) and one for running
the tasks (task role). Both of these roles can be assumed via the `ecs_execution_assume_policy_doc` which basically
says 'allow
the [service principal](https://docs.aws.amazon.com/IAM/latest/UserGuide/using-service-linked-roles.html) `ecs-tasks.amazonaws.com`
use this role'. We then attach a policy to the _execution role_, which allows it to do anything with logs. This is so
that the execution user can place our logs into cloudwatch. There are no extra requirements for our task user at this
point.

This setup is relatively simple again. Things like access to S3 buckets, secret keys and other AWS services are
configured against the task and execution roles. For example putting a kms key on the service will require the _
execution role_ to have access inorder to place the key. Then if private s3 access is required, accesses should be
granted to the _task role_ for s3 access and if necessary, the vpce.

Ok, finally, after IAM and Task definitions we can define our service. The service is basically a, well, a service. It
does stuff. In our case, running an API. We also want to place a few extra pointers into it though; like how its
launched, the networking capabilities and a load balancer. We will come on to the load balancer in a bit but here is the
service definition.

```hcl
resource "aws_ecs_service" "api_service" {
  name            = local.ecs_service_name
  cluster         = aws_ecs_cluster.my_ecs_cluster.arn
  desired_count   = 3
  launch_type     = "FARGATE"
  task_definition = aws_ecs_task_definition.api_task.arn
  load_balancer {
    target_group_arn = aws_lb_target_group.rest_api_blue_group.arn
    container_name   = local.ecs_container_name
    container_port   = local.ecs_app_port
  }
  network_configuration {
    subnets          = module.vpc.public_subnets
    assign_public_ip = true
    security_groups  = [
      aws_security_group.application_access.id
    ]
  }
  tags            = local.default_tags
}

resource "aws_security_group" "application_access" {
  vpc_id      = module.vpc.vpc_id
  name_prefix = "whoami_access_"
  ingress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    description = "http inbound"
    from_port   = local.ecs_app_port
    to_port     = local.ecs_app_port
    protocol    = "tcp"
  }
  // bit of a hack, see below for a patch
  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "all"
    cidr_blocks      = [
      "0.0.0.0/0"
    ]
    ipv6_cidr_blocks = [
      "::/0"
    ]
  }
  tags        = local.default_tags
}
```

Note we're also providing a security group - defining who can access our service. This is tru not only because of the
security group, however. As part of the VPC definition we asked for _public_ subnets, ones with public facing IPs.
Hence, all containers spun up in this service will be assigned a public anda private IP. The max size of the service is
the number of IPs in the CIDR block. If we assigned it a private subnet, it would only be accessible internally in our
VPC.

Two things of significance in the security group to note are

1) The ingress is only for the application port. This is the "host" port, which then has to be open and mapped to our
   container (see the container definition for the "host":container mapping)
2) The egress means our containers can access anything. This is so we can pull the image from docker hub but is a **
   major security flaw** if the containers are compromised. Patching this requires the image to be located and pulled
   internally from an AWS ECS Registry.

The last thing to look at is the Load balancer and Auto Scaling Group.

### 2.3 - Getting Scale

Scalability and reliability should be thought of at every point of your stack. This API example is no different. There
are a few places we have baked in reliability and some we can change. For example, baked in:

* AWS services - [they all have their own SLAs](https://aws.amazon.com/legal/service-level-agreements/)
* Our code/service - should have good paths to failover and retry operations internally.

Other places we can add reliability is how we scale to meet demand. We automatically become more reliable if we can spin
up and kill off containers that meet certain thresholds or fail health checks. Below is the definition of our load
balancer.

```hcl
resource "aws_lb" "api_load_balancer" {
  name               = "api-lb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [
    aws_security_group.application_access.id
  ]
  subnets            = module.vpc.public_subnets
}

resource "aws_lb_target_group" "rest_api_blue_group" {
  name        = "rest-api-blue-group"
  vpc_id      = module.vpc.vpc_id
  target_type = "ip"
  port        = local.ecs_app_port
  protocol    = "HTTP"
  health_check {
    healthy_threshold = 3
    path              = "/hello"
    port              = local.ecs_app_port
  }
  depends_on  = [
    aws_lb.api_load_balancer
  ]
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_lb_listener" "api_listener" {
  load_balancer_arn = aws_lb.api_load_balancer.arn
  port              = 80
  # port receiving traffic on lb
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.rest_api_blue_group.arn
  }
  depends_on        = [
    aws_lb_target_group.rest_api_blue_group
  ]
  lifecycle {
    create_before_destroy = true
  }
}
```

Notice there are 3 parts. The **Listener**, which is the far end consumer facing part of the stack. Its set up to listen
on port 80, and send its traffic to the target group. This is where we could attach domain names and TLS certs for a
nice API domain, like `api.tobydevlin.com`, or
add [other types of actions](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_listener#default_action)
. There are plenty of ways to leverage a Load Balancer Listener, my example is a very bland one. (i should really have
added a cert but that's left as an exercise of the reader.)

In the next stage is the **Target Group**. You can point to multiple target groups at one time in a blue-green deploy
strategy if needed, hence the name of mine. In my case i just have a single group which listens on a port, and has a
health check. Its configured to have a group of IPs in its pool, but can be configured
with [others](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lb_target_group#target_type).
There is also capability for sticky routing and traffic distribution strategies where needed.

Finally, we have the **Load Balancer itself** - the final piece of the puzzle. It's placed on the service at creation
and glues the pieces together. This LB can be shared via a vpce and has settings that tell AWS how to handle it. The
main point is the `type` which defines how the lb [should work](https://aws.amazon.com/elasticloadbalancing/features/)
and what layer of the network stack it operates in.

### 2.4 - RDS & Data

... Coming soon! When I have spare time.

### Wrapping up - Easy Mode Considerations

Throughout this we have taken a few "easy mode" decisions, I've commented on the largest below.

* **Single VPC** - it is possible to secure an app with a public and provate VPC, rather than subnets as we have done.
  This will allow much more control about who is able to access what. Ideally, in high security situations, noone should
  access the prod data apart from the API itself and approved egress solutions. This can be done by spinning up our RDS
  cluster in a second VPC and providing it as a service via
  a [VPC Endpoint](https://docs.aws.amazon.com/vpc/latest/privatelink/vpc-endpoints.html) to our service, along with all
  the security bells and whistles.
* **Fargate ECS Capacity Provider** - as mentioned in section [2.2](/blog/off-to-the-cloud-part-1/#22---ecs), we have
  defaulted for Fargate, AWSs [serverless compute option](https://aws.amazon.com/fargate/). This means that we don't won
  the underlying infra and hence don't have full control. For example if we wanted to have dedicated underlying hosts or
  a bare metal host Fargate means this isn't possible. This is something to keep in mind when managing ECS containers.
* **Docker Hub Repo** - At the end of the day, minimizing the tools you use can save a lot of money. This strategy of
  building an ECS task off a docker image stored in Dockers own registry saves us time by not having to set up a secure
  SDLC (I did it all manually tbh). In an ideal world the container image should be built in a CI and pushed to, in this
  case, an internal [AWS ECS Container Registry](https://aws.amazon.com/ecr/) which we have full control over who and
  how the containers are accessed and can be accessed via a more constrained security group. This is all out of scope,
  and maybe ill do a post on secure, scalable SDLC in another post.
* **Full Egress on API Containers** - Allowing egress on all ports and protocols is a hack to allow communication to
  docker hub (see above for how to mitigate this risk). By opening this up it allows anyone to egress information from
  our servers if they have access. Consider closing this if you're implementing for production.
