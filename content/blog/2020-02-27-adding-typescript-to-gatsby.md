---
layout: post
title: Adding Typescript to Gatsby
date: 2020-02-27T13:00:56.862Z
image: /content/img/netlifyCMS/shapegame.jpg
tags:
  - gatsby
  - typescript
  - webdev
---
Adding TypeScript to gatsby shouldn't be too hard, that's why I created this post, detailing how to make everything using typescript in gatsby. This should be super simple, code changes should be minimal and can be run alongside the tutorial too.

This assumes you have a graphQL query somewhere in your code, as an example I will be using a basic index.js page to migrate to TypeScript:

```javascript
import React from "react"
import {Link} from "gatsby";
import {graphql} from "gatsby"
import Layout from "../containers/layout";

function Index(props) {
    return (
        <Layout>
            <h3>{props.data.site.siteMetadata.title}</h3>
            <h2>Hello world! itsa me, toby!</h2>
        </Layout>
    );
}

export const query = graphql`
  query IndexPageData {
    site {
      siteMetadata {
        title
      }
    }
  }
`;

export default Index;
```

This also assumes you have the `siteMetadata` section in your `gatsby-config.js`, such as the below:

```javascript
module.exports = {
    siteMetadata: {
        title: `Try turning it off and on again`
    },
    plugins: []
};
```

Now we can get started on our Typescript integration; step 1, add typescript! This is via the [gatsby-plugin-typescript](https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/), which is incredibly simple to add:

1. Install the plugin with `npm install gatsby-plugin-typescript --save`.
2. Add the plugin to the *plugins* list of your `gatsby-config.js`, as detailed in the plugin docs.
3. Rename your `index.jsx` to `index.tsx`.

and you're done! Gatsby will now transpile your Typescript for you and bundle the app as before, yet now you have type safety. That was the easy bit, now we have to add types to our GraphQL query. Thankfully there's a plugin for that too! The [gatsby-plugin-graphql-codegen](https://www.gatsbyjs.org/packages/gatsby-plugin-graphql-codegen/) will save the day. Using this is just as easy as using the [gatsby-plugin-typescript](https://www.gatsbyjs.org/packages/gatsby-plugin-typescript/), with 1 less step!

1. Install the plugin with `npm install gatsby-plugin-graphql-codegen --save`.
2. Add the plugin to the *plugins* list of your `gatsby-config.js`.

From here gatsby will generate a `graphql-types.ts` file on every change of your GraphQL named queries. Remember back to the beginning of this post, we can see the query is called `IndexPageData`; the resulting type generated for us will be called `IndexPageDataQuery`. Now we can extend our `Index` component with propTypes:

```typescript
import React from "react"
import {Link} from "gatsby";
import {graphql} from "gatsby"
import Layout from "../containers/layout";
import {IndexPageDataQuery} from "../../graphql-types";

interface IndexProps {
    data: IndexPageDataQuery
}

function Index(props: IndexProps) {
    return (
        <Layout>
            <h3>{props.data.site.siteMetadata.title}</h3>
            <h2 style={{color: "red"}}>Hello world! itsa me, toby!</h2>
            <Link to={"/about"}>home</Link>
            <img src="https://source.unsplash.com/random/100x100" alt=""/>
        </Layout>
    );
}

export const query = graphql`
  query IndexPageData {
    site {
      siteMetadata {
        title
      }
    }
  }
`;


export default Index;
```

And that's all there is. Every time you write a query, name it, and the type shall appear! Things to note though:

* types will be refreshed if you change the query name.
* this works with `useStaticQuery()` functions too.

```typescript
const siteData: AnotherQueryQuery = useStaticQuery(graphql`
        query AnotherQuery {
            site {
                siteMetadata {
                    title
                }
            }
        }`);
```

* You will need to pass the type under the `data` prop for the mapping to work.

  hello world
