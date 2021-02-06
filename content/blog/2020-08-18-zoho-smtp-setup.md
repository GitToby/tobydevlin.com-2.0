---
layout: post
date: 2020-08-18T20:42:01.785Z
title: Zoho SMTP Setup
publish: true
image: /content/img/netlifyCMS/onlineprinters-oIpJ8koLx_s-unsplash.jpg
tags:
    - email
    - zoho
    - open-media-vault
---

This is very useful to send automated emails with a custom domain, for example, _notifications@tobydevlin.com_ - my notifications email I get things like [Open Media Vault](https://www.openmediavault.org/) SMTP notifications and, eventually, client notifications if they need to interact with tobydevlin.com services.

The first step of this tutorial is to set up a Zoho email, potentially with a custom domain, by following [this page](https://www.zoho.com/mail/custom-domain-email.html).

## The Settings

1. You'll need an email user, I did this by adding a new user in the admin screen. Provide it with a password and log in with as the new user (or do this with your main user)
2. Head to the "My Account" page then the [security > app passwords](https://accounts.zoho.eu/home#security/app_password) page.
3. Create a new App Password and make a note of it.
4. Now you can set up an SMTP connection using the [SMTP details](https://www.zoho.com/mail/help/zoho-smtp.html) that Zoho provides.

These boil down to:

-   Outgoing Server Name: smtp.zoho.eu
-   Port: 587
-   Security Type: TLS
-   Username: '\<your mail address>'
-   Password: The app password you noted earlier

Here is the example from Open Media Vault:

![](/content/img/netlifyCMS/open-media-vault-smtp-setup.png)
