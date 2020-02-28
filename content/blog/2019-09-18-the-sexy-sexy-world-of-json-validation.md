---
layout: post
title: The Sexy Sexy World Of JSON Validation
date: 2019-09-18T15:46:43.349Z
image: /assets/images/cms/jon-moore-399469-unsplash.jpg
tags:
  - ''
---
JSON is everywhere, sometimes it's hidden from you or your user but its always there. Thousands of applications rely on correctly formatted data to work correctly with little format checking. Most of the time the data generators should have been correctly tested with a couple of unit tests, maybe an integration test here and there, and then you can assume that consumers of said data will work correctly. Plop a few tests on there to make sure data in the format you assume is correct works, and you're done, right? no.
 
What if there's a strange form creating data bypassing your validation somehow, or a REST service goes wild posts data to your service completely wrong, or maybe you got your stringification just a little off? here steps in the subtle art of [JSON validation through JSON Schema](https://json-schema.org/)! 
 
Using the [JSON Schema specification](https://json-schema.org/specification.html) one can define a data model, using JSON itself, and then use one of the [many libraries](https://json-schema.org/implementations.html) to validate a document against the said schema. 
 
This is great in a few ways:
1. You can make sure your producers are always producing correctly & your consumers always consuming what they like.
2. Leveraging the absolute nature of the JSON Schema spec means, with some work, one can produce automated solutions to create producing and consuming code.
 
 
\# 2, in my opinion, is a brilliant win for the specification. For example, if you're writing a UI it means that you no longer have to struggle with building a form that's _just right_. Tools like [react-jsonschema-form](https://github.com/rjsf-team/react-jsonschema-form) or [uniform](https://uniforms.tools/) do this for you, you bring your spec and it will give you a UI, validation and hooks all for free! 
 
\# 1 also means that there are packages you can run your data through when expecting certain schemas to ensure the richness of your data. There are implementations of validation code written in [almost every language](https://json-schema.org/implementations.html#validators) too, just for your convenience!
 
