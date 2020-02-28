---
layout: post
title: Coding  Theory - Linear Codes
image: /assets/images/posts/2017-11-24-coding-theory-img.jpg
date: '2017-11-24 16:05:34'
tags:
    - maths
    - coding-theory
---

This will concern mostly the section of linear codes in the course of Coding Theory & Data Compression at Cardiff University. It is expected the reader knows about some sections of coding theory, there isn't background reading on this blog... yet­ƒòú.

---

Things to know to start:

-   The _alphabet_ we will be using is the set \\(F_q\\) where \\(q\\) is prime.
-   We will regard the _vector space_ \\(V(n,q)\\) as the set of words \\((F_q)^n\\), a vector in \\(V(n,q)\\) denoted \\((x_1,x_2,...,x_n) \\) will be written as \\(x_1 x_2 ... x_n\\).
-   A _linear code_ \\(C\\) is just a subset of the space \\(V(n,q)\\)
    -   This code will a linear code in itself if and only if it is a vector space under the same operations as \\(V(n,q)\\).
    -   A _binary code_ will be linear if and only if the sum of any two words is itself a word in the original set. i.e. \\( \forall x,y \in C \quad (x + y) \in C \\)

Note:

1. A \\(q-\\)ary code \\([n,k,d]\\) is also a \\(q-\\)ary code \\((n,q^k,d)\\) code (by a theorem on basis of subspaces). This is not two way, \\([n,k,d] \Rightarrow (n,q^k,d)\\) but \\( (n,q^k,d) \not\Rightarrow [n,k,d]\\).
2. The \\(\bf{0}\\) vector is automatically in any linear code.
3. Linear Codes may be referred to as _Group Codes_ in some texts.
4. The terms "word" and "vector" are synonyms in the context of a linear code.

---

The _weight_, \\(w(\bf{x})\\), of a word in \\(V(n,q)\\) is defined to be the number of non-zero entries in the word: \\(\bf{x}=111010\\) has \\(w(\bf{x})=2)\\).

One of the most useful properties of a linear code is that \\(d(C)\\), its minimum distance, is equal to the smallest of the wights of its codewords: \\(d(C)= min(w(\bf{x})) \quad \forall \bf{x} \in C\\).
