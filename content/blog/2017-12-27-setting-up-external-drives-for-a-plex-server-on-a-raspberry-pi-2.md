---
layout: post
title: Setting up external drives for a Plex server on a Raspberry Pi
date: '2017-12-27 23:04:55'
image: /assets/images/posts/2017-12-27-raspberry.jpg
tags:
- getting-started
- code
---

Headless Plex server on a Raspberry Pi for all your own media to stream anywhere sound interesting? This will be brief because it's more or a reference for myself. All the files I used are sitting on [this](https://github.com/GitToby/Plex-Pi) github page! Feel free to open an issue  (or google the problem ­ƒæì­ƒæì) if its not working for you.

First, flash [raspbian lite](https://www.raspberrypi.org/downloads/raspbian/) onto the drive using the image from the internet and [win32 imager](https://sourceforge.net/projects/win32diskimager/)

Edit wpa_supplicant.conf in a text editor to include your internet id and password. Add these 2 files in the root partition (this lets you ssh & wifi to start on load)

I formatted any external drives to be on an **ntfs** format, named whatever you want.

Plug everything in and power up the pi. Connect using PuTTY or some other SSH client (you can find the internal ip of the pi on your routers DHCP Table) using the default user and pass: pi & raspberry. (change these when you get in for security) Then we can mount our external drives using the following steps:

 1. Create directories you want to keep all your mounted drives in using `sudo mkdir /media/SOMETHING-1`. Do this for each external drive. I have:

```
pi@TOBY-rpi:/media $ ls -la
total 16
drwxr-xr-x  3 root root 4096 Dec 27 22:57 .
drwxr-xr-x 22 root root 4096 Dec 27 22:24 ..
dr-xr-xr-x  1 root root 4096 Dec 26 15:09 Overflow
```

 1. Get the UUID of the disks by running the following command: `sudo blkid` to give something like: (note im only mounting Overflow, not Black-Box)

```
pi@TOBY-rpi:/ $ sudo blkid
/dev/mmcblk0p1: LABEL="boot" UUID="CDD4-B453" TYPE="vfat" PARTUUID="bc94ccd3-01"
/dev/mmcblk0p2: LABEL="rootfs" UUID="72bfc10d-73ec-4d9e-a54a-1cc507ee7ed2" TYPE="ext4" PARTUUID="bc94ccd3-02"
/dev/sda1: LABEL="New Volume" UUID="5C10-9CA7" TYPE="exfat" PARTUUID="14112f0f-01"
/dev/sda2: LABEL="Overflow" UUID="8096E11896E11008" TYPE="ntfs" PARTUUID="14112f0f-02"
/dev/sdb1: LABEL="Black-Box" UUID="D43ADA443ADA2372" TYPE="ntfs" PARTUUID="42751a44-01"
```

 2. Find the disk partition(s) from the list you want to add and note the **UUID**. Not the PARTUUID

 3. Edit the fstab file using the command `sudo nano /etc/fstab`. Add lines in the fstab file like this (change the #values#) for each of your drives

    ```
    UUID=#YOUR-UUID# #/media/SOMTHING-1# ntfs defaults,auto,umask=000,users,rw 0 0
    ```
    I then added to the file the last line so it looked like this:
    ``` 
    proc            /proc           proc    defaults          0       0
    PARTUUID=bc94ccd3-01  /boot           vfat    defaults          0       2
    PARTUUID=bc94ccd3-02  /               ext4    defaults,noatime  0       1
    UUID=8096E11896E11008 /media/Overflow ntfs defaults,auto,umask=000,users,rw 0 0
    ```
  > **NOTE: If you boot up the pi with a drive in this file not attached it will fail to boot correctly and there will be no wifi, or any other connection (so no SSH). If this happens, reboot with all the drives attached and remove the UUID from the fstab file to allow a correct boot.**
  
 6. Restart your pi with `sudo reboot`. Once you reboot the pi for the first time after making changes there might be a 3-4 min wait (while the pi looks through the disk(s)) after your reboot before the pi responds using SSH or over the web.

You should now be able to go check the files exist where you said they should exist. If so, CONGRATS! You can now put on the plex server, following [this](https://thepi.io/how-to-set-up-a-raspberry-pi-plex-server/) is how I finished off the rest of the project. No need to duplicate a good walkthrough.

Happy Coding!