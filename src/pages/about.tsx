import React from 'react';
import {Link} from "gatsby";
import Content from "../containers/content";

interface AboutProps {
}

function About(props: AboutProps) {
    return (
        <Content test_value='hello world'>
            about me!
            <Link to={"/"}>home</Link>
        </Content>
    );
}

export default About;