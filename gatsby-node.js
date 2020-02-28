const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem'); // must use require

/* ALL THIS BIT IS TWEAKED FROM https://www.gatsbyjs.org/tutorial/part-seven/ */
/* I DONT KNOW IF OR HOW IT WORKS, DONT POKE AROUND TOO MUCH */
exports.onCreateNode = ({node, getNode, actions}) => {
    const {createNodeField} = actions;
    if (node.internal.type === 'MarkdownRemark') {
        // only markdown files from ./content/blog
        let slug = createFilePath({node, getNode, basePath: 'pages'});
        slug = slug.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}-/, ''); // remove date from file name
        createNodeField({
            node,
            name: 'slug',
            value: slug,
        });
    }
};

exports.createPages = async ({graphql, actions}) => {
    const {createPage} = actions;
    const result = await graphql(`
        query {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
        }
    `);
    result.data.allMarkdownRemark.edges.forEach(({node}) => {
        createPage({
            path: node.fields.slug,
            component: path.resolve('./src/containers/blogPost.tsx'),
            context: {
                // Data passed to context is available
                // in page queries as GraphQL variables.
                slug: node.fields.slug,
            },
        });
    });
};
