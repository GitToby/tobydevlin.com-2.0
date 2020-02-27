import React from 'react';
import {graphql, useStaticQuery} from "gatsby";
import {FooterDataQuery} from "../../graphql-types";

interface FooterProps {
}

function Footer(props: FooterProps) {
    const footerData: FooterDataQuery = useStaticQuery(graphql`
        query footerData {
            site {
                buildTime
                siteMetadata{
                    title
                }
            }
        }`);

    return (
        <div>
            footer
            <pre>Built: {footerData.site.buildTime.toString()}</pre>
        </div>
    );
}

export default Footer;