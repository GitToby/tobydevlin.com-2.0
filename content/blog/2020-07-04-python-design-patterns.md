---
layout: post
title: Python Design Patterns
publish: false
image: /content/img/netlifyCMS/pattern.jpg
date: 2020-07-01T14:24:01.915Z
tags:
    - python
---

# Pre Work

Recall how to define an interface in Python:

```python
import abc


class MyInterface(metaclass=abc.ABCMeta):
    def __init__(self, name):
        self._name = name

    @abc.abstractmethod
    def my_method(self, value:str) -> str:
        raise NotImplementedError

    @property
    def size(self):
        return self._name
```

This can then be imported and inherited as follows:

```python
class MyClass(MyInterface):
    def my_method(self, value: str) -> str:
        return f'{value} after being called from {self._name}!'


mc = MyClass('Instance One')
print(mc.my_method('Hello world!'))
# Hello world! after being called from Instance One!
```
