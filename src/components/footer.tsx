import React from 'react';
import {graphql, useStaticQuery} from 'gatsby';
import {FooterDataQuery} from '../../graphql-types';

interface FooterProps {}

function Footer(_props: FooterProps) {
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
        <footer className="footer">
            <div className="content has-text-centered">
                <p>
                    Built: {footerData.site.buildTime.toString()} | Version: {footerData.site.siteMetadata.version}
                </p>
            </div>
        </footer>
    );
}

export default Footer;
