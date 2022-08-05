const packageJson = require('./package.json');
/**
 * Configure your Gatsby site with this file.
 *
 * See: https://www.gatsbyjs.org/docs/gatsby-config/
 */

module.exports = {
    siteMetadata: {
        title: 'TobyDevlin.com',
        version: packageJson.version,
        siteUrl: 'https://tobydevlin.com',
        socialLinks: {
            gitlab: 'https://gitlab.com/MrAdjunctPanda',
            github: 'https://github.com/GitToby',
            linkedin: 'https://www.linkedin.com/in/toby-devlin-741b45106/'
        }
    },
    plugins: [
        // CODE PLUGINS
        'gatsby-plugin-typescript', // will use the tsconfig.json to compile
        {
            resolve: 'gatsby-plugin-graphql-codegen', // creates the graphql-types.ts file with our graphql types if the graphql query is named
            fileName: './graphql-types.ts',
            documentPaths: ['./src/**/*.{ts,tsx}'],
            codegenDelay: 100
        },
        {
            resolve: 'gatsby-plugin-sass', // allows writing sass in src to style components
            options: {
                sassOptions: {
                    includePaths: ['./src/']
                }
            }
        },

        // IMAGE PLUGINS
        'gatsby-plugin-image',
        'gatsby-transformer-sharp',
        'gatsby-plugin-sharp',

        // DATA SOURCING PLUGINS
        {
            resolve: 'gatsby-source-filesystem', // looks into the path below and provides the data in the graphQL server
            options: {
                name: 'images',
                path: `${__dirname}/content/img` // used for markdown pages, projects & blog posts
            }
        },
        {
            resolve: 'gatsby-source-filesystem', // looks into the path below and provides the data in the graphQL server
            options: {
                name: 'blog-content',
                path: `${__dirname}/content/blog` // used for markdown pages, projects & blog posts
            }
        },
        {
            resolve: 'gatsby-source-filesystem', // looks into the path below and provides the data in the graphQL server
            options: {
                name: 'static-content',
                path: `${__dirname}/static` // used for markdown pages, projects & blog posts
            }
        },

        // FORMATTING PLUGINS
        {
            resolve: 'gatsby-transformer-remark', // renders markdown files as html
            options: {
                plugins: [
                    {
                        resolve: `gatsby-remark-images`,
                        options: {
                            maxWidth: 800
                        }
                    },
                    {
                        resolve: `gatsby-remark-autolink-headers`,
                        options: {
                            offsetY: 90
                        }
                    },
                    'gatsby-remark-prismjs', // add code highlighting
                    {
                        resolve: 'gatsby-remark-katex', // maths render
                        options: {
                            // any KaTeX options from https://github.com/KaTeX/KaTeX/blob/master/docs/options.md here
                            strict: 'ignore'
                        }
                    }
                ]
            }
        },

        // EXTENSIONS
        'gatsby-plugin-netlify-cms', // adds the cms plugin to the /admin page
        'gatsby-plugin-no-sourcemaps', // removes sourcemaps in production builds
        'gatsby-plugin-sitemap', // add a sitemap to the site on /sitemap.xml
        'gatsby-plugin-react-helmet', // add SEO Headers ans such
        {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
                // You can add multiple tracking ids and a pageview event will be fired for all of them.
                trackingIds: [process.env.GA_TRACKING_ID],
                // This object gets passed directly to the gtag config command
                // This config will be shared across all trackingIds
                gtagConfig: {
                    optimize_id: 'OPT_CONTAINER_ID',
                    anonymize_ip: true,
                    cookie_expires: 0
                },
                // This object is used for configuration specific to this plugin
                pluginConfig: {
                    // Puts tracking script in the head instead of the body
                    head: false,
                    // Setting this parameter is also optional
                    respectDNT: true,
                    // Defaults to https://www.googletagmanager.com
                    origin: 'https://tobydevlin.com'
                }
            }
        }
    ]
};
