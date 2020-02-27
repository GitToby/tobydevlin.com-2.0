import React from "react"
import {Link, useStaticQuery} from "gatsby";
import {graphql} from "gatsby"
import Layout from "../containers/layout";

interface IndexProps {
    data: any
}

function Index(props: IndexProps) {
    return (
        <Layout>
            <h3>{props.data.site.siteMetadata.title}</h3>
            <h2 style={{color: "red"}}>Hello world! itsa me, toby!</h2>
            <Link to={"/about"}>home</Link>
            <img src="https://source.unsplash.com/random/100x100" alt=""/>
        </Layout>
    );
}

export const query = graphql`
  query IndexQuery {
    site {
      siteMetadata {
        title
      }
    }
  }
`;


export default Index;
