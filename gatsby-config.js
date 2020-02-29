const packageJson = require('./package.json');
/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
    siteMetadata: {
        title: 'TobyDevlin.com 2.0',
        version: packageJson.version,
        description: '',
        homepage: '',
    },
    plugins: [
        'gatsby-plugin-typescript', // will use the tsconfig.json to compile
        'gatsby-plugin-netlify-cms', // adds the cms plugin to the /admin page
        'gatsby-plugin-no-sourcemaps',
        {
            resolve: 'gatsby-plugin-graphql-codegen', // creates the graphql-types.ts file with our graphql types if the graphql query is named
            fileName: './graphql-types.ts',
            documentPaths: ['./src/**/*.{ts,tsx}'],
            codegenDelay: 100,
        },
        {
            resolve: 'gatsby-transformer-remark', // renders markdown files as html
            options: {
                plugins: [
                    'gatsby-remark-prismjs', // add code highlighting
                    {
                        resolve: `gatsby-remark-katex`, // maths render
                        options: {
                            // any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
                            strict: `ignore`
                        }
                    }
                ],
            },
        },
        {
            resolve: 'gatsby-source-filesystem', // looks into the path below and provides the data in the graphQL server
            options: {
                name: 'content',
                path: `${__dirname}/content/`, // used for markdown pages, projects & blog posts
            },
        },
        {
            resolve: 'gatsby-plugin-sass', // allows writing sass in src to style components
            options: {
                includePaths: ['./src/'],
            },
        },
    ],
};
