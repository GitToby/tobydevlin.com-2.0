const path = require('path');
const {createFilePath} = require('gatsby-source-filesystem'); // must use require

/* ALL THIS BIT IS TWEAKED FROM https://www.gatsbyjs.org/tutorial/part-seven/ */
/* I DONT KNOW IF OR HOW IT WORKS, DONT POKE AROUND TOO MUCH */

const CMSMediaPath = /\/content\/img/g; // Netlify cms positioning of images from static/admin/config.yml

exports.onCreateNode = ({node, getNode, actions}) => {
    const {createNodeField} = actions;
    if (node.internal.type === 'MarkdownRemark') {
        // replace image paths in md body so theyre relative when processing
        // this calculates how deep each file is and forms a ../img string to match.
        const strings = node.fileAbsolutePath.split('content/blog'); // split on the known root folder
        const levelsDeep = strings[strings.length - 1].match(/\//g).length; // get # of / chars
        const upwardPath = '../'.repeat(levelsDeep); // form string

        // replace in relevant sections
        node.internal.content = node.internal.content.replace(CMSMediaPath, `${upwardPath}img`);
        node.rawMarkdownBody = node.rawMarkdownBody.replace(CMSMediaPath, `${upwardPath}img`);
        node.frontmatter.image = node.frontmatter.image.replace(CMSMediaPath, `${upwardPath}img`);

        // create new field, "base" with the image base
        const onSlash = node.frontmatter.image.split('/');
        const imgBase = onSlash[onSlash.length - 1];
        createNodeField({
            node,
            name: 'imgBase',
            value: imgBase
        });

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
                            imgBase
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
                imgBase: node.fields.imgBase
            }
        });
    });
};
