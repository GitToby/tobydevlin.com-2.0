import React from 'react';
import {Helmet} from 'react-helmet';
import Scripts from "./scripts";

type SEOProps = {
    pageTitle?: string;
    pageDescription?: string;
    isBlogPost: boolean;
};

const SEO = (props: SEOProps) => {
    return (
        <Helmet title={props.pageTitle} defaultTitle="TobyDevlin.com." titleTemplate="TobyDevlin.com | %s">
            <link rel="canonical" href="https://tobydevlin.com"/>

            {/* Meta tags */}
            <meta name="description" content={props.pageDescription}/>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
            <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
            <Scripts/>
        </Helmet>
    );
};
const defaultProps: SEOProps = {
    isBlogPost: false,
    pageDescription:
        'Toby Devlin.com - home of my site! I work on lots of projects from time to time and I like to get half way in before breaking things and quitting. This is where I will write the occasional post to to keep notes or share details on some of my projects and learnings.'
};

SEO.defaultProps = defaultProps;

export default SEO;
