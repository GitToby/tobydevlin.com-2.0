import React from 'react';
import Content from '../containers/content';
// @ts-ignore
import shapegame from '../../content/img/netlifyCMS/shapegame.jpg'

interface AboutProps {
}

function About(_props: AboutProps) {
    return (
        <Content>
            about me!
            img:
            <img src={shapegame} alt={'img'}/>
            cool
        </Content>
    );
}

export default About;
