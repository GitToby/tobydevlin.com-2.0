import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import {HeaderDataQuery} from '../../graphql-types';
import {navigate} from 'gatsby';
import {Nav, Navbar} from 'react-bootstrap';
// @ts-ignore
import * as styles from '../styles/headerfooter.module.scss';

interface HeaderProps {}

const Header = (_props: HeaderProps) => {
    const headerData: HeaderDataQuery = useStaticQuery(graphql`
        query headerData {
            allSitePage {
                distinct(field: path)
            }
            site {
                siteMetadata {
                    title
                }
            }
        }
    `);

    return (
        <Navbar collapseOnSelect bg="light" expand="md" sticky="top" className={styles.header}>
            <Navbar.Brand href="/">{headerData.site.siteMetadata.title}</Navbar.Brand>
            <Navbar.Toggle />
            <Navbar.Collapse>
                <Nav className="mr-auto">
                    {headerData.allSitePage.distinct
                        .filter((pageLocation: string) => {
                            // only 1st order pages should be shown in nav
                            const isTopLevel = pageLocation.match(/\//g).length === 2;
                            const is404 = pageLocation.match(/404/) !== null;
                            return isTopLevel && !is404;
                        })
                        .map((pageLocation: string, idx: number) => {
                            return (
                                <Nav.Link key={idx} onClick={() => navigate(pageLocation)}>
                                    {/* replace / in display */}
                                    {pageLocation
                                        .replace(/\//g, '')
                                        .charAt(0)
                                        .toUpperCase() +
                                        pageLocation
                                            .replace(/\//g, '')
                                            .substr(1)
                                            .toLowerCase()}
                                </Nav.Link>
                            );
                        })}
                </Nav>
                <Nav id={styles.loginButton}>
                    <Nav.Link href="/admin">Log In</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
