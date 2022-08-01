import React from 'react';
import Content from '../containers/content';
import {graphql} from 'gatsby';
import {AboutDataQuery} from '../../graphql-types';
import Img from 'gatsby-image';
// @ts-ignore
import * as styles from '../styles/about.module.scss';
import BackgroundImage from 'gatsby-background-image';
import {
    blockAnimation,
    blockAnimationDuration,
    paraAnimation,
    paraAnimationDuration,
    titleAnimation,
    titleAnimationDuration
} from '../helper/settings';
import SEO from '../components/SEO';
import {OutboundLink} from "gatsby-plugin-google-gtag";

interface AboutProps {
    data: AboutDataQuery;
}

const About = (props: AboutProps) => {
    const paraTimeDif = 300;
    let i = 1;

    return (
        <Content>
            <SEO pageTitle="About"  isBlogPost={false}/>
            <h1 data-aos={titleAnimation} data-aos-duration={titleAnimationDuration} data-aos-delay="0">
                About Me.
            </h1>
            <hr />
            <p data-aos={paraAnimation} data-aos-duration={paraAnimationDuration} data-aos-delay={i++ * paraTimeDif}>
                I'm a London based full stack consultant, originally from south England but studied in Wales and now live
                in London. I like to cycle, explore and eat food. Sometimes, when the weather is right, I like to take
                time to write code that does stuff.
            </p>
            <div
                data-aos={blockAnimation}
                data-aos-duration={blockAnimationDuration}
                data-aos-delay={i++ * paraTimeDif}
                className={styles.imgFiller}
            >
                <Img fixed={props.data.bg1.childImageSharp.fixed} />
            </div>
            <p data-aos={paraAnimation} data-aos-duration={paraAnimationDuration} data-aos-delay={i++ * paraTimeDif}>
                Not enjoying writing very much, I studied mathematics at Cardiff University before moving on to learn
                software development. Python & Java are my go to languages, but I also like responsive, dynamic UIs in JavaScript
                (Typescript for type safety though). If I had to do it over I'd get started with Rust faster! After a while 
                I'll have projects for each of these, but for now you'll have to trust I know what im talking about.
            </p>
            <div
                data-aos={blockAnimation}
                data-aos-duration={blockAnimationDuration}
                data-aos-delay={i++ * paraTimeDif}
                className={styles.imgFiller}
            >
                <Img fixed={props.data.bg2.childImageSharp.fixed} />
            </div>
            <p data-aos={paraAnimation} data-aos-duration={paraAnimationDuration} data-aos-delay={i++ * paraTimeDif}>
                If you want to get in contact, I'm available on{' '}
                <OutboundLink href="https://www.linkedin.com/in/toby-devlin/">my LinkedIn</OutboundLink>, feel free to shoot me a message. If
                a project of mine has caught your eye and you have questions feel free to shoot me a message on that
                platform. In the event you like this website and want to copy it, feel free to smack a fork on its
                github here:{' '}
                <OutboundLink href="https://github.com/GitToby/tobydevlin.com-2.0">
                    https://github.com/GitToby/tobydevlin.com-2.0
                </OutboundLink>
            </p>
            <div
                data-aos={blockAnimation}
                data-aos-duration={blockAnimationDuration}
                data-aos-delay={i++ * paraTimeDif}
                className={styles.imgFiller}
            >
                <Img fixed={props.data.bg3.childImageSharp.fixed} />
            </div>
        </Content>
    );
};

export const query = graphql`
    query AboutData {
        bg1: file(base: {eq: "tobydevlin-com-home-image-ldn-roof.jpg"}) {
            childImageSharp {
                fixed(width: 1400) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
        bg3: file(base: {eq: "tobydevlin-com-home-image-ny-30h.jpg"}) {
            childImageSharp {
                fixed(width: 1400) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
        bg2: file(base: {eq: "toby-devlin-blog-website-background-woods-wide.jpeg"}) {
            childImageSharp {
                fixed(width: 1400) {
                    ...GatsbyImageSharpFixed
                }
            }
        }
    }
`;

export default About;
