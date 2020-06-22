---
layout: post
title: Lazy Databases Concept
date: 2020-06-17T10:04:16.678Z
image: /content/img/netlifyCMS/workflows-category-databases.png
publish: false
tags:
  - code python
---
This is POC web app code that creates database connections and introspects them in the runtime to create REST endpoints and admin screens.
It should be able to connect to multiple databases and store connection details and (stretch) user/connection metrics

It should be written in Python, leveraging either Django or Flask. Open source should be leveaged at any point to cut costs of writing all the code inhouse.

## stages of work
### 1 - build database connector
The app should have an Admin UI, which presents a form to submit database connection settings & a list of connected databases. 
When a form is submitted the details should be stored, a list of known databases updated and the database connection will be formed.
The Database should be introspected via Djangos intorspection tool or SQLAlchemy, to create an ORM to create the REST API.
The DB Connection should have the ability to be reconnected when the app restarts.
Each Database connector should be constructed and in runtime, or on startup.
The ability to connect new databases should not require the app to restart or a code change to occur.
It should support the following databases (via the built in ORMs Django/sqlalchemy has to offer):
- PostgreSQL 
- Oracle
- MySQL
- MariaDB


### 2 - construct REST API & Admin screen
For each database, there should be an Admin screen (either template or js) and a rest API. 
See [Sandman2](https://pypi.org/project/sandman2/) for an example of mono DB connection.
The Admin Screen should display CRUD operations that relate to the corresponding API endpoints.
There can also be an OpenAPI schema associated with each DB REST API.

The Admin screen should
- provide an overview of databases registers
- allow a new db to be added
- a link to the dbs admin screen

The Admin screen shouldnt
- alter database properties 
- interact with database administration

Each Database Admin screen should (essentially the same as DRF or sandman2)
- Show the CRUD endpoints 
- have intractive forms to records

### 3 - Streatch user goal
Have the ability to manage users and manage them in the main admin UI. 
It is prefered to use 3rd party user tools - Firebase/Auth0

### 3 - Streatch metrics goal
Have the Ability to collect rest query metrics - # of queries, limits etc.

### Tools that may help:
 - [Sandman2](https://pypi.org/project/sandman2/)
 - [Flask](https://palletsprojects.com/p/flask/)
 - [Flask SQL Alchemy](https://flask-sqlalchemy.palletsprojects.com)
 - [Django introspection](https://docs.djangoproject.com/en/3.0/howto/legacy-databases/)
 - [Django Rest Framework](https://www.django-rest-framework.org/)
 - [sqlalchemy automap](https://docs.sqlalchemy.org/en/13/orm/extensions/automap.html)
 - [omniDB a python based DB viewer](https://omnidb.org/en/)
