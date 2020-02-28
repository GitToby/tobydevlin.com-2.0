---
layout: post
title: Kubernetes Setup on a Raspberry Pi
date: 2019-04-27T17:06:57.778Z
image: /assets/images/cms/k8s-im.jpg
tags:
  - code
---

I want to be able to develop apps in my spare time. Modern, scalable, disposable apps. The current _hip_ thing (other than serverless functions, but I'm more of a back end dev so here we are) is to build a containerised app. I'm looking to leverage [docker](https://www.docker.com/) and [kubernetes](https://kubernetes.io/) to build an app which can scale almost infinitely depending on how much money I throw at it.

> Kubernetes is a portable, extensible open-source platform for managing containerized workloads and services, that facilitates both declarative configuration and automation. It has a large, rapidly growing ecosystem. Kubernetes services, support, and tools are widely available.

More specifically I want to create a home Kubernetes cluster (on one Raspberry pi, ill expand to 1+ later) which will allow me to develop and run things internal to my home network. Heres what we're gonna do:

## 1 - Set Up Our Host

Get a [Raspbery Pi](https://www.raspberrypi.org/) and shove on a [Rasbarian lite](https://www.raspberrypi.org/downloads/raspbian/) distro. [This](https://www.raspberrypi.org/documentation/installation/installing-images/README.md) is a great tutorial; it will walk you through flashing the iso to the drive.

## 2 - Attach this Pi to your network

1.  Grab the files from [this GitHub page](https://github.com/GitToby/Raspbery-Pi-Setup-Files), then edit the `wpa_supplicant.conf` in a text editor to include your internet id and password. Add these 2 files in the root partition of the sd card after flashing (this lets you ssh & wifi to start on load) and then plug the Pi in and everything will just work.
2.  **Or** make a file called `ssh` in the SD card root partition, then plug the Pi in the ethernet with a wire...
    Now, after it starts you can SSH into your Pi, I recommend using [PuTTY](https://www.putty.org/). You can find the IP address of the Pi in your routers connections page. **UPDATE YOUR PASSWORD FOR THE PI USER NOW** also write it down.

## 3 - Installing the container runtime

Following the wisdom about writing code of any kind:

> Somebody has most likely done this before.

We won't reinvent the wheel, [Alex Ellis](https://github.com/alexellis) has some awesome code already written for this, so we just run `https://github.com/alexellis/k8s-on-raspbian/blob/master/script/prep.sh | sudo sh` and after a while, all the tools we need will be on the Pi. Now we just reboot and we have `kubectl` and `kubeadm` ready to use.

**Note:** it may be useful to run `sudo apt-get update` and `sudo apt-get upgrade` at this point before the reboot too to update everything.

> [`kubeadm`](https://kubernetes.io/docs/reference/setup-tools/kubeadm/kubeadm/) helps you bootstrap a minimum viable Kubernetes cluster that conforms to best practices. With kubeadm, your cluster should pass Kubernetes Conformance tests. Kubeadm also supports other cluster lifecycle functions, such as upgrades, downgrade, and managing bootstrap tokens.

Now, to start we will run `kubeadm config images pull` prior to `kubeadm init` to verify connectivity to gcr.io registries. Then we can init our k8s cluster with `sudo kubeadm init --apiserver-advertise-address=0.0.0.0` to have the master listen on the default network IP too. It may take a while, but eventually, you should get an output like this:

![](/assets/images/cms/k8s-cmd-out.png)

If you have other worker nodes you can connect them with the command shown. Now we need to take the key generated for cluster administration and make it available in a default location for use with kubectl by running the following 3 commands:

```
mkdir -p $HOME/.kube  sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config  sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

After this is run we can check that everything is working correctly with `kubectl get all --all-namespaces`, which should look a little like the below.

![](/assets/images/cms/k8s-cmd-out-2.png)

Hey presto we have a k8s cluster up and running correctly! You can test it running the [minikube](https://kubernetes.io/docs/tutorials/hello-minikube/#create-a-deployment) test deployments!
