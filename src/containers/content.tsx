import React from 'react';
import Header from '../components/header';
import Footer from '../components/footer';
import { Container } from 'react-bootstrap';
// @ts-ignore
import * as styles from '../styles/content.module.scss';
import SEO from '../components/SEO';

interface ContentProps {
    children: React.ReactNode;
}

const Content = (props: ContentProps) => (
    <div className={styles.contentWrapper}>
        <Header />
        <SEO />
        <Container className={styles.contentBody}>{props.children}</Container>
        <Footer />
    </div>
);

export default Content;
