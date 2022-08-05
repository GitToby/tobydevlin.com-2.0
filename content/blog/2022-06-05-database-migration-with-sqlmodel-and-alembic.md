---
layout: post
date: 2022-06-05T19:45:52.316Z
title: Database Migrations with sqlmodel and alembic
publish: true
image: /content/img/netlifyCMS/library-unsplash.jpg
tags: 
 - python
 - databases
---
[sqlmodel](https://sqlmodel.tiangolo.com/) is a very useful proxy tool that allows [pydantic](https://pydantic-docs.helpmanual.io) models and [sqlalchemy](https://www.sqlalchemy.org/) models to be combined.
This allows [FastAPI](https://fastapi.tiangolo.com/), built by the same author, to intuitively know more about the models' metadata.

This guide will show you how to combine this tool into alembic, and create auto-migrations with a set of helper tools.

### The Setup

We will need 2 functions in 2 files, which are pretty simple. The first is the engine creator.

```python
# database.py
from sqlmodel import create_engine
from sqlalchemy.engine import Engine


def get_db_engine(url) -> Engine:
    return create_engine(url)
```

Which will create the SQLAlchemy Engine object for us.
This is used for alembic to connect to the database, I also use this function, cached, to generate Session objects.
The next is used for the models.

```python
# model.py
import uuid
from typing import Optional

from sqlmodel import Field, SQLModel


class Hero(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    secret_name: str
    age: Optional[int] = None


def get_metadata():
    return SQLModel.metadata
```

This file contains all our models, registering the metadata as tables, relationships, indexes and anything else that's
constructed. The `get_metadata()` method must be after the model definitions so the `SQLModel.metadata` is complete.
From here we can touch the alembic _env.py_ function to describe the online environment.

```python
from myapp.database import get_db_internal
from myapp.model import get_metadata

...  # `context` defined as before

target_metadata = get_metadata()


def run_migrations_online() -> None:
    connectable = get_db_internal()

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()
```

The important bit here is the connection and metata are fetched directly from your application via the imports. This
will set up all the correct connection details for the environment. To create production migrations you will have to
generate the migrations on a host with access the prod environment (i.e. script opening a PR from a prod env).

### The Execution

Now we can continue from normal, running `alembic revision --autogenerate` to create revisions on the delta of the
database & metadata Models. Running this will create a new version in the correct directory.

**At this point you may need to manually import `sqlmodel` to link together column types.** Other changes should be made
at this point.

Then running `alembic upgrade head` will update the database up to the correct revision.
