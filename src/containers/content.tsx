import React from 'react';
// @ts-ignore
import contentStyles from '../styles/content.module.scss';
import Header from '../components/header';
import Footer from '../components/footer';

interface ContentProps {
    children: React.ReactNode;
}

function Content(props: ContentProps) {
    return (
        <div className={contentStyles.container}>
            <Header />
            {props.children}
            <Footer />
        </div>
    );
}

export default Content;
