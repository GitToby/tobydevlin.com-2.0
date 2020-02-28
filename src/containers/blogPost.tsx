import React from 'react';
import Content from './content';
import {graphql, Link} from 'gatsby';
import {BlogDataQuery} from '../../graphql-types';

interface BlogPostProps {
    data: BlogDataQuery;
}

function BlogPost(props: BlogPostProps) {
    return (
        <Content>
            <Link to={'/blog/'}>blog home</Link>
            <h1>{props.data.markdownRemark.frontmatter.title}</h1>
            <hr />
            this is my string
            <div
                dangerouslySetInnerHTML={{
                    __html: props.data.markdownRemark.html,
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
                image
            }
        }
    }
`;
export default BlogPost;
