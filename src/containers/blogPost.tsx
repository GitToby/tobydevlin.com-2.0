import React from 'react';
import Content from './content';
import {graphql, Link} from 'gatsby';
import {BlogDataQuery} from '../../graphql-types';
import Img from 'gatsby-image';

import 'prismjs/themes/prism.css'; // remark code snipits
import 'katex/dist/katex.min.css'; // maths

interface BlogPostProps {
    data: BlogDataQuery;
}

function BlogPost(props: BlogPostProps) {
    const fluidImg = props.data.markdownRemark.frontmatter.image ? props.data.markdownRemark.frontmatter.image.childImageSharp.fluid : undefined;
    const title = props.data.markdownRemark.frontmatter.title;

    return (
        <Content>
            {fluidImg && (
                <Img fluid={fluidImg}>
                    <Link to={'/blog/'}>blog home</Link>
                    <h1>{title}</h1>
                </Img>
            )}
            <hr />
            <hr />
            <div
                dangerouslySetInnerHTML={{
                    __html: props.data.markdownRemark.html
                }}
            />
        </Content>
    );
}

export const query = graphql`
    query blogData($slug: String!) {
        markdownRemark(fields: {slug: {eq: $slug}}) {
            html
            frontmatter {
                title
                date
                tags
                image {
                    childImageSharp {
                        # Specify the image processing specifications right in the query.
                        # Makes it trivial to update as your page's design changes.
                        fluid {
                            ...GatsbyImageSharpFluid
                        }
                    }
                }
            }
        }
    }
`;
export default BlogPost;
