import React from 'react';
import {graphql, Link, useStaticQuery} from 'gatsby';
import {HeaderDataQuery} from '../../graphql-types';

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
        <div>
            <h2>{headerData.site.siteMetadata.title}</h2>
            {headerData.allSitePage.distinct.map((location: string, idx: number) => {
                return (
                    <div key={idx}>
                        <Link to={location}>{location}</Link>
                    </div>
                );
            })}
            <hr />
            <button onClick={clickMe}>click me!</button>
        </div>
    );
}

export default Header;
