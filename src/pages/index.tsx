import React from 'react';
import Content from '../containers/content';
// @ts-ignore
import * as styles from '../styles/index.module.scss';
import {graphql} from 'gatsby';
import BackgroundImage from 'gatsby-background-image';
import {IndexDataQuery} from '../../graphql-types';

interface IndexProps {
    data: IndexDataQuery;
}

function Index(props: IndexProps) {
    return (
        <Content>
            <BackgroundImage className={styles.background} fluid={props.data.file.childImageSharp.fluid}></BackgroundImage>

            <h1 id={styles.title} className="animated fadeInLeft">
                Im Toby
            </h1>
            <h2 id={styles.subtitle} className="animated fadeInLeft">
                a London based full stack dev
            </h2>
        </Content>
    );
}

export const query = graphql`
    query indexData {
        file(base: {eq: "toby-devlin-blog-website-background.jpg"}) {
            childImageSharp {
                fluid {
                    ...GatsbyImageSharpFluid
                }
            }
        }
    }
`;

export default Index;
