import React from 'react';
import {Card} from 'react-bootstrap';
// @ts-ignore
import * as style from '../styles/blog.module.scss';
import {getImage, ImageDataLike} from "gatsby-plugin-image";
import {Link} from "gatsby";
import {convertToBgImage} from "gbimage-bridge";

class BlogPostCardProps {
    idx: number;
    imgData: ImageDataLike;
    slug: string;
    title: string;
    date: string;
    excerpt: string;
    tags: Array<string>;
}

const BlogPostCard = (props: BlogPostCardProps) => {
    const imageData = getImage(props.imgData)
    const bgImage = convertToBgImage(imageData)
    return (
        <Card className={style.blogPostCard}>
            {/*<Card.Img as={GatsbyImage} image={imageData} alt="asdf"/>*/}
            {/*<Card.ImgOverlay ref={elementRef}>*/}
            <Card.Body>
                <Card.Title as="h1">
                    <Link to={props.slug}>
                        {props.title}
                    </Link>
                </Card.Title>
                <Card.Subtitle className={style.blogDate}>
                    {props.date} | tags: <i>{props.tags.join(', ')}</i>
                </Card.Subtitle>
                <Card.Text>{props.excerpt}</Card.Text>
            </Card.Body>
            {/*</Card.ImgOverlay>*/}
        </Card>

    );
};

export default BlogPostCard;
