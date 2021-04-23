import React, {FunctionComponent} from 'react';
import Content from '../containers/content';
import {graphql} from 'gatsby';
import {PortfolioDataQuery} from '../../graphql-types';
import Img, {FluidObject} from 'gatsby-image';
// @ts-ignore
import * as styles from '../styles/portfolio.module.scss';
import {Button, Col, Container, Row, Card, CardDeck} from 'react-bootstrap';
import {titleAnimation, titleAnimationDuration, paraAnimation, paraAnimationDuration} from '../helper/settings';
import SEO from '../components/SEO';

interface PortfolioCardProps {
    name: string;
    imgData: FluidObject | FluidObject[];
    url: string;
    description?: string;
}

const SiteCard: FunctionComponent<PortfolioCardProps> = (props) => {
    return (
        <Card>
            <Card.Img variant="top" as={Img} fluid={props.imgData} />
            <Card.Body>
                <Card.Title>{props.name}</Card.Title>
                <Card.Text>{props.description}</Card.Text>
                <Button variant="primary" onClick={() => window.open(props.url, '_blank')}>
                    Go there
                </Button>
            </Card.Body>
        </Card>
    );
};

interface PortfolioProps {
    data: PortfolioDataQuery;
}

const Portfolio: FunctionComponent<PortfolioProps> = (props) => {
    return (
        <Content>
            <SEO pageTitle="Portfolio" />
            <h2 data-aos={titleAnimation} data-aos-duration={titleAnimationDuration} data-aos-delay="0">
                Check out some of my other work
            </h2>
            <Container fluid>
                <CardDeck>
                    <Col
                        sm={12}
                        md={12}
                        lg={6}
                        data-aos={paraAnimation}
                        data-aos-duration={paraAnimationDuration}
                        data-aos-delay={300}
                    >
                        <SiteCard
                            name="Chiddingfold Bonfire"
                            imgData={props.data.bonfire.childImageSharp.fluid}
                            url={'https://chiddingfoldbonfire.org.uk'}
                            description="The local village event of the year is that English tradition of burning a terrorist at the stake. And in the 21st century that requires a website so people know where and when."
                        />
                    </Col>
                    <Col
                        sm={12}
                        md={12}
                        lg={6}
                        data-aos={paraAnimation}
                        data-aos-duration={paraAnimationDuration}
                        data-aos-delay={600}
                    >
                        <SiteCard
                            name="Zoom A Chicken Live"
                            imgData={props.data.zoomChicken.childImageSharp.fluid}
                            url={'http://chicken.tobydevlin.com'}
                            description="Ever sat in a really dull meeting and thought, boy this could really do with some poultry? Liven up a zoom call with a bookable chicken from zoom-a-chicken.live! "
                        />
                    </Col>
                    <Col
                        sm={12}
                        md={12}
                        lg={6}
                        data-aos={paraAnimation}
                        data-aos-duration={paraAnimationDuration}
                        data-aos-delay={600}
                    >
                        <SiteCard
                            name="Simple Note Taker CLI"
                            imgData={props.data.snt.childImageSharp.fluid}
                            url={'https://github.com/GitToby/simple_note_taker'}
                            description="A CLI note taking tool written in python featuring auto complete, sharing, tagging and magic commands. Installable via pip using pip install simple_note_taker."
                        />
                    </Col>
                </CardDeck>
            </Container>
        </Content>
    );
};

export const query = graphql`
    query PortfolioData {
        bonfire: file(base: {eq: "bonfire-homepage.png"}) {
            childImageSharp {
                fluid {
                    ...GatsbyImageSharpFluid
                }
            }
        }
        zoomChicken: file(base: {eq: "zoom-a-chicken-homepage.png"}) {
            childImageSharp {
                fluid {
                    ...GatsbyImageSharpFluid
                }
            }
        }
        snt: file(base: {eq: "snt.png"}) {
            childImageSharp {
                fluid {
                    ...GatsbyImageSharpFluid
                }
            }
        }
    }
`;

export default Portfolio;
