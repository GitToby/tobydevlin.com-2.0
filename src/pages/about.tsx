import React from 'react';
import Content from '../containers/content';
// @ts-ignore
import * as styles from '../styles/about.module.scss';
import {
    blockAnimation,
    blockAnimationDuration,
    links,
    paraAnimation,
    paraAnimationDuration,
    titleAnimation,
    titleAnimationDuration
} from '../helper/constants';
import SEO from '../components/SEO';
import {OutboundLink} from 'gatsby-plugin-google-gtag';
import {StaticImage} from 'gatsby-plugin-image';
import {Link} from "gatsby";

const _pathToImg = '../../static/images/backdrops';

const About = () => {
    const paraTimeDif = 300;
    let i = 1;

    return (
        <Content>
            <SEO pageTitle="About" isBlogPost={false}/>
            <h1 data-aos={titleAnimation} data-aos-duration={titleAnimationDuration} data-aos-delay="0">
                About Me.
            </h1>
            <hr/>
            <p className={styles.aboutPara} data-aos={paraAnimation} data-aos-duration={paraAnimationDuration} data-aos-delay={i++ * paraTimeDif}>
                <i>Hi!</i> I'm toby, a full stack software & data engineer. I grew up in south England, studied in Wales
                and now live and work in Australia. I like to cycle, explore and eat food. Sometimes, when the weather
                is just right, I like to write code that does stuff. Some of these projects do things, others just look
                nice; most can be found on my <OutboundLink href={links.github}>GitHub</OutboundLink>. I have a wealth
                of experience across all aspects of software, security and data engineering from user interfaces and
                back ends to cloud infrastructure, networking, analytical engineering and product ownership. This, on
                top of the fact I have spent a number of years doing freelance and charity consulting.
            </p>
            <div
                data-aos={blockAnimation}
                data-aos-duration={blockAnimationDuration}
                data-aos-delay={i++ * paraTimeDif}
                className={styles.imgFiller}
            >
                <StaticImage
                    src={`${_pathToImg}/tobydevlin-com-home-image-ldn-roof-crop.jpg`}
                    alt="London"
                    placeholder="blurred"
                    layout="fixed"
                    width={1400}
                    height={200}
                />
            </div>
            <p className={styles.aboutPara} data-aos={paraAnimation} data-aos-duration={paraAnimationDuration} data-aos-delay={i++ * paraTimeDif}>
                Not enjoying writing very much, I studied mathematics at Cardiff University before moving on to learn
                software development. Python & Java are my go to languages, but I also like responsive, dynamic UIs in
                Typescript + React. Im currently working on professional and personal projects in the intersection
                of Data & Application Engineering domains, building solutions to unlock terabyte scale insights with
                distributed data. Ultimately I love to be working with data streams and working to overcome some of the
                flaws in today's domain driven design approaches to software. In my personal time i like to tinker with
                lower level IoT devices, running code in less abstracted languages such as Rust & Go to overcome the
                lethargic nature of python and unlock the power of the edge!
            </p>
            <div
                data-aos={blockAnimation}
                data-aos-duration={blockAnimationDuration}
                data-aos-delay={i++ * paraTimeDif}
                className={styles.imgFiller}
            >
                <StaticImage
                    src={`${_pathToImg}/toby-devlin-blog-website-background-woods-crop.jpeg`}
                    alt="London"
                    placeholder="blurred"
                    layout="fixed"
                    width={1400}
                    height={200}
                />
            </div>
            <p className={styles.aboutPara} data-aos={paraAnimation} data-aos-duration={paraAnimationDuration} data-aos-delay={i++ * paraTimeDif}>
                If you want to get in contact, I'm available on{' '}
                <OutboundLink href={links.linkedin}>my LinkedIn</OutboundLink>, or send me a message using the <Link
                to={'/contact_and_consulting'}> contact form</Link>. If a project of mine has caught your eye and you
                have questions feel free to shoot me a message on that platform. In the event you like this website and
                want to copy it, its all open source so feel free to smack a fork on its {' '}
                <OutboundLink href={`${links.github}/tobydevlin.com-2.0`}>github mirror</OutboundLink>.
            </p>
            <div
                data-aos={blockAnimation}
                data-aos-duration={blockAnimationDuration}
                data-aos-delay={i++ * paraTimeDif}
                className={styles.imgFiller}
            >
                <StaticImage
                    src={`${_pathToImg}/tobydevlin-com-home-image-ny-30h-crop.jpg`}
                    alt="London"
                    placeholder="blurred"
                    layout="fixed"
                    width={1400}
                    height={200}
                />
            </div>
        </Content>
    );
};

export default About;
