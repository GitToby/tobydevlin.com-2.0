import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import {Container} from 'react-bootstrap';
// @ts-ignore
import * as styles from '../styles/content.module.scss';
import SEO from '../components/SEO';
import Particles from 'react-tsparticles';
import {particlesOptions} from '../helper/settings';

interface ContentProps {
    children: React.ReactNode;
}

const Content = (props: ContentProps) => {
    return (
        <div className={styles.contentWrapper}>
            <Header />
            <SEO isBlogPost />
            <Container className={styles.contentBody}>
                <Particles className={styles.particles} options={particlesOptions} />
                {props.children}
            </Container>
            <Footer />
        </div>
    );
};

export default Content;
