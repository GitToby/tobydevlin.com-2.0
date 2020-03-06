import React from 'react';
import Content from '../containers/content';
import {Link} from 'gatsby';
// @ts-ignore
import * as styles from '../styles/404.module.scss';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons';

const Page404 = () => (
    <Content>
        <div className={styles.background}>
            <div data-aos="fade-up" data-aos-duration="1000" data-aos-delay="0">
                <h2 id={styles.subtitle}>Nothing Found :(</h2>
            </div>
            <p data-aos="fade-up" data-aos-duration="1000" data-aos-delay="250">
                The page you we're looking for doesn't exist.
            </p>
            <p data-aos="fade-left" data-aos-duration="1500" data-aos-delay="1000">
                <Link to="/">
                    <FontAwesomeIcon icon={faChevronLeft} height="10px" /> back home
                </Link>
            </p>
        </div>
    </Content>
);

export default Page404;
