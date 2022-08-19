---

layout: post
date: 2021-06-06T10:51:04.815+00:00
title: Concurrency in Python with Async Await
publish: true
image: '/content/img/netlifyCMS/external-content.duckduckgo.com.jpg'
tags: - python
---Concurrency in python has become incredibly simple since the `asyncio` package was created. Any developer, with a small restructuring of flow and an extra couple of keywords, can create easily concurrent applications. With the addition of multiple processes, this can easily become parallel too with the help of the [multiprocessing](https://docs.python.org/3/library/multiprocessing.html) lib.

Below is a simple demo of a task that could include an IO-bound operation where the application waits on another process. There are a list of tasks and a simple execution in both synchronous and asynchronous fashion.

```python
import asyncio
import time


class MyTask:
    duration: int
    name: str

    def __init__(self, name: str, duration: int = None):
        self.name = name
        self.duration = duration


async def do_task(t: MyTask):
    print(f'>>> doing task {t.name}')
    if t.duration:
        print(f'found wait of duration {t.duration} seconds')
        await asyncio.sleep(t.duration)
    print(f'<<< finished task {t.name}')


async def main():
    tasks = [
        MyTask(name="one", duration=1),
        MyTask(name="two"),
        MyTask(name="three", duration=3),
    ]

    # sync
    start = time.perf_counter()
    for task in tasks:
        await do_task(task)
    print(f'took {time.perf_counter() - start} seconds')

    print("-"*20)

    # async
    start = time.perf_counter()
    await asyncio.wait([
        do_task(task) for task in tasks
    ])
    print(f'took {time.perf_counter() - start} seconds')

if __name__ == '__main__':
    asyncio.run(main())
```

This prints out the below.

    >>> doing task one
    found wait of duration 1 seconds
    <<< finished task one
    >>> doing task two
    <<< finished task two
    >>> doing task three
    found wait of duration 3 seconds
    <<< finished task three
    took 4.0182585 seconds
    --------------------
    >>> doing task three
    found wait of duration 3 seconds
    >>> doing task two
    <<< finished task two
    >>> doing task one
    found wait of duration 1 seconds
    <<< finished task one
    <<< finished task three
    took 3.0027220999999997 seconds

As we can see by running the waits as concurrent events we take the execution time + longest wait as opposed to the sum of the waits. Just by leveraging some of the power that `asyncio` provides, we can remove the majority of external processing waiting from our synchronous code. There are also options to fine-tune how these [primitive awaitables](https://docs.python.org/3/library/asyncio-task.html#waiting-primitives) are collected and when execution is handed back to the main process.
