const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem'); // must use require

/* ALL THIS BIT IS TWEAKED FROM https://www.gatsbyjs.org/tutorial/part-seven/ */
/* I DONT KNOW IF OR HOW IT WORKS, DONT POKE AROUND TOO MUCH */
exports.onCreateNode = ({node, getNode, actions}) => {
    const {createNodeField} = actions;
    if (node.internal.type === 'MarkdownRemark') {
        let slug = createFilePath({node, getNode, basePath: 'pages'}); // create file on /pages
        slug = `/blog${slug.replace(/[0-9]{4}-[0-9]{2}-[0-9]{2}-/, '')}`; // remove date from file name and add blog to the path
        createNodeField({
            node,
            name: 'slug',
            value: slug
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
                slug: node.fields.slug
            }
        });
    });
};
