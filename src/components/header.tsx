import React from 'react';
import {graphql, Link, useStaticQuery} from 'gatsby';
import {HeaderDataQuery} from '../../graphql-types';
import {Button, Navbar} from '@blueprintjs/core';
import {Alignment} from '@blueprintjs/core/lib/esm/common/alignment';
import {navigate} from 'gatsby';

interface HeaderProps {}

function Header(_props: HeaderProps) {
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

    function clickMe() {
        const str = 'hello world';
        console.log(str);
    }

    return (
        <Navbar fixedToTop>
            <Navbar.Group align={Alignment.LEFT}>
                <Navbar.Heading>{headerData.site.siteMetadata.title}</Navbar.Heading>
                <Navbar.Divider />
                {headerData.allSitePage.distinct
                    .filter((pageLocation: string) => {
                        // only 1st order pages should be shown in nav
                        const isTopLevel = pageLocation.match(/\//g).length === 2;
                        const is404 = pageLocation.match(/404/) !== null;
                        return isTopLevel && !is404;
                    })
                    .map((pageLocation: string, idx: number) => {
                        return (
                            <Button key={idx} className="bp3-minimal" onClick={() => navigate(pageLocation)}>
                                {/* replace / in display */}
                                {pageLocation.replace(/\//g, '')}
                            </Button>
                        );
                    })}
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Button className="bp3-minimal" icon="home" text="Log In" />
            </Navbar.Group>
        </Navbar>
    );
}

export default Header;
