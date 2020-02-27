import React from 'react';
import {Link} from "gatsby";
import Layout from "../../containers/layout";

function About(props: any) {
    return (
        <Layout test_value='hello world'>
            about me!
            <Link to={"/"}>home</Link>
        </Layout>
    );
}

export default About;