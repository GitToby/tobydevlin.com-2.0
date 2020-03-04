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
        <div className="fixed-footer">
                <span >Build by Toby Devlin</span>
                <span>
                    Created: {footerData.site.buildTime.toString()} | Version: {footerData.site.siteMetadata.version}
                </span>
        </div>
    );
}

export default Footer;
