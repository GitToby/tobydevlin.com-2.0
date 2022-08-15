import React from 'react';
import Content from '../../containers/content';
// @ts-ignore
import * as styles from '../../styles/blog.module.scss';
import {paraAnimation, paraAnimationDuration, titleAnimation, titleAnimationDuration} from '../../helper/settings';
import SEO from '../../components/SEO';
import * as queryString from "querystring";
import {Link} from "gatsby";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowLeft, faArrowRight} from "@fortawesome/free-solid-svg-icons";

const About = (props: any) => {
    const parsed = queryString.parse(props.location.search.replace(/^\?/, ""));
    const firstName: string = parsed.firstName as string;

    let thanksString: string;
    if (firstName) {
        thanksString = `Thanks ${firstName.charAt(0).toUpperCase() + firstName.substr(1).toLowerCase()}`;
    } else {
        thanksString = "Thanks"
    }

    return (
        <Content>
            <SEO pageTitle="Contact" isBlogPost={false}/>
            <h1 data-aos={titleAnimation} data-aos-duration={titleAnimationDuration} data-aos-delay="0">
                Success!
            </h1>
            <hr/>
            <p data-aos={paraAnimation} data-aos-duration={paraAnimationDuration}>
                {thanksString}, your form was submitted successfully and we will get back to you soon!
            </p>
            <span className={styles.backButton} data-aos="fade-up" data-aos-duration="600">
                <Link to='/'><FontAwesomeIcon icon={faArrowLeft}/> Back Home</Link>
                <b>  |  </b>
                <Link to='/blog'>To The Blog <FontAwesomeIcon icon={faArrowRight}/> </Link>
            </span>
        </Content>
    );
};

export default About;
