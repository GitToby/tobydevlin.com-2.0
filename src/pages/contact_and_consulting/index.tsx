import React, {useState} from 'react';
import Content from '../../containers/content';
// @ts-ignore
import * as styles from '../../styles/about.module.scss';
import {paraAnimation, paraAnimationDuration, titleAnimation, titleAnimationDuration} from '../../helper/settings';
import SEO from '../../components/SEO';
import {OutboundLink} from 'gatsby-plugin-google-gtag';
import {Link} from 'gatsby';
import {PopupButton, Widget} from "@typeform/embed-react";

const pageDescription = 'Get in contact with Toby';

const About = () => {
    const [validated, setValidated] = useState<boolean>(false);

    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

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
                <OutboundLink href="https://www.linkedin.com/in/toby-devlin/">Linkedin</OutboundLink>. Alongside my day
                job I am an experience Data Consultant with years of experience in full stack data applications,
                pipelines and ecosystems. Please reach out if you are interested in my services and do check out my{' '}
                <Link to="/portfolio">portfolio</Link>.
            </p>
            <Widget id="SFbuHjO9"  autoResize className={styles.contactForm} />
        </Content>
    );
};

export default About;
