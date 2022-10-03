import React from 'react';
import Content from '../../containers/content';
// @ts-ignore
import * as styles from '../../styles/about.module.scss';
import {
    customEventTypes,
    links,
    paraAnimation,
    paraAnimationDuration,
    titleAnimation,
    titleAnimationDuration
} from '../../helper/constants';
import SEO from '../../components/SEO';
import {OutboundLink} from 'gatsby-plugin-google-gtag';
import {Link} from 'gatsby';
import {Widget} from "@typeform/embed-react";
import {fireGtagEvent} from "../../helper/util";

const pageDescription = 'Get in contact with Toby';

const Index = () => {
    return (
        <Content>
            <SEO pageTitle="Contact" isBlogPost={false} pageDescription={pageDescription}/>
            <h1 data-aos={titleAnimation} data-aos-duration={titleAnimationDuration} data-aos-delay="0">
                Contact Form.
            </h1>
            <hr/>
            <p data-aos={paraAnimation} data-aos-duration={paraAnimationDuration}>
                If you'd like to get in contact with me the best way is via this form. Im usually available on various
                platforms too, if you'd like to reach out via{' '}
                <OutboundLink href={links.linkedin}>Linkedin</OutboundLink>. Alongside my day
                job I am an experience Data Consultant with years of experience in full stack data applications,
                pipelines and ecosystems. Please reach out if you are interested in my services and do check out my{' '}
                <Link to="/portfolio">portfolio</Link>.
            </p>
            <Widget
                onReady={() => fireGtagEvent(customEventTypes.blogSearch, {})}
                id="SFbuHjO9"
                autoResize
                className={styles.contactForm}
            />
        </Content>
    );
};

export default Index;
