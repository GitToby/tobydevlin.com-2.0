import React from 'react';
import {graphql, Link, useStaticQuery} from 'gatsby';
import {FooterDataQuery} from '../../graphql-types';
import {Nav, Navbar} from 'react-bootstrap';
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
            <Nav className="mr-auto">
                <Link to="/about">
                    <Nav.Item>Created by Toby Devlin</Nav.Item>
                </Link>
            </Nav>
            <Nav id={styles.footerBuildVersion}>
                built {footerData.site.buildTime.toString()} | Version: {footerData.site.siteMetadata.version}
            </Nav>
        </Navbar>
    );
};

export default Footer;
