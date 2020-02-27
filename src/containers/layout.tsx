import React from 'react';
// @ts-ignore
import layoutStyles from './layout.module.css'
import {graphql, useStaticQuery} from "gatsby";

export interface LayoutProps {
    test_value?: string;
    children: React.ReactNode
}

function Layout(props: LayoutProps) {
    const siteData = useStaticQuery(graphql` 
        query {
            site {
                siteMetadata {
                    title
                }
            }
        }`);

    return (
        <div className={layoutStyles.container}>
            <h2>TobyDevlin.com 2.0</h2>
            <b>{props.test_value}</b>
            {props.children}
            <pre>{JSON.stringify(siteData, null, 2)}</pre>
        </div>
    );
}

export default Layout;