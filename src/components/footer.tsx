import React from 'react';
import {graphql, useStaticQuery, navigate} from 'gatsby';
import {FooterDataQuery} from '../../graphql-types';
import {Nav, Navbar} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faGitlab, faLinkedin} from '@fortawesome/free-brands-svg-icons';
// @ts-ignore
import * as styles from '../styles/headerfooter.module.scss';

interface FooterProps {}

const Footer = (_props: FooterProps) => {
    const footerData: FooterDataQuery = useStaticQuery(graphql`
        query footerData {
            site {
                buildTime(formatString: "dddd, MMMM Do YYYY, h:mm:ss a")
                siteMetadata {
                    title
                    version
                }
            }
        }
    `);

    return (
        <Navbar bg="light" className={styles.footer}>
            <Nav>
                <Nav.Link onClick={() => navigate('/about')}>Created by Toby Devlin</Nav.Link>
                <Nav.Link href="https://gitlab.com/MrAdjunctPanda">
                    <FontAwesomeIcon icon={faGitlab} />
                </Nav.Link>
                <Nav.Link href="https://github.com/GitToby">
                    <FontAwesomeIcon icon={faGithub} />
                </Nav.Link>
                <Nav.Link href="https://www.linkedin.com/in/toby-devlin-741b45106/">
                    <FontAwesomeIcon icon={faLinkedin} />
                </Nav.Link>
            </Nav>
            <Nav id={styles.footerBuildVersion} className="mr-auto">
                built version {footerData.site.siteMetadata.version} | {footerData.site.buildTime.toString()}
            </Nav>
        </Navbar>
    );
};

export default Footer;
