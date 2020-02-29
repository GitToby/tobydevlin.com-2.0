# The second iteration of Tobydevlin.com

### dev setup

1. install everything
2. run dev server with `node run develop`
3. set up remote debugging by setting the config to run in the "javascript debugging" intellij function:
    - file://C:/dev/projects/tobydevlin.com-2.0/src <-> top/localhost:8000/C:/dev/projects/tobydevlin.com-2.0/src

#### change image upload locaitons:

-   update the `media_folder` setting in _static/admin/config.yml_
-   update this in the `'gatsby-source-filesystem'` - `'images'` plugin so gatsby looks in the right place in _gatsby-config.js_
-   update the _gatsby-node.js_ replace path so its still relative
