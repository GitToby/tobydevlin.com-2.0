import React from 'react';
import Content from '../containers/content';

interface IndexProps {}

function Index(_props: IndexProps) {
    return (
        <Content>
            <h2 style={{color: 'red'}}>
                Hello<i> world!</i> itsa me, toby!
            </h2>
            <img src="https://source.unsplash.com/random/100x100" alt="" />
        </Content>
    );
}

export default Index;
