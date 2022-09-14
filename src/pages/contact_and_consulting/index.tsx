import React, {useState} from 'react';
import Content from '../../containers/content';
// @ts-ignore
import * as styles from '../../styles/about.module.scss';
import {paraAnimation, paraAnimationDuration, titleAnimation, titleAnimationDuration} from '../../helper/settings';
import SEO from '../../components/SEO';
import {Button, Col, FloatingLabel, Form, FormGroup, Row} from 'react-bootstrap';
import {OutboundLink} from 'gatsby-plugin-google-gtag';
import {Link} from 'gatsby';

const pageDescription = 'Get in contact with Toby';

const About = () => {
    const [validated, setValidated] = useState<boolean>(false);

    const handleSubmit = (event: any) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (
        <Content>
            <SEO pageTitle="Contact" isBlogPost={false} pageDescription={pageDescription} />
            <h1 data-aos={titleAnimation} data-aos-duration={titleAnimationDuration} data-aos-delay="0">
                Contact Form.
            </h1>
            <hr />
            <p data-aos={paraAnimation} data-aos-duration={paraAnimationDuration}>
                If you'd like to get in contact with me the best way is via this form. Im usually available on various
                platforms too, if you'd like to reach out via{' '}
                <OutboundLink href="https://www.linkedin.com/in/toby-devlin/">Linkedin</OutboundLink>. Alongside my day
                job I am an experience Data Consultant with years of experience in full stack data applications,
                pipelines and ecosystems. Please reach out if you are interested in my services and do check out my{' '}
                <Link to="/portfolio">portfolio</Link>.
            </p>

            <Form
                name="contact"
                data-netlify
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                action="/contact_and_consulting/success"
                data-aos={paraAnimation}
                data-aos-duration={paraAnimationDuration}
            >
                <Row>
                    <FormGroup className="mb-2" as={Col} md="4" sm="12">
                        <FloatingLabel label="First Name*">
                            <Form.Control name="firstName" required placeholder="" />
                            <Form.Control.Feedback type="invalid">Please provide a first name.</Form.Control.Feedback>
                        </FloatingLabel>
                    </FormGroup>
                    <FormGroup className="mb-2" as={Col} md="4" sm="12">
                        <FloatingLabel label="Middle Name(s)">
                            <Form.Control name="middleNames" placeholder="" />
                        </FloatingLabel>
                    </FormGroup>
                    <FormGroup className="mb-2" as={Col} md="4" sm="12">
                        <FloatingLabel label="Last Name*">
                            <Form.Control name="lastName" required placeholder="" />
                            <Form.Control.Feedback type="invalid">Please provide a last name.</Form.Control.Feedback>
                        </FloatingLabel>
                    </FormGroup>
                </Row>

                <Row>
                    <FormGroup className="mb-2" as={Col} sm="6">
                        <FloatingLabel label="Contact Email*">
                            <Form.Control name="email" required type="email" placeholder="" />
                            <Form.Control.Feedback type="invalid">Please provide a valid email.</Form.Control.Feedback>
                        </FloatingLabel>
                    </FormGroup>
                    <FormGroup className="mb-2" as={Col} sm="6">
                        <FloatingLabel label="Contact Phone">
                            <Form.Control name="phone" type="phone" pattern="[0-9]{9}" placeholder="" />
                        </FloatingLabel>
                    </FormGroup>
                </Row>

                <Row>
                    <FormGroup className="mb-2" as={Col} sm="12">
                        <FloatingLabel label="Im Contacting About*">
                            <Form.Select name="about" required>
                                <option>General Inquiry</option>
                                <option>Consulting Services Inquiry</option>
                                <option>Question</option>
                                <option>CV Request</option>
                                <option>Reference Request</option>
                            </Form.Select>
                        </FloatingLabel>
                    </FormGroup>
                </Row>

                <Row>
                    <FormGroup className="mb-2" as={Col} sm="12">
                        <FloatingLabel label="Message*">
                            <Form.Control
                                name="message"
                                required
                                as="textarea"
                                placeholder=""
                                minLength={30}
                                rows={50}
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a message over 30 characters.
                            </Form.Control.Feedback>
                        </FloatingLabel>
                    </FormGroup>
                </Row>

                <Row>
                    <Form.Group className="mb-2" as={Col} sm="6">
                        <Form.Check name="response" type="checkbox" label="Request Response" />
                    </Form.Group>
                </Row>
                <Row>
                    <Button className="mb-2" variant="primary" type="submit">
                        Submit
                    </Button>
                </Row>
            </Form>
        </Content>
    );
};

export default About;
