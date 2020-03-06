import React from 'react';
import {graphql} from 'gatsby';
import Content from '../containers/content';
import {BlogHomeQuery, GatsbyImageSharpFluidFragment, ImageSharpFluid} from '../../graphql-types';
// @ts-ignore
import * as style from '../styles/blog.module.scss';
import BlogPostCard from '../components/blogPostCard';

interface BlogProps {
    data: BlogHomeQuery;
}

const Blog = (props: BlogProps) => (
    <Content>
        <h2 data-aos="fade-right" data-aos-duration="800" data-aos-delay="0">
            Welcome to the Blog!
        </h2>
        <p className={style.blogIntro} data-aos="fade-right" data-aos-duration="600" data-aos-delay="300">
            I write about things sometime, so far I have {props.data.allMarkdownRemark.totalCount}
            posts. I update this every now and then when I come across something I want to write about. Most of these
            are just ramblings and notes from when I want to remember something.
        </p>
        <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="600">
            <hr />
            {props.data.allMarkdownRemark.edges
                .sort((e1: any, e2: any) => {
                    return Date.parse(e2.node.frontmatter.isoDate) - Date.parse(e1.node.frontmatter.isoDate);
                })
                .map((edge: any, idx: number) => {
                    const {excerpt, fields, frontmatter} = edge.node;
                    const imgData: ImageSharpFluid | null | GatsbyImageSharpFluidFragment = edge.node.frontmatter.image
                        ? edge.node.frontmatter.image.childImageSharp.fluid
                        : undefined;

                    return (
                        <BlogPostCard
                            idx={idx}
                            imgData={imgData}
                            slug={fields.slug}
                            title={frontmatter.title}
                            date={frontmatter.date}
                            excerpt={excerpt}
                        />
                    );
                })}
        </div>
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
