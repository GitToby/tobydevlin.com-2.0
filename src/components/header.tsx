import React from 'react';
import {graphql, navigate, useStaticQuery} from 'gatsby';
import {HeaderDataQuery} from '../../graphql-types';
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
                            {
                                /* replace / in nav display */
                            }
                            let pageLocationStrings = pageLocation
                                .replace(/\//g, '')
                                .replace(/_/g, ' ')
                                .split(' ');
                            pageLocationStrings = pageLocationStrings.map(
                                (string) => string.charAt(0).toUpperCase() + string.substr(1).toLowerCase()
                            );
                            let navString = pageLocationStrings.join(' ');
                            return (
                                <Nav.Link key={idx} onClick={() => navigate(pageLocation)}>
                                    {navString}
                                </Nav.Link>
                            );
                        })}
                </Nav>
                <div className={styles.alignLeft}>
                    <Nav>
                        <Nav.Link href="/admin">Log In</Nav.Link>
                    </Nav>
                </div>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
