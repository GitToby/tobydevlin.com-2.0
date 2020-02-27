/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
    siteMetadata: {
        title: `TobyDevlin.com 2.0`
    },
    plugins: [
        `gatsby-plugin-typescript`, // will use the tsconfig.json to compile
        `gatsby-plugin-graphql-codegen` // creates the graphql-types.ts file with our graphql types if the graphql query is named
    ]
};
