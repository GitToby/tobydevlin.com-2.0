import React, {FunctionComponent} from 'react';
import Content from '../containers/content';
// @ts-ignore
import * as styles from '../styles/portfolio.module.scss';
import {Card, Row} from 'react-bootstrap';
import {titleAnimation, titleAnimationDuration} from '../helper/constants';
import SEO from '../components/SEO';
import {GatsbyImage, getImage, IGatsbyImageData} from 'gatsby-plugin-image';
import {graphql} from 'gatsby';
import {PortfolioDataQuery} from '../../graphql-types';
import {OutboundLink} from "gatsby-plugin-google-gtag";

interface PortfolioCardProps {
    name: string;
    imgData: IGatsbyImageData;
    imgAlt: string;
    url: string;
    description?: string;
}

const SiteCard: FunctionComponent<PortfolioCardProps> = (props) => {
    const imageData = getImage(props.imgData);
    return (
        <Card className={styles.card}>
            <Card.Img variant="top" as={GatsbyImage} image={imageData} alt={props.imgAlt}/>
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>{props.description}</Card.Text>
                <OutboundLink href={props.url}>
                    Go there
                </OutboundLink>
            </Card.Body>
        </Card>
    );
};

interface PortfolioProps {
    data: PortfolioDataQuery;
}

const Portfolio = (props: PortfolioProps) => {
    let portfolioData: Array<PortfolioCardProps> = [
        {
            name: 'Chiddingfold Bonfire',
            imgData: props.data.bonfire,
            imgAlt: 'Chiddingfold bonfire homepage',
            url: 'https://chiddingfoldbonfire.org.uk',
            description:
                'The local village event of the year is that English tradition of burning a terrorist at the stake. And in the 21st century that requires a website so people know where and when.'
        },
        {
            name: 'Zoom A Chicken Live',
            imgData: props.data.zoomChicken,
            imgAlt: 'Zoom A Chicken Homepage',
            url: 'https://chicken.tobydevlin.com',
            description:
                'Ever sat in a really dull meeting and thought, boy this could really do with some poultry? Liven up a zoom call with a bookable chicken from zoom-a-chicken.live! '
        },
        {
            name: 'Simple Note Taker CLI',
            imgData: props.data.snt,
            imgAlt: 'Simple Note Taker CLI homepage',
            url: 'https://github.com/GitToby/simple_note_taker',
            description:
                'A CLI note taking tool written in python featuring auto complete, sharing, tagging and magic commands. Installable via pip using pip install simple_note_taker.'
        }
    ];
    return (
        <Content>
            <SEO pageTitle="Portfolio" isBlogPost={false}/>
            <h1 data-aos={titleAnimation} data-aos-duration={titleAnimationDuration} data-aos-delay="0">
                Other Projects I've Created.
            </h1>
            <hr/>
            {portfolioData.map((data, idx) => (
                <Row className={styles.cardContainer}>
                    <SiteCard
                        name={data.name}
                        imgData={data.imgData}
                        imgAlt={data.imgAlt}
                        url={data.url}
                        description={data.description}
                    />
                    <br/>
                </Row>
            ))}
        </Content>
    );
};

export const query = graphql`
    query PortfolioData {
        bonfire: file(base: {eq: "bonfire-homepage.png"}) {
            childImageSharp {
                gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP])
            }
        }
        zoomChicken: file(base: {eq: "zoom-a-chicken-homepage.png"}) {
            childImageSharp {
                gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP])
            }
        }
        snt: file(base: {eq: "snt.png"}) {
            childImageSharp {
                gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP])
            }
        }
    }
`;

export default Portfolio;
