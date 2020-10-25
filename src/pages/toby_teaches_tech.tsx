import React from 'react';
import Content from '../containers/content';
// @ts-ignore
import * as styles from '../styles/index.module.scss';
import {graphql, Link} from 'gatsby';

const TobyTeachesTech = () => (
    <Content>
        <div data-aos="fade-right" data-aos-duration="1000" data-aos-delay="0">
         <p>
             This is another page.
         </p>
        </div>
    </Content>
);

export default TobyTeachesTech;
