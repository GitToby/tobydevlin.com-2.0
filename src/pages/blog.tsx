import React, {SyntheticEvent, useState} from 'react';
import {graphql} from 'gatsby';
import Content from '../containers/content';
import {BlogHomeQuery, GatsbyImageSharpFluidFragment, ImageSharpFluid} from '../../graphql-types';
// @ts-ignore
import * as style from '../styles/blog.module.scss';
import BlogPostCard from '../components/blogPostCard';
import {InputGroup, FormControl, Spinner} from 'react-bootstrap';
import SEO from '../components/SEO';

interface BlogProps {
    data: BlogHomeQuery;
}

const Blog = (props: BlogProps) => {
    let [posts, setPosts] = useState(props.data.allMarkdownRemark.edges);
    let [isLoading, setIsLoading] = useState<boolean>(false);

    function filterPosts(e: SyntheticEvent) {
        setIsLoading(true);
        let target = e.target as HTMLInputElement;
        let res = props.data.allMarkdownRemark.edges.filter((post) => {
            let searchResContent = post.node.internal.content.toLowerCase().indexOf(target.value.toLowerCase());
            let searchResTitle = post.node.frontmatter.title.toLowerCase().indexOf(target.value.toLowerCase());
            let searchResTags = post.node.frontmatter.tags
                .join(' ')
                .toLowerCase()
                .indexOf(target.value.toLowerCase());
            return searchResContent >= 0 || searchResTitle >= 0 || searchResTags >= 0;
        });
        setPosts(res);
        setIsLoading(false);
    }

    return (
        <Content>
            <SEO pageTitle="Blog" />
            <h1 data-aos="fade-right" data-aos-duration="800" data-aos-delay="0">
                Welcome to the Blog!
            </h1>
            <hr />
            <p className={style.blogIntro} data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
                I write about things sometime. I update this every now and then when I come across something I want to
                write about. Most of these are just ramblings and notes from when I want to remember something. Its
                mostly about tech and code and notes I find interesting.
            </p>
            <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="400">
                <InputGroup size="sm">
                    <FormControl
                        placeholder="Search posts..."
                        defaultValue=""
                        aria-label="Small"
                        onChange={filterPosts}
                    />
                </InputGroup>
                <hr />
            </div>
            {isLoading && <Spinner animation={'border'} />}
            {posts.length > 0 &&
                posts
                    .filter((post) => {
                        // filter out those not specifically published yet
                        return post.node.frontmatter.publish;
                    })
                    .map((edge: any, idx: number) => {
                        const {excerpt, fields, frontmatter} = edge.node;
                        const imgData: ImageSharpFluid | null | GatsbyImageSharpFluidFragment = edge.node.frontmatter
                            .image
                            ? edge.node.frontmatter.image.childImageSharp.fluid
                            : undefined;
                        return (
                            <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay={500 - idx * 50} key={idx}>
                                <BlogPostCard
                                    idx={idx}
                                    imgData={imgData}
                                    slug={fields.slug}
                                    title={frontmatter.title}
                                    date={frontmatter.date}
                                    tags={frontmatter.tags}
                                    excerpt={excerpt}
                                />
                            </div>
                        );
                    })}
            {posts.length === 0 && <p>No results...</p>}
        </Content>
    );
};

export const query = graphql`
    query blogHome {
        allMarkdownRemark(sort: {fields: frontmatter___date, order: DESC}) {
            totalCount
            edges {
                node {
                    id
                    frontmatter {
                        title
                        isoDate: date
                        date(formatString: "dddd, MMMM Do YYYY")
                        publish
                        tags
                        image {
                            childImageSharp {
                                fluid {
                                    ...GatsbyImageSharpFluid
                                }
                            }
                        }
                    }
                    excerpt(pruneLength: 200)
                    fields {
                        slug
                    }
                    internal {
                        content
                    }
                }
            }
        }
    }
`;

export default Blog;
