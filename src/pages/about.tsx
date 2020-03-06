import React from 'react';
import Content from '../containers/content';
import {graphql} from 'gatsby';
import {AboutDataQuery} from '../../graphql-types';
import Img from 'gatsby-image';

interface AboutProps {
    data: AboutDataQuery;
}

const About = (props: AboutProps) => (
    <Content>
        <h2 data-aos="fade-right" data-aos-duration="800" data-aos-delay="0">
            Im a London based full stack developer
        </h2>
        <p data-aos="fade-up" data-aos-duration="600" data-aos-delay="300">
            Im originally from South England but studied in Wales and now live in London. I like to cycle, explore and
            eat food. Sometimes, when the weather is right, I like to take time to write code that does stuff.
        </p>
        <p data-aos="fade-up" data-aos-duration="600" data-aos-delay="450">
            Not being able to write english well, I studied mathematics at Cardiff University before moving on to learn
            software development. Python is my go to language, but I also like responsive, dynamic UIs in JavaScript
            (Typescript for type safety though) and my day job is writing Java and proprietary languages. If I had to do
            it over id get started with Rust faster! After a while I'll have projects for each of these, but for now
            you'll have to trust I know what im talking about.
        </p>
        <div data-aos="fade-up" data-aos-duration="600" data-aos-delay="600">
            <Img fluid={props.data.file.childImageSharp.fluid} />
        </div>
    </Content>
);

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
