import React from 'react';
import Content from '../containers/content';
// @ts-ignore
import * as styles from '../styles/index.module.scss';
import {graphql, Link} from 'gatsby';

const Index = () => (
    <Content>
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="0">
            <h1 id={styles.title}>Im Toby</h1>
        </div>
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="300">
            <h2 id={styles.subtitle}>a London based full stack dev</h2>
        </div>
        <div data-aos="fade-up" data-aos-duration="1500" data-aos-delay="600">
            <p>
                Hello world, this is my website, I work on lots of projects from time to time and I like to get half way
                in before breaking things and quitting. This is where I will write the occasional post to to keep notes
                or share details on some of my projects and learnings. If you want to know more, please{' '}
                <Link to="/about#get-in-touch">contact me!</Link>
            </p>
        </div>
    </Content>
);

export default Index;
