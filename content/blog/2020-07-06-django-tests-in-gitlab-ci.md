---
layout: post
title: Django tests in Gitlab CI
publish: true
image: /content/img/netlifyCMS/1-bx1gnz1uzfkokmrhq395mg.png
date: 2020-07-06T21:43:41.975Z
tags:
    - python 
    - gitlab
    - django
---
# Django CI

Running isolated tests can be hard - we can solve this problem in Gitlab using the Docker images tooling provided by the runners. We will first provide the base Python image for us to run our code in and then add the Postgres container as a [service](https://docs.gitlab.com/ce/ci/docker/using_docker_images.html#how-services-are-linked-to-the-job)

# The Pipeline

The `.gitlab-ci.yml` will need to start 2 containers, the Python runtime and the Postgres Service. This is done using the following:

```yaml
image: python:latest

# must match lazydb3_api/settings/ci.py settings
variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: runner
    POSTGRES_PASSWORD: 'ci'
    POSTGRES_HOST_AUTH_METHOD: trust

# https://docs.gitlab.com/ce/ci/docker/using_docker_images.html#what-is-a-service
# https://docs.gitlab.com/ce/ci/services/postgres.html
services:
    - postgres:latest
```

This will start the postgres using a couple settings, given in the variables. These are reusable, and we will leverage them later on. These settings must also be placed into your django database settings so you can connect. The service can be accessed with the identifier of the image, in this case postgres. This example provides the connection details:

```
postgresql://runner:ci@postgres:5432/test_db
```

Hence our Django settings will be:

```python
DATABASES['default'] = {
    'NAME': 'test_db',
    'ENGINE': 'django.db.backends.postgresql_psycopg2',
    'USER': 'runner',
    'PASSWORD': 'ci',
    'HOST': 'postgres',
    'PORT': '5432',
}
```

These are hardcoded but could be accessed with the env vars. The next step is to just run these as normal, as in the container you should now be able to connect.
