---
layout: post
date: 2020-11-14 10:13:18.UTC
title: Restoring My College .Net Application
image: ''
publish: false
tags: []

---
# My First Code Experience

During college, I took a computing module. It was taught by an enthusiastic man who, because of this course, has influenced my career decision to move into software and taught me to know just enough to solve the problems at hand and argue every last detail until proven wrong; so thanks, Joe. In retrospect, I probably should have made more effort with this project but the name of the game was to just pass, looking back at it now this thing was full of security flaws and was built under a flawed development model. It was great!

This code was initially developed on a rubbish laptop that sometimes turned off unexpectedly, with the entirety of development isolated from any type of version control or any type of backup. However, to submit the code to the exam folk the entire piece of work: design proposal, waterfall dev cycles, code, 143 pages of manual test evidence, had to be printed, bound and shipped off - all for that vital number telling me how clever I was (am).

This post will be dedicated to the story of how I brought it back from the **paper** I was forced to print it out on and into the 21st century - open-source crap dumped on Github.

## The First Steps

The code is on paper so I need to have the entire (  ) page collection of code transcribed into actual text. From there I can look into building the class structure and finally running the app.

### Pictures!

I have painstakingly photographed every page of code that's required with my phone as my data collection step. This includes all the SQL files where, for some foreshadowed[^1] reason, I picked '_chicken_' for all my passwords. Security at its finest.

![](content/img/netlifyCMS/20201111_200202-2.jpg)

> My favourite part of this, outside of the code, is the mistakes I make but obviously not fixed (or fixed by pen, earlier in the project), like the well described "Center Number" I give in **every header of the project doc**. Can you tell I was destined for great things?

From here all I now need to do is turn this into a block of text I can plop into a file and run!

### Image to Text work

Or Optical Character Recognition (OCR) as it's known, is the next phase. This is a boring basic part - yes I could write my own OCR and have it all generate correctly but this is not the point of this blog post (and will be left as an exersise to the reader). The real solution here is using cloud to speed up the work. Here are te options:
 
 - [AWS Rekognition](https://aws.amazon.com/rekognition/) (not amazing) 
 - [Google Drive image to text](https://support.google.com/drive/answer/176692?co=GENIE.Platform%3DDesktop&hl=en) (better)
 - [Azure coputer vision](https://azure.microsoft.com/en-gb/services/cognitive-services/computer-vision/) (pretty good)
 - [Online tool](https://www.onlineocr.net/) (good but manual copy-paste will suck)
 
Many of these require urls of images to be provided, all the images for this project are open sourced under the Github repo. 


[^1]: This **must** have been the catalyst for Mum.