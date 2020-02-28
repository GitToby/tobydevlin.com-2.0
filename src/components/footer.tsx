import React from 'react';
import {graphql, useStaticQuery} from "gatsby";
import {FooterDataQuery} from "../../graphql-types";

interface FooterProps {
}

function Footer(props: FooterProps) {
    const footerData: FooterDataQuery = useStaticQuery(graphql`
        query footerData {
            site {
                buildTime(formatString: "dddd, MMMM Do YYYY, h:mm:ss a")
                siteMetadata {
                    title
                    version
                }
            }
        }`);

    return (
        <div>
            <pre>Built: {footerData.site.buildTime.toString()} | Version: {footerData.site.siteMetadata.version} </pre>
        </div>
    );
}

export default Footer;