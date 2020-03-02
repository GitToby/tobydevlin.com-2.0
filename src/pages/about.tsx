import React from 'react';
import Content from '../containers/content';
import {graphql} from 'gatsby';
import {AboutDataQuery} from '../../graphql-types';
import Img from 'gatsby-image';

interface AboutProps {
    data: AboutDataQuery;
}

function About(props: AboutProps) {
    return (
        <Content>
            about me! img:
            <Img fluid={props.data.file.childImageSharp.fluid} />
            <pre>{JSON.stringify(props, null, 2)}</pre>
        </Content>
    );
}

export const query = graphql`
    query AboutData {
        file(base: {eq: "toby-devlin-blog-website-background.jpg"}) {
            childImageSharp {
                # Specify the image processing specifications right in the query.
                # Makes it trivial to update as your page's design changes.
                fluid {
                    ...GatsbyImageSharpFluid
                }
            }
        }
    }
`;

export default About;
