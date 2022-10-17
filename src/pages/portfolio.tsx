import React, {FunctionComponent} from 'react';
import Content from '../containers/content';
// @ts-ignore
import * as styles from '../styles/portfolio.module.scss';
import {Card, Row} from 'react-bootstrap';
import {titleAnimation, titleAnimationDuration} from '../helper/constants';
import SEO from '../components/SEO';
import {GatsbyImage, getImage, IGatsbyImageData} from 'gatsby-plugin-image';
import {graphql, Link} from 'gatsby';
import {PortfolioDataQuery} from '../../graphql-types';
import {OutboundLink} from "gatsby-plugin-google-gtag";

interface PortfolioCardProps {
    name: string;
    imgData: IGatsbyImageData;
    imgAlt: string;
    url: string;
    url_2?: string;
    description?: string;
}

const SiteCard: FunctionComponent<PortfolioCardProps> = (props) => {
    const imageData = getImage(props.imgData);
    return (
        <div className="col-lg-6 col-sm-12">
            <Card className={`px-0 m-4 ${styles.card}`}>
                <Card.Img variant="top" as={GatsbyImage} image={imageData} alt={props.imgAlt}/>
                <Card.Body>
                    <Card.Title>{props.name}</Card.Title>
                    <Card.Text>{props.description}</Card.Text>
                    <OutboundLink href={props.url}>
                        Go there
                    </OutboundLink>
                    {props.url_2 &&
                        <OutboundLink href={props.url_2}>
                            API Docs
                        </OutboundLink>
                    }
                </Card.Body>
            </Card>
        </div>
    );
};

interface PortfolioProps {
    data: PortfolioDataQuery;
}

const Portfolio = (props: PortfolioProps) => {
    let portfolioData: Array<PortfolioCardProps> = [
        {
            name: 'MeshD Cloud',
            imgData: props.data.meshd,
            imgAlt: 'MeshD homepage',
            url: 'https://meshd.cloud',
            url_2: 'https://api.meshd.cloud',
            description:
                'A new data service mesh for modern data development. Cloud native and distributed, Meshd is the next iteration of data warehousing for the modern data stack. https://api.meshd.com/redoc'
        },
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
            <Row className={`align-items-center ${styles.cardContainer}`}>
                {portfolioData.map((data, idx) => (
                    <SiteCard
                        key={idx}
                        name={data.name}
                        imgData={data.imgData}
                        imgAlt={data.imgAlt}
                        url={data.url}
                        description={data.description}
                    />
                ))}
            </Row>
        </Content>
    );
};

export const query = graphql`
    query PortfolioData {
        meshd: file(base: {eq: "meshd-api-docs.png"}) {
            childImageSharp {
                gatsbyImageData(placeholder: BLURRED, formats: [AUTO, WEBP])
            }
        }
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
