---
layout: post
title: Probability and Inference
date: '2018-01-17 15:15:23'
image: /content/img/old-post-icons/2018-01-17-coins.jpg
publish: true
tags:
    - maths
---

For the AI module in the Computer Science department you have to have a basic understanding of Probability and Inference. Below is an introduction to the probability details covered.

First off there are a few things we have to cover:

-   $p(A)=0.5$ means that event $A$ has a $0.5$ or $50\%$ chance of occurring
-   $p(A,B)=0.5$ means that the events $A$ and $B$ have a $0.5$ or $50\%$ chance of both occurring at the same time
-   $p(A,B|C)=0.5$ means that the events $A$ and $B$ have a $0.5$ or $50\%$ chance of both occurring at the same time given that event $C$ has occurred. This can be written as $\frac{(p(A,B,C)}{p(C)}$

These are pretty basic concepts, and we only really need a few identities to solve all the problems in the exam:

ONE: **Bayes Theorem**
$$\frac{p(A,B)}{p(B)}=p(A|B)=\frac{p(B|A)p(A)}{p(B)}$$

Two: **Partition Theorem**
$$P(A) = \sum^{n}\_{i=1} p(A|B_i)p(B_i)\qquad \text{ for some partion of the space: } S=\cup^{n}\_{i=1}B_i$$

Three: **Chain Rule**
$$p(A_1,A_2,\ldots,A_k) = \prod^{k}\_{j=1}p(A_j|A_1,\ldots,A_{j-1})$$

Four: **Naive Bayes**
$$ p(A_2|B)=\alpha p(B|A_2) p(A_2) \\\\ \ldots \\\\ p(A_m|B)=\alpha p(B|A_m) p(A_m)$$
for some partition of the space: $S=\cup^{m}\_{i=1}A_i$. Note this will probably require conditional independence.
i.e. for $A$ and $B$ to be CI given $C$ we can write: $p(A,B|C)=p(A|C)p(B|C) also: p(A|B,C)=p(A|C)$

These 3 are used whenever a question comes up.
There are lots of possible Questions but there will always be the required combinations given.
Splitting up what is asked for you buy the question in a certain way will provide an evaluable line.
Some examples are below:

![Naive-Bayes-question](/content/img/old-posts/2018/01/Naive-Bayes-question.png)

Here were given:

$$
\begin{bmatrix}
p(A)=0.75 & p(I)=0.2 & p(W)=0.05 \\
p(wh|A)=0.15 & p(wh|I)=0.5 & p(wh|W)=0.1 \\
p(b|A)=0.15 & p(b|I)=0.1 & p(b|W)=0.2
\end{bmatrix}
$$

Where: $A$=android, $I$=iOS, $W$=windows, $wh$=white & $b$=british. We are asked to find:

Here, notice it says being white and a british sim are independent. thus

$$\alpha p(wh,b|I) p(I) = \alpha p(wh|I) p(b|I) p(I)$$

Now, we just need to find $\alpha$ by computing this for all of the partition sections: $A$=android, $I$=iOS, $W$=windows:

$$
p(A|wh,b)=\alpha p(wh,b|A) p(A) = \alpha p(wh|A) p(b|A) p(A) \\
p(W|wh,b)=\alpha p(wh,b|W) p(W) = \alpha p(wh|W) p(b|W) p(W)
$$

or:

$$
p(A|wh,b) = \alpha 0.15 \times 0.15 \times 0.75 \\
p(W|wh,b) = \alpha 0.1 \times 0.2 \times 0.05\\
$$

Note that this is itself a partition so they must add up to 1:
$$\alpha (0.5 \times 0.1 \times 0.2) + (0.15 \times 0.15 \times 0.75) + (0.1 \times 0.2 \times 0.05) = 1$$

thus,
$$\alpha = \frac{1}{(0.5 \times 0.1 \times 0.2) + (0.15 \times 0.15 \times 0.75) + (0.1 \times 0.2 \times 0.05)} =\frac{80}{223}$$

Now we have found alpha, its easy to calculate whichever value we need:
$$p(I|wh,b)= \frac{80}{223} p(wh|I) p(b|I) p(I) = \frac{80}{223} (0.5 \times 0.1 \times 0.2) \approx 0.3587$$

And were done for this question. Boom, 10 marks!
