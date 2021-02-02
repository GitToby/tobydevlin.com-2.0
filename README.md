# The second iteration of Tobydevlin.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/b9050913-2c0e-4c90-a802-50e1b2cd368c/deploy-status)](https://app.netlify.com/sites/tobydevlin/deploys)

### dev setup

1. install everything
2. run dev server with `node run develop`
3. set up remote debugging by setting the config to run in the "javascript debugging" intellij function:
    - file://path/to/tobydevlin.com-2.0/src <-> top/localhost:8000/path/to/tobydevlin.com-2.0/src
4. view site at http://localhost:8000
5. view graphql browser at http://localhost:8000/___graphql

#### change image upload locaitons:

-   update the `media_folder` setting in _static/admin/config.yml_
-   update this in the `'gatsby-source-filesystem'` - `'images'` plugin so gatsby looks in the right place in _gatsby-config.js_
-   update the _gatsby-node.js_ replace path so its still relative
