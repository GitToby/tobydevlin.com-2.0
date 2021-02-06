import React from 'react';
import Content from './content';
import {graphql} from 'gatsby';
import {BlogDataQuery} from '../../graphql-types';
import BackgroundImage from 'gatsby-background-image';
// @ts-ignore
import * as styles from '../styles/blog.module.scss';

import {Helmet} from 'react-helmet';

import 'prismjs/themes/prism.css'; // remark code snipits
import 'katex/dist/katex.min.css';
import SEO from '../components/SEO';

interface BlogPostProps {
    data: BlogDataQuery;
}

const BlogPost = (props: BlogPostProps) => {
    const fluidImg = props.data.markdownRemark.frontmatter.image
        ? props.data.markdownRemark.frontmatter.image.childImageSharp.fluid
        : undefined;
    const title = props.data.markdownRemark.frontmatter.title;
    const postDate = props.data.markdownRemark.frontmatter.date;
    return (
        <Content>
            {/* Sets the header of the blog post */}
            <SEO pageTitle={title} pageDescription={props.data.markdownRemark.excerpt} />
            <hr />
            <div className={styles.blogPost}>
                {fluidImg ? (
                    <BackgroundImage
                        className={styles.backgroundImg}
                        fluid={[
                            `linear-gradient(rgba(245, 245, 245, 0.5), rgba(245, 245, 245, 0.70), rgba(245, 245, 245, 1))`,
                            fluidImg
                        ]}
                    >
                        <h1>{title}</h1>
                        <h3>{postDate}</h3>
                    </BackgroundImage>
                ) : (
                    <div className={styles.backgroundImg}>
                        <h1>{title}</h1>
                        <h3>{postDate}</h3>
                    </div>
                )}
                <hr />
                <div
                    dangerouslySetInnerHTML={{
                        __html: props.data.markdownRemark.html
                    }}
                />
            </div>
        </Content>
    );
};

export const query = graphql`
    query blogData($slug: String!) {
        markdownRemark(fields: {slug: {eq: $slug}}) {
            html
            excerpt(pruneLength: 100)
            frontmatter {
                title
                date(formatString: "dddd, MMMM Do YYYY")
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
