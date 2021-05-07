---
layout: post
date: 2021-04-29 19:22:29
title: AWS Basics
publish: true
image: /content/img/netlifyCMS/aws-bg.jpg
tags:
  - aws
  - cloud
---

This is a quick overview of the basic tools AWS provides.

## Compute Services

#### EC2

A web service that provides' resizable compute capacity for web scale compute easier for devs'. Concepts:

- Instance Type - the compute, memory and storage definitions
- Root Device Type
   - instance store - physical persistent store on the VM.
   - Elastic Block (EBS) - persistent but not separate from the VM. Preferred.
- AMIs - Templates for the VM, config and os and data.
- Purchase Options
   - On-Demand - any time to spin up or shut down
   - Reserved - discounts for committing for a period of time (years)
   - Savings plan - similar to above but doesn't reserve capacity, includes Fargate and lambda. 
   - Spot - take advantages of low demand. Spins up when bid is above water, shuts down when bid is below water with 2 min warning.
   - Dedicated - physical machine in the datacenter.

Launching an EC2 takes moments. The 'User Data' field is run when the instance is created. Terminate means to delete the whole instance.

#### Elastic Beanstalk

Beanstalk is similar to **EC2** but automates deployment and scaling. It deals with the underlying **EC2** instances for you. Beanstalk is free, the underlying infra is the cost source.
Beanstalk includes monitoring, deployment, scaling & customization, databases, load balance, healthchecks. It can leverage many languages and typically used for web servers; all ingress is also autoconfigured.
Its essentially a Heroku with more options.

#### Lambda

Serverless functional coding, cost per execution code. Has auto scale for demand and runs globally. Deploys via an **s3** bucket.

## Network and Content Delivery

#### Route 53

DNS as a service, all DNS option can be configured here. High availability and has features such as failover.

#### VPC & Direct Connect

**VPC** is an isolated part of the cloud which can only be communicated with by services within the same VPC. Support for IPv4 and IPv6, subnets, IP Ranges, Route Tables and Network Gateways are allowed. Private and Public are both available, via ingress. NAT is available for private subnets.

Placing a service in a **VPC**  means by default only services within that VPC can communicate with it. This can be changed by leveraging services such as **Transit Gateway**, **Internet Gateway** or **NAT Gateway**.

**Direct Connect** is a dedicated network connection to the AWS datacenters to your on perm cloud.

#### Subnets and Availability Zones

A single **VPC** contains one or more **Subnets** which exists in only one **Availability Zone** (basically a datacentre in a given region). A unit of compute, for example an **EC2** instance exists in one and only one **Subnet**; these instances also cannot be moved between **Available Zones**. 

**Subnets** can be private or public. Public means that services within the **Subnet** can access the internet and be accessed by the internet; to make a **Subnet** public its associated **Route Table** has a route with an **Internet Gateway** as a target. 

Private is the opposite, with no access inbound or outbound. A **NAT Gateway** can be used to allow outbound connections from private subnets. 

Here is a handy association guide:

- An **Availability Zone** has many **VPCs**
- A **VPC** has many **Subnets**
- A **Subnet** has a single associated **Route Table**
- A **Route Table** can have many **Routes** that point to things like:
   - A **NAT Gateway**
   - An **Internet Gateway** - making any associated Subnets public
   - **Transit Gateway**
   - **Egress Only Gateway**
   - Many others...

#### API Gateway and CloudFront

**Cloudfront** is a CDN which is global and can run on the edge locations. It has security such as the Shield DDOS protection and the WAF firewall.

**API Gateway** is an API management service, it integrates with many other services and has metrics automatically attached.

#### Elastic Load Balance

Distribution of traffic across compute services (EC2, ECS, Lambda, ...) across availability zones. There are 3 types:

- Application Load Balancer (ALB)
   - Vertical Scaling - Upgrading the type of resource, like increasing memory.
   - Horizontal Scaling - Increase the number of instances behind the load balancer.
- Network Load Balancer (NLB)
- Classic Load Balancer

#### Global Accelerator

This is the application that speeds up your runtimes, its based on static IP rather than DNS. Once a request hits an edge location on the AWS network it will funnel traffic through the AWS Network rather then public internet. It integrates with other services like EC2, ELB. This can also provide tolerance via IPs rather than DNS resolution.

This should be used in scenarios when you're not running HTTP; things like UDP, VOIP or MQTT. Also when you're using static IPs off the line, as it runs on IPs.

### Elastic IP Addresses

By brining or using an amazon **Elastic IP** you can provide a external static IP bound to an **EC2** instances Network Interface, allowing it to be hit by DNS or just via the internet.  

## Storage Solutions

#### S3

Contains a whole load of options such as web serving, web hosting, permissions etc. Its structures into tiers of access that dictates pricing.

- Standard
- Intelligent Tiering
- Infrequent Access - has a single availability option also
- Glacier - for archive solutions

#### EBS and EFS and other File Systems

**Elastic Block Store** is connected to single EC2 instances, multiple storage types are available (ssd, hdd, ...) at different storage performance and encryption at rest.

**Elastic File System** is fully manages NFS file system for Linux supporting petabyte scale over multiple AZs. IT provides different store classes for frequent and infrequent access along with Lifecyle rules for content. It can also be mounted to multiple EC2 instances across zones simultaneously.

**FSx** is the windows managed file system for things like NTFS, AD and SMB.

#### Snowball and Snowmobile

Both are used for loading data into AWS when an upload connection wont cut it. **Snowball** is for moving petabyte scale data into AWS and processing data at the edge, **Snowmobile** is for even large clusters of data. **Snowball** is a physical drive that's provided and couriered to a destination for load. **Snowmobile** is more like a truck, it is a truck, that operated the same.

## Database & Data Utils

#### Databases

**RDS** is a drop in relational database service, giving you all the database tooling without dealing with the underlying infra. Handles provisioning, patching, backup and recovery of databases across multiple availability zones. RBS supports a host of database technologies such as MySQL and Postgres along with many others, including **Aurora** which is compatible in both technologies.

**Dynamo DB** is a both a document and key-value orientated NoSQL database. Its fully managed so you don't need to manage the database layer either, featuring auto scaling and caching.

#### Database migration Service

Used for moving data into **RDS**, is a one time or continues thing. Cost is defined by compute required for the sync.

#### Elasticache

In memory datastore cache which is fully managed. Supports both Memcached and Redis with low latency. Auto scaling is available and handles many standard common use cases like database cache and sessions.

#### Redshift

Data warehousing in the cloud with petabyte scale. Exists with VPC isolation, columnar storage and encryption rest. You can also use it to query data in S3.

## App Integrations

#### SNS

The Simple Notification Service is essentially a pub/sub message service. Its basically Kafka in the cloud, so event based and integrates well with other AWS services.

#### SQS

SQS can be used in conjunction with SNS but is more stateful. IT can be configured with or without order. A basic architecture would publish to SNS then publish to multiple SQS queues to manage the read part further down the line.

#### Step Functions

Manages workflows though a fully managed service. Cost is based on state transitions and also the underlying architecture. Step Functions are good for organizing BPMN processes as an execution service.

## Cloud Management

#### Trusted Advisor

This service allows you look at your best practices, performance and fault tolerance. It is a single pane of glass into your AWS account.

#### Users in AWS

root users are special - they are owners of the account. IAM users are users within the account. IAM users should be used at all places if possible. You can create access keys in the [IAM service](https://console.aws.amazon.com/iam/home) to using in SDKs and the CLI.

#### CloudTrail

Log, monitor and retain account activity across the infrastructure, it outputs into S3 and also Cloudwatch. It can also aggregate over many organizations for a distributed view.

#### CloudWatch

Cloudwatch is the metrics, logging and alarms for your runtimes, including dashboards.

#### AWS Config & Systems Manager

**AWS Config** keeps evaluating infra against a set of rules to keep events correct. It can be set up to manitor custom rules and has builtins.

**Systems Manager** is a tool for managing infrastructure, specifically around things like systems updates and access to servers but via your own creds.

#### CloudFormation

IaC for all infrastructure in AWS. Its a free tool to deploy the services by writing json or yml and manages dependencies of deployments for you. It also fixes config drift when it occurs. Very similar to terraform.

#### Ops works

Managed service for Chef and Puppet, which are config as code providers.

#### Control Tower and Organizations

When you need child accounts this is it. consolidate billing, security and compliance across all these. **Control Tower** is the way that Organizations is configured, for example by creating child accounts by config, consolidating all the AWS accounts created and **Guardrails** to ensure child accounts don't do things they shouldn't.