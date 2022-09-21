---
layout: post
date: 2022-08-24T17:23:44.103Z
title: Performance & Concurrent Python by Example
publish: true
image: /content/img/netlifyCMS/snowflake-unsplash.jpg
tags:
- python
  - multithreading
  - multiprocessing
    - async
---

This post is really a "by example" intro to some python modules, namely `threading`, `multiprocessing` and `asyncio`
mainly. There is a great [docs page](https://docs.python.org/3/library/concurrency.html) that describes a lot about
concurrency details, this post will be pretty much common examples of ones given there.

First some concepts....

**Concurrency** - Concurrency means to do things at the same time.

**Process** - A process is an independent sequence of events a machine runs. Typically processes have their own memory
space, copy of the execution bytecode and a collection of threads. Every process will have a main thread.
_Multiprocessing_ is the concept of having multiple _processes_ allowing _concurrency_.

**Thread** - A thread is a sequence of events inside a process. They share the memory space of the parent process. It is
a form of _concurrency_ allowed by [preemptive](https://en.wikipedia.org/wiki/Preemption_(computing)#PREEMPTIVE)
tasking.

**Asynchronous** - Something that is asynchronous, or async, provides the capacity to run things together in a
non-blocking manner _concurrently_. _Multiprocessing_ and _multithreading_ are both examples of asynchronous
programming. Python exposes the `asyncio` module which allows creation of _coroutines_ to enable native concurrency for
IO bound tasks.

**Coroutines** - A Coroutine is a software implementation of concurrency
via [cooperative](https://en.wikipedia.org/wiki/Cooperative_multitasking) tasking. They are not as heavyweight as
_threads_ and usually have native implementations; examples exist in [go](https://go.dev/tour/concurrency/1),
[kotlin](https://kotlinlang.org/docs/coroutines-overview.html) and
[python](https://docs.python.org/3/library/asyncio-task.html).

So with these definitions - why do we need them? Ultimately these ideas were born out of removing inefficiency in
programming, removing blocks that exist in the ecosystem. For example REST calls, File reads, database calls or long
running single threaded processes using the whole cpu. As an example I've created the below script as that contains a
bunch of blocking code and we can see how much faster we can get it.

## The Tasks

I have created a set of examples of bound processes that can be optimised.

### Network bound - make a bunch of API calls to a service that may have throttling

For example, we call an API endpoint 5 times then we find the most common letter.

```text
0 ['AVWRzUqfgqcCrA', 'vHDoiLKyCLfNA', 'BZmoJPNoSEOwDRhsGF', 'EaZVLPfhCEZ', 'Pqqjv']
1 ['QENhOvftN', 'WRxnvSbBTONeWcRvt', 'kNVmFSTkzhOOLOaQ', 'TufAgjqwIjXVw', 'AIZGVFdty']
2 ['CohSFXdJmWKecRp', 'mTBxtc', 'ZdTIEWCRZNkZpFGDfTHb', 'zwIpKJvjlKTR', 'VxGeHvqqu']
3 ['LLLLYcLwkkpgNzlUCmH', 'lPXtoH', 'crNtHoQDwst', 'tVRQqAsegEYVHnlQrz', 'bBhRjNsZSUWe']
4 ['BUTBxqbZYiq', 'VJHPhtZZWfcior', 'hFXxYKqcSSfGXVm', 'aWRLqWtuQ', 'dscyktlpVNi']
most common letter found is ('q', 12)
```

Making the number of iterations much higher means we have to deal with the server dealing with multiple requests at a
time. We can also ask this to be done multiple times then write the result to disk.

```python
import json
import time
from collections import Counter
from pathlib import Path

import requests


def ns_to_s(ns: int) -> float:
    return ns / (pow(10, 9))


#########################
# BLOCK 1 - IO bound
#########################
BASE_DIR = Path(__file__).parent.resolve()
OUT_DIR = BASE_DIR / 'out'
OUT_DIR.mkdir(exist_ok=True)

ITERATIONS = 5
REQUESTS = 30
start_time = time.perf_counter_ns()
data = []
for iter_no in range(ITERATIONS):
    print(f'iteration {iter_no}...', end=' ')
    iter_start_time = time.perf_counter_ns()
    for _ in range(REQUESTS):
        res = requests.get('https://www.randomnumberapi.com/api/v1.0/randomstring?min=5&max=20&count=5')
        res_json = res.json()
        data += res_json

    join_str = ''.join(data)
    counts = Counter(join_str)
    with open(OUT_DIR / f'results.{iter_no}.txt', 'w') as f:
        json.dump(
            {
                "data": data,
                "counts": {
                    k: v for k, v in counts.items()
                }
            }, f
        )
    print(f'done in {ns_to_s(iter_start_time - start_time)} seconds')

block_1_time = time.perf_counter_ns()
print(f'block 1 complete after {ns_to_s(block_1_time - start_time)} seconds')
```

Initial results show this:

```text
iteration 0... done in 1.1208e-05 s
iteration 1... done in 7.409624667 s
iteration 2... done in 19.677559667 s
iteration 3... done in 29.188714042 s
iteration 4... done in 34.216673708 s
block 1 complete after 39.480275125 seconds
```

Looks like we can improve a lot. So how? well first we are doing things multiple times; making rest requests & writing
to disk. The two loops differ in one way though; the outer loop dosent depend on the result of the calls outside
its loop. Inner loop requires knowledge of all calls in its iteration. This is a good example of where we can implement
concurrency in different ways. Because of the shared vs non shared memory we can abstract these in separate ways; below
is a great example by Kay Jan Wong in
her [blog post](https://towardsdatascience.com/multithreading-and-multiprocessing-in-10-minutes-20d9b3c6a867).

![multiprocessing by Kay Jan Wong](https://miro.medium.com/max/1400/1*hZ3guTdmDMXevFiT5Z3VrA.png)

As per the diagram we will multi-*thread* the rest calls, but multi-*process* the outer iterations. First we must make
some changes to the code.

```python

```

### CPU bound - a bunch of tasks that will lock up the cpu doing processing

The we can create a CPU bound task for the result by creating number in the form of
a [mersenne prime](https://www.mersenne.org/primes/), and check that its a true prime

$$
p = 2^n-1
$$

and check with

```python
from math import sqrt


def is_prime(n: int) -> bool:
    if n < 2:
        return False
    for x in range(2, int(sqrt(n)) + 1):
        if n % x == 0:
            return False
    return True
```

leaving something like

```text
('s', 5, 31, True)
('E', 6, 63, False)
('f', 8, 255, False)
...
('a', 3, 7, True)
('m', 6, 63, False)
```

# Bumping the computation size

We will focus on each problem separately, improving the parallel queries to the API then fixing the result set before
optimising the prime calculation. This means we don't have to seed the random numbers, we can work with a sufficiently
difficult count result to improve on. This is the full starting code:

```python

```
