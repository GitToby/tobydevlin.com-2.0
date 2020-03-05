import React from 'react';
import {graphql, Link} from 'gatsby';
import Content from '../containers/content';
import {BlogHomeQuery} from '../../graphql-types';
import Img from 'gatsby-image';
import {Col, Row} from 'react-bootstrap';
// @ts-ignore
import * as style from '../styles/blog.module.scss';

interface BlogProps {
    data: BlogHomeQuery;
}

const Blog = (props: BlogProps) => (
    <Content>
        <p className={style.blogIntro}>Welcome to the Blog! I write about things sometime, so far I have {props.data.allMarkdownRemark.totalCount} posts.</p>
        <hr />
        {props.data.allMarkdownRemark.edges
            .sort((e1: any, e2: any) => {
                return Date.parse(e2.node.frontmatter.isoDate) - Date.parse(e1.node.frontmatter.isoDate);
            })
            .map((edge: any, idx: number) => {
                const node = edge.node;
                const imgData = edge.node.frontmatter.image ? edge.node.frontmatter.image.childImageSharp.fluid : undefined;

                return (
                    <div key={idx} className={style.blogPostCard}>
                        <Row>
                            <Col sm={3}>{imgData && <Img fluid={imgData} durationFadeIn={500} />}</Col>
                            <Col sm={9}>
                                <Link to={node.fields.slug} className={style.blogHeader}>
                                    {node.frontmatter.title}
                                </Link>
                                <br />
                                <span className={style.blogDate}> {node.frontmatter.date}</span>
                                <br />
                                <p>{node.excerpt}</p>
                            </Col>
                        </Row>
                        <hr />
                    </div>
                );
            })}
    </Content>
);

export const query = graphql`
    query blogHome {
        allMarkdownRemark {
            totalCount
            edges {
                node {
                    id
                    frontmatter {
                        title
                        isoDate: date
                        date(formatString: "dddd, MMMM Do YYYY")
                        image {
                            childImageSharp {
                                fluid {
                                    ...GatsbyImageSharpFluid
                                }
                            }
                        }
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
