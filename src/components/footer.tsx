import React from 'react';
import {graphql, useStaticQuery, navigate} from 'gatsby';
import {FooterDataQuery} from '../../graphql-types';
import {Nav, Navbar} from 'react-bootstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGithub, faGitlab, faLinkedin} from '@fortawesome/free-brands-svg-icons';
// @ts-ignore
import * as styles from '../styles/headerfooter.module.scss';

interface FooterProps {
}

const Footer = (_props: FooterProps) => {
    const footerData: FooterDataQuery = useStaticQuery(graphql`
        query footerData {
            site {
                buildTime(formatString: "dddd, MMMM Do YYYY, h:mm:ss a")
                siteMetadata {
                    title
                    version
                    socialLinks {
                        github
                        gitlab
                        linkedin
                    }
                }
            }
        }
    `);

    const {github, gitlab, linkedin} = footerData.site.siteMetadata.socialLinks;

    return (
        <Navbar bg="light" className={styles.footer}>
            <Nav className="mr-auto">
                <Nav.Link onClick={() => navigate('/about')}>Created by Toby Devlin</Nav.Link>
                <Nav.Link href={gitlab}>
                    <FontAwesomeIcon icon={faGitlab}/>
                </Nav.Link>
                <Nav.Link href={github}>
                    <FontAwesomeIcon icon={faGithub}/>
                </Nav.Link>
                <Nav.Link href={linkedin}>
                    <FontAwesomeIcon icon={faLinkedin}/>
                </Nav.Link>
            </Nav>
            <div className={styles.alignLeft}>
                <Nav id={styles.footerBuildVersion}>
                    built version {footerData.site.siteMetadata.version} | {footerData.site.buildTime.toString()}
                </Nav>
            </div>
        </Navbar>
    );
};

export default Footer;
