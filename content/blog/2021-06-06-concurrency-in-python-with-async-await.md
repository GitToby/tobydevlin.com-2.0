---
layout: post
title: Concurrency in Python with Async Await
publish: true
image: /content/img/netlifyCMS/external-content.duckduckgo.com.jpg
tags:
  - python
---
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


```
>>> doing task one
found wait of duration 1 seconds
<<< finished task one
>>> doing task two
<<< finished task two
>>> doing task three
found wait of duration 3 seconds
<<< finished task three
took 4.0132363 seconds
--------------------
>>> doing task two
<<< finished task two
>>> doing task three
found wait of duration 3 seconds
>>> doing task one
found wait of duration 1 seconds
took 0.00012020000000045883 seconds

Process finished with exit code 0

```