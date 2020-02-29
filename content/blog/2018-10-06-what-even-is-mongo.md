---
layout: post
title: What Even Is Mongo?
date: '2018-10-06 16:31:55'
image: /content/img/old-post-icons/2017-10-06-mongodb.jpg
tags:
    - code
    - not code
---

# This is a POC for a MongoDB interface

Nothing major, but document model databases allow the chains to be lifted on certain applications that can make them amazingly flexable. They're not without their caviats but knowing how to use one would be a tick of a box when being asked to make an app.

This example MongoDB for Python using `Mongo Client`. It assumes you have all the binarys for MongoDB installed, know where they are, and have a general unserstanding of what mongo is.

Lets begin; first lets start the server:

```python
# start a the mongo server using this in the cmd path
# !"C:\dev\tools\MongoDB\bin\mongod.exe" --dbpath="./data/"
```

The Mongo DB should now be started and the port number is displayed (typically 27017). Next step is connecting to it using python. This is done using a class so our database is essentially an API. _Note: we're using a local connection but this can be configured to be an external call too_

```python
from pymongo import MongoClient

class Connect(object):
    @staticmethod
    def get_connection():
        return MongoClient("localhost", 27017)

connection = Connect.get_connection()
```

This connection is to our database now, were able to perform CRUD operations using it. Data is stored as documents in connections in databases. The connection is to the mongo client, so from here we have 3 levels of structure to go:

-   database
-   collection
-   document

All of these can be accessed using the python accessor notation. Lets first access a (new) database:

```python
# test_db = connection.test
# or
test_db = connection['test']
```

Notice this didn't do anything; this is just a lazy evaluation of the DB, nothings been put in there so it's just sitting there for now and will be created when something is added to a collection. So we now have to access a collection of this `test_db`:

```python
# test_collection = test_db.my_collection
# or
test_collection = test_db['my_collection']
```

from here we can add a new element to our collection and start our database:

```python
movie = {"title": "Venom",
         "year": 2018,
         "description": "When Eddie Brock acquires the powers of a symbiote, he will have to release his alter-ego \"Venom\" to save his life. ",
         "actors": ["Tom Hardy", "Michelle Williams", "Jenny Slate"],
         "director:": "Ruben Fleischer",
         "tags": ["Superhero", "Modern", "Thriller"]}

x = test_collection.insert_one(movie)
```

This addition will yield an object which can display the auto generated ID of the object it just added to the database.

```python
ins_string = str(x.inserted_id)
ins_string

'5bc4f80f59cf703a9cd7f353'
```

This ID is unique across documents and can be used as a "foreign key" type reference for this object. For example, we can search the database for elements with this id: (were using pretty printing so it's nice to read)

```python
import pprint
from bson.objectid import ObjectId

result = test_collection.find({'_id':ObjectId(ins_string)})

pprint.pprint(list(result))
```

    [{'_id': ObjectId('5bc4f80f59cf703a9cd7f353'),
      'actors': ['Tom Hardy', 'Michelle Williams', 'Jenny Slate'],
      'description': 'When Eddie Brock acquires the powers of a symbiote, he will '
                     'have to release his alter-ego "Venom" to save his life. ',
      'director:': 'Ruben Fleischer',
      'tags': ['Superhero', 'Modern', 'Thriller'],
      'title': 'Venom',
      'year': 2018}]

Again note the casting to list, this is because the `find` methods return a cursor which lazily evaluates. Since we have this data now in the database, let's update it. We will touch on more intensive searching later... maybe.

There's a few things we need to understand about mongo to understand how updating works. These will make things much more simple after continued use.

-   always specify if you want to update **one** or **many**. Using `update_one()` will only update the first document it finds with the search criteria, whereas many will `update_many()` that match the criteria.
-   the special keys `$...` will be very useful as they determine how the [searching](https://docs.mongodb.com/manual/reference/operator/query/) and [adding](https://docs.mongodb.com/manual/reference/operator/update/) of values is executed in different ways.

The `update_one()` method will search with the first param and update the document with the second:

```python
y = test_collection.update_one({'_id':ObjectId(ins_string)},
                      {"$set": {"rating": 4, "meta.user":"toby"},
                       "$push":{"tags": {"$each":["Exciting", "Dark"]}},
                       "$currentDate": {"meta.lastModified": True}})
y.raw_result
```

    {'n': 1, 'nModified': 1, 'ok': 1.0, 'updatedExisting': True}

As you can see there's a result about how many were updated after the query. let's take a look at what that did to the document:

```python
result = test_collection.find({'_id':ObjectId(ins_string)})

pprint.pprint(list(result))
```

    [{'_id': ObjectId('5bc4f80f59cf703a9cd7f353'),
      'actors': ['Tom Hardy', 'Michelle Williams', 'Jenny Slate'],
      'description': 'When Eddie Brock acquires the powers of a symbiote, he will '
                     'have to release his alter-ego "Venom" to save his life. ',
      'director:': 'Ruben Fleischer',
      'meta': {'lastModified': datetime.datetime(2018, 10, 15, 20, 27, 46, 91000),
               'user': 'toby'},
      'rating': 4,
      'tags': ['Superhero',
               'Modern',
               'Thriller',
               'Exciting',
               'Dark',
               'Exciting',
               'Dark'],
      'title': 'Venom',
      'year': 2018}]

Now we've created and updated a record we may as well get rid of it. We could in theory just tag it with a soft delete by updating the record and implementing filtering when querying, but we're going to actually remove the document from here:

```python
z = test_collection.delete_one({"_id":ObjectId(ins_string)})
z.raw_result
```

```python
{'n': 1, 'ok': 1.0}
```

Now lets just check that it worked:

```python
result = test_collection.find({'_id':ObjectId(ins_string)})

pprint.pprint(list(result))
```

    []

And that's the full lifecycle of the mongo data. This is a brief POC of the basic functionality, part 2 will put this into an API which is usable and queryable programmatically.
