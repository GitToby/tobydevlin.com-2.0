---
layout: post
title: Building tobydevlin.com
date: '2017-11-25 20:48:09'
image: /content/img/old-post-icons/2017-11-25-code.jpg
tags:
    - getting-started
    - code
---

The tobydevlin.com website is the main product of this large experiment of web design, service building and self tutoring. Understanding web development is pretty crucial to getting a cushy dev job once you graduate so I'm teaching myself ­ƒôê­ƒôê. Hopefully, if I'm good enough, not only will the main page be up, but this blog will also be around too ­ƒÆ¬.

**_Please note: Products mentioned here are because I like using them & they work for me, not because anyone paid me to tell you they're good!_** ­ƒÖä

## What Am I Making?

The website will be built using the modern SPA ([single page application](https://en.wikipedia.org/wiki/Single-page_application)) design, so its really more of a webpage than a whole site. This page then needs some web services sitting on a server somewhere that can provide it with data and security services. By creating my site like this **I've totally invented a microservice structure!** Making things into a network and distributing the processes around the place means things are flexible and easily maintainable.

![Site-Map-example](/content/img/old-posts/2017/11/Site-Map-example.png)

Services can be built with anything, there are frameworks in lots of languages:

-   Node.js
-   Java
-   Python
-   Go
-   Ruby
-   PhP
-   Rust
-   The list goes on...

They are usually bits of code running on a server somewhere (like in the cloud) and just respond to anything that gets asked to them. Its just a name though as these **microservices could be pretty huge** codebases if the service is compex. If you built it wrong it will mostly consist of 500 errors and lots of unhappy customers, so get these bits right in the design before starting your build. Personally I like Python and Node for services because of their flexibility, though Java can be powerful when it needs to be & I don't know the other languages on the list.

These websites (or in my case SPA sites), on the left, could be anything that needs the services on the right _(tho not this blog, its a little different and is more like a service for access flexibility ­ƒô▓)_. They will all be static pages & are a conceptually different to services; theres no server side processing built inside them and its easy enough to **just shove content in an aws S3 bucket or on a github page** and point your DNS to them. (Jakyl Ill be writing a post on Googles new way of doing things soon)

**For a blog site its even easier!** All you do is look for a [framework](https://www.google.co.uk/search?q=blog+frameworks&rlz=1C1CHBF_en-GBGB724GB725&oq=blog+frameworks&aqs=chrome..69i57j0l5.6246j0j4&sourceid=chrome&ie=UTF-8) that suits your needs, follow the steps they detail to make your content, go to your hosting provider and ask them how to point your domain at the hosted content, do that then you're done! ­ƒÅü­ƒÅü­ƒÅü You will have a page on your domain, hosted by someone(maybe you), and then you can just focus on content. **How techie you want to be is up to you**, [ghost](https://ghost.org/) is what this blog sits on and is perfect for what I want to do but has its limits.

## What About Making Custom Pages?

Like I mentioned previously, theres lots of parts to a website, the front end however wants to be personal and beautiful. **tobydevlin.com wants to be something infinitely customizable**. The hardest part about writing a website is actually writing it. For tobydevlin.com and some of its static subdomains I'll be using a few major frameworks surrounding a javascript, HTML & CSS core:

| Framework                             | Reason                                                                                                             |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| [Yeoman](http://yeoman.io/)           | Easily allows me to scaffold out a template pages with a few lines in the terminal.                                |
| [React.js](https://reactjs.org)       | fully functional component based UI designer, not just limited to the web for easily porting ideas to native apps. |
| [Webpack](https://webpack.github.io/) | The requirement to be static is huge, and this is a super easy way to compress and minify the dependency codebase  |
| [PostCSS](http://postcss.org/)        | A powerful way to write css (we also [sass](http://sass-lang.com/))                                                |

**Yeoman is a super cool idea**, have a tech stack you think someone has probably thought of before and probably is common because it works? Check [here](http://yeoman.io/generators/) and if theres a generator for the stack you're in luck! follow the tutorials and plop down a bunch of code in a file (I'm using [this generator](https://github.com/react-webpack-generators/generator-react-webpack#readme)). If you follow the steps listed in the Yeoman tutorial you'll get something like this:

![yeoman-finish](/content/img/old-posts/2017/11/yeoman-finish.png)

If you did, nice!Ô£ï This is just a boilerplate, you can **mess about with the code** by write your data structures, adingd npm modules for interesting features like async data requests to your services and more! **The only limitation is your imagination!!** _(and computing power, budget, client requests, etc.. but ignore them for now, this is for fun!)_. During your build there are some tools that come along with this generator that make your life super easy:

1. **`npm start`** | Run a dev server with live reload on changes
    2. **`npm run dist`** then **`npm run serve:dist`** | Build the dist version and copy static files then start the dev-server with the dist version
    3. **`npm test`** or **`npm run test:watch`** | Run all unit tests or Auto-run unit tests on file changes

This is kinda where I'm at overall, now I'm just playing around. React has a steep learning curve so putting together the basics is getting the best of me, but it will probably be worth it the end.. Check back in a few years and I might have a second page! ­ƒÜÆ­ƒÜÆ­ƒÜÆ
