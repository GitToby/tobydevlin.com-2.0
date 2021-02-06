import React from 'react';
import { Badge, Col, Row } from 'react-bootstrap';
import Img from 'gatsby-image';
import { Link } from 'gatsby';
import { GatsbyImageSharpFluidFragment, ImageSharpFluid } from '../../graphql-types';
// @ts-ignore
import * as style from '../styles/blog.module.scss';
import BackgroundImage from 'gatsby-background-image';

class BlogPostCardProps {
    idx: number;
    imgData: ImageSharpFluid | null | GatsbyImageSharpFluidFragment;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: Array<string>;
}

const BlogPostCard = (props: BlogPostCardProps) => {
    return (
        <div className={style.blogPostCard}>
            <BackgroundImage
                fluid={[
                    `linear-gradient(to right, rgba(245, 245, 245, 0.99), rgba(245, 245, 245, 0.90), rgba(245, 245, 245, 0.6))`,
                    props.imgData
                ]}
            >
                <div className={style.blogCardContent}>
                    <Link to={props.slug} className={style.blogHeader}>
                        {props.title}
                    </Link>
                    <br />
                    <span className={style.blogDate}>
                        {props.date} | tags: <i>{props.tags.join(', ')}</i>
                    </span>
                    <br />
                    {props.excerpt}
                </div>
            </BackgroundImage>
            <hr />
        </div>
    );
};

export default BlogPostCard;
