# The second iteration of Tobydevlin.com

[![Netlify Status](https://api.netlify.com/api/v1/badges/b9050913-2c0e-4c90-a802-50e1b2cd368c/deploy-status)](https://app.netlify.com/sites/tobydevlin/deploys)

### dev setup

1. Install everything

-   Node
-   node modules

2. Run dev server with `node run develop`
3. View site at http://localhost:8000
4. View graphql browser at http://localhost:8000/___graphql

You can set up remote debugging by setting the config to run in the "javascript debugging" intellij function: file://path/to/tobydevlin.com-2.0/src <-> top/localhost:8000/path/to/tobydevlin.com-2.0/src.
In VS Code you can set up debugging by running the `Launch localhost` debug and having remote devtools enabled in firefox

#### change image upload locations:

-   update the `media_folder` setting in _static/admin/config.yml_
-   update this in the `'gatsby-source-filesystem'` - `'images'` plugin so gatsby looks in the right place in _gatsby-config.js_
-   update the _gatsby-node.js_ replace path so its still relative
