---
layout: post
title: PiPlexed - A guide to setting up a home Media Server on Rasbry Pi
date: 2020-06-07T11:00:01.915Z
image: /content/img/netlifyCMS/home.png
publish: true
tags:
    - Raspberry Pi
    - plex
---

This is a brief step by step guide to setting up a Plex & NAS enabled Pi. It assumes you kinda know what youre doing when it comes to flashing things, taking about networks and files, and using docker/containers on a high level.

# Step 1 - Get all you need

Youll need the following

-   [The Raspberry Pi OS](https://www.raspberrypi.org/downloads/raspberry-pi-os/) with no Desktop.
-   A copy of [Etcher](https://www.balena.io/etcher/) to flash your SD card.
-   A copy of [these files](https://github.com/GitToby/Raspbery-Pi-Setup-Files) to add SSH, Network from boot, no need for anything other than power.

![file screens](/content/img/netlifyCMS/files.png 'file screens')

# Step 2 - Flash your SD card & prep files.

Using Etcher flash your SD card with the Raspberry Pi OS. Once this is done you can place the files you fetched from Github into the root dir. Remember to update the WiFi Passowrd and name in the `wpa_supplicant.conf`. You should be able to boot the Pi now.

![etcher screenshot](/content/img/netlifyCMS/etch.png 'etcher Screenshot ')

# Step 3 - Connect and start Open Media Vault install

Connect using SSH - Windows has a built in tool now, no need to get PuTTY unless you want to for other things. You can find the Pi IP using `arp -a` (it will be the new IP on the list). Installing the OMV is easy, use the following command:

```bash
wget -O - https://raw.githubusercontent.com/OpenMediaVault-Plugin-Developers/installScript/master/install | sudo bash
```

This will download and install all the bits required - it takes time, not is a good point for a coffee break.

![install](/content/img/netlifyCMS/install.png 'install')

# Step 4 - Access GUI and set up drives

Head over to your PIs web portal (at its IP) and log in, The default username is `admin`, and the default password is `openmediavault`:

![log in](/content/img/netlifyCMS/omv.png 'log in')

# Step 5 - Start up Docker and Portainer.

Open Media Vault has set up for Docker and Portainer naitivly, so theres no real trouble getting started. Once you've done this you can also start making a 'docker-compose.yml' for your apps, for example Plex, PiHole, Netdata and Heimdall are shown below:

```yaml
# ===============================
#  RASPBERRY PI DEFAULT SERVICES
# ===============================

version: '2.4'
services:
    # Plex for self hosting video & content.
    # Note: plex wont work if its not on the host network
    # exposed at <host>:32400/web/index.html
    Plex:
        image: linuxserver/plex:latest
        restart: unless-stopped
        network_mode: host
        volumes:
            # Custom mount paths
            - '/export/LittleRedBox/data/plex/config:/config'
            - '/export/LittleRedBox/data:/data'
            - '/export/LittleRedBox/data/plex/transcode:/transcode'

    # Netdata for monitoring the host
    Netdata:
        image: netdata/netdata:latest-armhf
        restart: unless-stopped
        ports:
            - 19999:19999

    # Pihole for setting the
    PiHole:
        image: pihole/pihole:latest
        restart: unless-stopped
        ports:
            - 20053:53/tcp
            - 20053:53/udp
            - 20067:67/udp
            - 20080:80/tcp
            - 20443:443/tcp
        environment:
            WEBPASSWORD: 'newpass'

    Heimdall:
        image: linuxserver/heimdall:latest
        restart: unless-stopped
        volumes:
            # Still need to set up database
            - '/heimdall/config:/config'
        ports:
            - 21080:80
            - 21443:443
```
