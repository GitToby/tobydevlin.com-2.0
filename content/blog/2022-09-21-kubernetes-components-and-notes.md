---
layout: post
date: 2022-09-21T14:44:21.412Z
title: Kubernetes Components with Terraform & Notes
publish: true
image: /content/img/netlifyCMS/k8s-logo.png
tags:
    - kubernetes
    - cloud native
    - dev-ops
---
# k8s

deployment configuration - how ti create and update versions of your application. once you apply it the control plane
schedules the instances to run on individual nodes. After the initial apply the control plane manages the instances and
makes sure they are up-to-date, ensuring a healthcheck and self-healing when nodes go down.

worker nodes can have multiple (100s) pods running. each node has processes `containter runtime`, `kublet`
and `kube-proxy` running. without these runtimes it will fail - the **Container** runtime runs the pods & images,
kubelet
interacts with the **Container** runtime & the k8s master deployments, kube-proxy is responsible for sending requests to
other services without impacting network performance

the master node has simmilar; 4 services must be running. `api server`, which is responsible for interacting with the
outside world and recieving the metadata changes including validation of requests. the `scheduler` app which is
responsible for actual placement of jobs & pods. It interacts with the `kubelet` on nodes asking them to start the
jobds. `controller manager` is responsible for understanding the existing layout of the state of the cluster,
understanding which jobs have failed or need restarting, i.e. are out outside the resource definition bounds, and sends
requests to the scheduler to get the resources spun back up. `etcd`  is a key-value store which acts as the 'brain' of
the cluster, interacting with the other services to provide them the information needed to run. It is the stateful part
of the k8s cluster

# components of the build

Below is the major components of an application running on kubernetes. We will be creating an example deployment using
the Terraform kubernetes provider.

![k8s overview](https://miro.medium.com/1*eVqphQ2aNKxqHPMPxjRzAA.png)

Its worth noting that all resource definitions in a k8s deployment have a metadata section and a spec section. The
metadata is where you can describe information about the resource like name, tags and namespace. The spec is varied for
each resource and is worth reading up on the specifics in
the [k8s docs](https://kubernetes.io/docs/reference/kubernetes-api/).

> **A note on tagging:** Tags are the way k8s interacts with itself, if a **Deployment** has a set of tags on its pods
> matching that of an existing **Deployment** then the new **Deployment** will interact with those tagged pods,
> potentially
> overwriting the original pods.

## Deployment & Stateful Set

These components are for deploying replicas of images. Every deployment consists of a collection of pods, which in turn
are collections of containers. Normally a **Pod** is a logical deployment of your application and has a single
container,
unless there are required service sidecars such as metric reporters and the like.

Other concepts that are defined alongside the **Pod** include **Container** images port exposures & update strategy.
Each section in the docs for the [**
Deployment**](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/deployment-v1) and [**Stateful
Set**](https://kubernetes.io/docs/reference/kubernetes-api/workload-resources/stateful-set-v1/) will describe what can
be placed in the spec and how it effects the resource

The difference between a stateful set and a deployment are to do with how the pods interact with volumes via volume
claims, [this blog post](https://medium.com/stakater/k8s-deployments-vs-statefulsets-vs-daemonsets-60582f0c62d4) is much
more in depth. There is also a **DaemonSet** object which enables a single **Pod** to be run on each of the nodes in a
cluster, rather than defining application availability it is used more as a cluster management tool.

```terraform
locals {
  whoamiLabelVal    = "whoamiExample"
  whoamiAppLabelMap = {
    appname = local.whoamiLabelVal
  }
}

resource "kubernetes_deployment" "whoami_example" {
  metadata {
    name   = "whoami"
    labels = local.whoamiAppLabelMap
  }
  spec {
    replicas = 5
    selector {
      match_labels = local.whoamiAppLabelMap
    }
    template {
      metadata {
        labels = local.whoamiAppLabelMap
      }
      spec {
        container {
          image = "traefik/whoami"
          name  = "whoami-name"
          port {
            container_port = 80
          }
        }
      }
    }
  }
}
```

## Service & Ingress

**Service**s are ways to link together **Deployment** pods under a single banner. These pods have an IP address which is
likely to change, a service binds these under a single **Service** IP address which balances requests towards the
underlying pods. To know which pods to forward the requests to it leverages
a [`selector`](https://kubernetes.io/docs/reference/kubernetes-api/service-resources/service-v1/#**Service**Spec), a
collection of label pairs, and will forward to any pods which match all the labels in the `selector`. A **Service** also
has a [`ports`](https://kubernetes.io/docs/reference/kubernetes-api/service-resources/service-v1/#**Service**Spec)
section which will define which port to listen and forward requests to. There is a tertiary resource called an Endpoint
which is keeps track of the pods matching the tags. The Endpoint is usually managed for you.

**Service**s can also optionally have multiple ports exposed. In this event we must name the **Service** ports, and can
route
requests to another port that exists on the matching pods. For example a metrics collector which will collect
information about the main **Container** and expose this data in an aggregate form.

There are 4 types of service, structured in layers:

- _Cluster IP_: The default and base type. Nothing more than the above. However, a _Headless Cluster IP_ is when you
  want to talk to an individual pod as a service, rather than load balancing. This may be used when needing to talk to
  asymmetric replicas.
- _Node Port_: This service builds on the Cluster IP and adds a port binding to the node itself and across the
  cluster internally, allowing access to the nodes IP address at the port defined in the service from outside the
  cluster. This is similar to exposing a docker image to the host IP but across all nodes.
- _Load Balancer_: This is another extension of the __Node Port__ **Service** which provides and externally facing load
  balancer on the cluster which routes to the same endpoints as the __Cluster IP__ **Service**. This is similar to the
  Ingres but doesn't have the same feature set.

Ultimately as you move up the service layers you get more and more exposed to the outside world. Thankfully there is
another way to create interactions, especially if it is for public access and not for other internal consumption. An
**Ingress** is a layer that sits on the boundary to the outside world and the cluster.

```terraform
resource "kubernetes_service" "whoami_service" {
  metadata {
    name   = "whoami"
    labels = kubernetes_deployment.whoami_example.metadata[0].labels
  }
  spec {
    #    type     = "LoadBalancer"
    selector = kubernetes_deployment.whoami_example.spec[0].selector[0].match_labels
    port {
      port        = 8080
      target_port = kubernetes_deployment.whoami_example.spec[0].template[0].spec[0].container[0].port[0].container_port
    }
  }
}
```

> **A note on external to internal traffic:** Due to how k8s is inherently self-healing & IPs are constantly changing,
> to
> have a nice externally facing IP on a nice port number it's a good idea to have any domain associated IP outside the
> cluster as a dedicated proxy. This is where an **Ingress** allows domain routing rules on cluster **Service**s whether
> an
> internal service __Cluster IP__ or an external __Load Balancer__

When routing traffic into a cluster for testing there is an easy way to create an ingres loadbalancer by just
port-forwarding requests to an internal service such as the above. By
running `kubectl port-forward svc/whoami 80:8080` all requests to localhost:80 are forwarded to the services port,
allowing connection as if it were a load balancing service.

In a production setting you can use an **Ingress**; a service specifically spun up to take your config and route traffic
to
the correct resource pods. As per [the docs](https://kubernetes.io/docs/concepts/services-networking/ingress/) this is a
relatively complicated matter & can enable things like TLS Certs and path transforms, depending on your provider.

It is recommended to be by a friend that, unless your business is networking, you should go with a more cloud specific
approach when designing public ingres to your cluster. This means leveraging a Load Balancer type **Service** for each
logical internal service you might spin up & then point the clouds native load balancer to the **Service**s IP. This
allows flexibility to not need to manage that specific networking piece of the stack and allow the potentially more
powerful service to manage spikes in traffic, attacks and isolation.

## ConfigMap & Secrets

**ConfigMap**s & **Secrets** are a way of defining variables that might change the runtime of a piece of code. By
updating the data in these resources k8s will change the underlying data on the fly. To refresh the **Deployment** with
the new data, assuming they correct mappings are made in the definitions, is to restart the Pods.

```terraform
resource "kubernetes_config_map" "whoami" {
  immutable = true
  metadata {
    name      = "whoami"
    labels    = local.whoamiAppLabelMap
    namespace = kubernetes_namespace.whoami_ns.metadata[0].name
  }
  data = {
    TEST_DATA   = 1
    WHOAMI_NAME = "a name from config map"
  }
}
```

In terraform the data can be applied to pods by adding the below to the **Deployment**s definition. This will read in
and
apply all the values of the config map to the containers

```terraform
container {
  ...
  env_from {
    config_map_ref {
      name = kubernetes_config_map.whoami.metadata[0].name
    }
  }
  ...
}
```

Similar for **Secrets**, but creating **Secrets** there is a level of encryption applied to maintain the safety of the
data inside. It has the same form as the ConfigMap aboveTo apply this to a **Deployment** just add the below

```terraform
container {
  ...
  env_from {
    secret_ref {
      name = kubernetes_secret.whoami.metadata[0].name
    }
  }
  ...
}
```

In my opinion the best way to manage changes to a **ConfigMap** or **Secret** is to consider them always immutable. If
an update must be made you should swap over to a new version of the resource and force a restart of the Pods.

## Volume

RO Volumes are simple and are useful for mounting things like certificates, secret files or other useful bits of info.
Typically, the entry point is already some defined information already stored as a **ConfigMap** or **Secret**. With
this information you can create volume mounts with the following additions to the **Pod** & **Container** definitions
within the **Deployment**:

```terraform
...
volume {
  name = "imasecret"
  secret {
    secret_name = kubernetes_secret.whoami.metadata[0].name
  }
}
...
container {
  ...
  volume_mount {
    mount_path = "/secrets"
    name = "pod-mount-name"
    read_only = true
  }
  ...
}
...
```

> **A note on Pods & Containers**: the **Pod** is the Kubernetes concept, and the **Container** just a runtime based on
> docker, podman or whatever. When mounting volumes it must first be associated with the **Pod**, then the **Container**
> . Its, like hotel - you must let it into the outer room (lobby) first before allowing it into the inner rooms.

RW Volumes are less important with regular Deployments then Stateful Sets, typically you should only use them if you
need to persist something locally as a cache or as a helper to some process. Ideally applications should be stateless &
Stateful applications should be a dependant cog in the wheel. If your application does do some sort of persistence in a
distributed manner then read & write replicas should be leveraged to ensure data is correct.
