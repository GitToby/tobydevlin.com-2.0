import React from 'react';
// @ts-ignore
import layoutStyles from '../styles/content.module.css'
import {graphql, useStaticQuery} from "gatsby";
import Header from "../components/header";
import Footer from "../components/footer";
import {ContentDataQuery} from "../../graphql-types";

export interface LayoutProps {
    test_value?: string;
    children: React.ReactNode
}

function Content(props: LayoutProps) {
    const contentData: ContentDataQuery = useStaticQuery(graphql`
        query contentData {
            site {
                siteMetadata{
                    title
                }
            }
        }
    `);
    return (
        <div className={layoutStyles.container}>
            <h2>{contentData.site.siteMetadata.title}</h2>
            <Header/>
            {props.children}
            <Footer/>
        </div>
    );
}

export default Content;