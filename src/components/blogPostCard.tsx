import React from 'react';
import {Card} from 'react-bootstrap';
// @ts-ignore
import * as style from '../styles/blog.module.scss';
import {GatsbyImage, getImage, ImageDataLike} from 'gatsby-plugin-image';
import {Link} from 'gatsby';

class BlogPostCardProps {
    post_no: number;
    imgData: ImageDataLike;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: Array<string>;
}

const BlogPostCard = (props: BlogPostCardProps) => {
    const imageData = getImage(props.imgData);
    return (
        <Card className={style.blogPostCard}>
            <Card.Img className={style.blogPostCardImg} as={GatsbyImage} image={imageData} alt={props.title} />
            <Card.ImgOverlay className={style.blogPostCardContent}>
                <Card.Body>
                    <Card.Title as="h1">
                        #{props.post_no}: <Link to={props.slug}>{props.title}</Link>
                    </Card.Title>
                    <Card.Subtitle className={style.blogDate}>
                        {props.date} | tags: <i>{props.tags.join(', ')}</i>
                    </Card.Subtitle>
                    <Card.Text>{props.excerpt}</Card.Text>
                </Card.Body>
            </Card.ImgOverlay>
        </Card>
    );
};

export default BlogPostCard;
