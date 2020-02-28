import React from 'react';
import {graphql, Link} from "gatsby";
import Content from "../containers/content";
import {BlogHomeQuery} from "../../graphql-types";

interface BlogProps {
    data: BlogHomeQuery
}

function Blog(props: BlogProps) {
    return (
        <Content>
            {props.data.allMarkdownRemark.totalCount} posts, Blog me!
            <br/>
            <br/>
            {props.data.allMarkdownRemark.edges.map((edge, idx: number) => {
                const node = edge.node;
                return < div>
                    <Link to={node.fields.slug}> {node.frontmatter.title}
                    </Link> - {node.frontmatter.date}<br/>
                    {node.excerpt}
                    <hr/>
                </div>
            } )}
        </Content>
    );
}

export const query = graphql`
    query blogHome {
        allMarkdownRemark {
            totalCount
            edges {
                node {
                    id
                    frontmatter {
                        title
                        date(formatString: "dddd, MMMM Do YYYY")
                    }
                    excerpt
                    fields {
                        slug
                    }
                }
            }
        }
    }
`;

export default Blog;