import React, {useEffect, useState} from 'react';
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
    add_scroll?: boolean;
}

const Content = (props: ContentProps) => {
    const [showScroll, setShowScroll] = useState(props.add_scroll ? props.add_scroll : false)

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, true);

        // Remove the event listener when this component unmounts
        return () => {
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, []);

    function handleScroll() {
        const at_bottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight
        if (at_bottom) {
            setShowScroll(false)
        }
    }

    return (
        <div className={styles.contentWrapper}>
            <Header/>
            <SEO isBlogPost/>
            <Container className={styles.contentBody}>
                <Particles className={styles.particles} options={particlesOptions}/>
                {showScroll &&
                    <div className={styles.scrollIcon}>
                        <div className={styles.container}>
                            <div className={styles.chevron}></div>
                            <div className={styles.chevron}></div>
                            <div className={styles.chevron}></div>
                        </div>
                    </div>
                }
                {props.children}
            </Container>
            <Footer/>
        </div>
    );
};

export default Content;
