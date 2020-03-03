import React from 'react';
// @ts-ignore
import Header from '../components/header';
import Footer from '../components/footer';

interface ContentProps {
    children: React.ReactNode;
}

function Content(props: ContentProps) {
    return (
        <div>
            <Header />
            <div>{props.children}</div>
            <Footer />
        </div>
    );
}

export default Content;
