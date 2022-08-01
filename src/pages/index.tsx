import React from 'react';
import SEO from '../components/SEO';
import Content from '../containers/content';
// @ts-ignore
import * as styles from '../styles/index.module.scss';

const Index = () => (
    <Content>
        <SEO pageTitle="Home" />
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="0">
            <h1 id={styles.title}>I'm Toby,</h1>
        </div>
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="300">
            <h2 id={styles.subtitle}>a London based full stack & data consultant</h2>
        </div>
        <div data-aos="fade-up" data-aos-duration="1500" data-aos-delay="600">
            <p>
                Hello world! This is my website, I work on lots of projects and sometimes like to write blog posts or highilight intresting opinions here. This is where I write the occasional post to to keep notes or share details on some of my projects and learnings. If you want to know more, please{' '}
                <a href="https://www.linkedin.com/in/toby-devlin/">contact me!</a>
            </p>
        </div>
    </Content>
);

export default Index;
