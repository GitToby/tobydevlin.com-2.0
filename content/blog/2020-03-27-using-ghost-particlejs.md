---
layout: post
title: Using Ghost & ParticleJS
date: 2020-03-27T19:34:18.696Z
image: /content/img/netlifyCMS/annotation-2020-03-27-194111.png
tags:
  - Ghost
  - Node
  - ParticleJS
  - css
  - js dom manipulation
---
Recently I had my friend @ [veres.tech](https://veres.tech/) ask for some tips with a problem involving [ParticleJS](https://vincentgarreau.com/particles.js/) and [Ghost](https://ghost.org/). He wanted to apply this to his background, but because Ghost doesn't automatically use the required format of the API ParticleJS provides we had to add some tweaks.

![](/content/img/netlifyCMS/annotation-2020-03-27-193845.png)

ParticleJS needs an ID, so we will have to make one from a node in the document. This node has to be uniquely identifiable. The above image had the element we were interested in with a **unique** class, `m-hero__picture`. Ghost uses this unique class to style the main image over every post. Below is a snippet from the homepage of the site.

```html
<section class="m-hero with-picture aos-init aos-animate" data-aos="fade">
  <div class="m-hero__picture">
    <canvas class="particles-js-canvas-el" style="width: 100%; height: 100%;" width="1903" height="565"></canvas>
  </div>
  <div class="m-hero__content aos-init aos-animate" data-aos="fade-down">
    <h1 class="m-hero-title bigger">veres.tech</h1>
      <p class="m-hero-description bigger">A technical blog for sysadmins and aspiring pentesters</p>
  </div>
  </section>
```
Using the js injection tool Ghost provides we can assign this **unique** class an id, and fulfil the ParticlJS API of requiring an id. We can do this by passing the below as a script tag:

```javascript
const imageEl = document.getElementsByClassName("m-hero__picture")[0];
imageEl.id = "useThisID";
const mySettings = {/*my settings here*/};
particlesJS("useThisID", mySettings);
```

This will allow us to point ParticleJS at the right document node:

![](/content/img/netlifyCMS/annotation-2020-03-27-194111.png)

And there you have it! We can redefine the ID for any **uniquely identifiable** class on the page and it will just work. Remember to make this unique, else you'll either get the wrong element when indexing the `[0]` element or end up with non-unique IDs in the document causing warnings and errors.
