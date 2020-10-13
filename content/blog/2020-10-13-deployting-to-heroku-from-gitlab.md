---
layout: post
title: Deployting to Heroku from Gitlab
publish: true
image: /content/img/netlifyCMS/herokulogo.webp
date: 2020-10-13T18:56:32.412Z
tags:
  - code devops deploy heroku gitlab
---
Having a continues deployment to Heroku from Gitlab is hidden away, previous solutions I've found require putting in docker acrobatics into your `.gitlab-ci.yml` and a rest endpoint; but no more! The solution is simple for most projects.

## Master is Prod
Leveraging the [Gitlab repo mirror](https://docs.gitlab.com/ee/user/project/repository/repository_mirroring.html) tool for only protected branches we can just provide the login for Heroku and we're done! The steps below give more detail:
  1. Install the [Heroku cli](https://devcenter.heroku.com/articles/heroku-cli)
  1. Generate an [access token](https://devcenter.heroku.com/articles/authentication#retrieving-the-api-token)
  1. Set up repo mirroring from your project to `http://user@git.heroku.com/your-app.git`
    * The username is ignored
    * The password is your access token
  1. And were done, pushes to master should mirror into Heroku, build and deploy automagically!

