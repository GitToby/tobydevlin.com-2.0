import React from 'react';
import Content from '../containers/content';

interface AboutProps {}

function About(props: AboutProps) {
    return (
        <Content>
            about me! img:
            <pre>{JSON.stringify(props, null, 2)}</pre>
        </Content>
    );
}

export default About;
