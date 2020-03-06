import React from 'react';
import {Col, Row} from 'react-bootstrap';
import Img from 'gatsby-image';
import {Link} from 'gatsby';
import {GatsbyImageSharpFluidFragment, ImageSharpFluid} from '../../graphql-types';
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
}

const BlogPostCard = (props: BlogPostCardProps) => {
    return (
        <div className={style.blogPostCard}>
            <BackgroundImage
                fluid={[
                    `linear-gradient(to bottom left, rgba(245, 245, 245, 0.5), rgba(245, 245, 245, 1))`,
                    props.imgData
                ]}
            >
                <Link to={props.slug} className={style.blogHeader}>
                    {props.title}
                </Link>
                <br />
                <span className={style.blogDate}> {props.date}</span>
                <br />
                <p>{props.excerpt}</p>
            </BackgroundImage>

            <hr />
        </div>
    );
};

export default BlogPostCard;
