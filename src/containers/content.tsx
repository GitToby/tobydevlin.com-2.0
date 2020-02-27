import React from 'react';
// @ts-ignore
import contentStyles from '../styles/content.module.css'
import {graphql, useStaticQuery} from "gatsby";
import Header from "../components/header";
import Footer from "../components/footer";
import {ContentDataQuery} from "../../graphql-types";

interface ContentProps {
    test_value?: string;
    children: React.ReactNode
}

function Content(props: ContentProps) {
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
        <div className={contentStyles.container}>
            <h2>{contentData.site.siteMetadata.title}</h2>
            <Header/>
            {props.children}
            <Footer/>
        </div>
    );
}

export default Content;
