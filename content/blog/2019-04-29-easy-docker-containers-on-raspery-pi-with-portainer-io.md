---
layout: post
title: Easy Docker Containers on Raspery Pi With Portainer.io
date: 2019-04-29T20:26:59.121Z
image: /content/img/netlifyCMS/container_mgr.png
publish: true
tags:
    - code
    - docker
    - Raspberry Pi
---

[Portainer](https://www.portainer.io/) is a great docker management GUI which is open source, hosted on [GitHub](https://github.com/portainer/portainer). We're going to shove it onto a raspberry pi and run a few images. This guide assumes a few things: _ You have a Pi already running [Rasbarian Lite](https://www.raspberrypi.org/downloads/raspbian/), connected to your network with ssh access _ You know what [Docker](https://www.docker.com/) is \* You want to make managing a home server really easy.
So, here we go:

#### 1 - SSH in and Get HackingOnce you're in we need to get

Docker up and running on our machine. Run `curl -sSL https://get.docker.com | sh` and by magic docker will be pulled down and installed on the Pi.

#### 2 - Grab the Portainer Image and Go!

We got docker running, now we can launch the Portnainer image and see what happens. The image will want to have drives so we can persist data to memory and such we need to have a couple of extra args to the command. This works out as:

`docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v /path/on/host/data:/data portainer/portainer`

This will also map port 9000 in the container to port 9000 of the Pi, so we can access the dash!

#### 3 - Reap the Spoils

Hit up http://\<YOUR_PI_IP\>:9000 and you got yourself a container dash to mess about with! Log in, make an admin user, set up local deployments & try deploying some stuff and see what containerization is all about!
