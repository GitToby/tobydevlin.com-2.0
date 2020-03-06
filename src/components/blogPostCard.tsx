import React from 'react';
import {Col, Row} from 'react-bootstrap';
import Img from 'gatsby-image';
import {Link} from 'gatsby';
import {GatsbyImageSharpFluidFragment, ImageSharpFluid} from '../../graphql-types';
// @ts-ignore
import * as style from '../styles/blog.module.scss';

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
        <div key={props.idx} className={style.blogPostCard}>
            <Row>
                {props.idx % 2 === 0 && (
                    <Col md={3}>{props.imgData && <Img fluid={props.imgData} durationFadeIn={500} />}</Col>
                )}
                <Col md={9}>
                    <Link to={props.slug} className={style.blogHeader}>
                        {props.title}
                    </Link>
                    <br />
                    <span className={style.blogDate}> {props.date}</span>
                    <br />
                    <p>{props.excerpt}</p>
                </Col>
                {props.idx % 2 !== 0 && (
                    <Col md={3}>{props.imgData && <Img fluid={props.imgData} durationFadeIn={500} />}</Col>
                )}
            </Row>
            <hr />
        </div>
    );
};

export default BlogPostCard;
