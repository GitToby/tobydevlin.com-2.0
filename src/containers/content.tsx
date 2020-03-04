import React from 'react';
// @ts-ignore
import Header from '../components/header';
import Footer from '../components/footer';
import { Container } from "react-bootstrap";

interface ContentProps {
    children: React.ReactNode;
}

function Content(props: ContentProps) {
    return (
        <div className="content-wrapper">
            <Header />
            <Container>{props.children}</Container>
            <Footer />
        </div>
    );
}

export default Content;
