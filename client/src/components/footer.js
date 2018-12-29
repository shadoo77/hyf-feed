import React from 'react';
import {Card, CardTitle, CardText, Row, Col} from 'reactstrap';

const Footer = () => {
    return (
        <footer>
            <Row>
                <Col sm>
                    <Card body>
                        <CardTitle>Contact</CardTitle>
                        <CardText>
                            <div className="contact-wraper">
                                <div className="foo-contact-icons">
                                    <i class="fas fa-map-marker-alt"></i>
                                </div>
                                <div className="foo-contact-info">
                                Herengracht, 504 1017 CB<br />
                                <strong>Amsterdam, Netherland</strong>
                                </div>
                            </div>
                            <div className="contact-wraper">
                                <div className="foo-contact-icons">
                                    <i className="fas fa-phone-square"></i>
                                </div>
                                <div className="foo-contact-info">
                                    <strong>+31 61 40 62 887</strong>
                                </div>
                            </div>
                            <div className="contact-wraper">
                                <div className="foo-contact-icons">
                                    <i className="fab fa-linkedin-in"></i>
                                </div>
                                <div className="foo-contact-info">
                                linkedin.com/in/shadi-amr
                                </div>
                            </div>
                            <div className="contact-wraper">
                                <div className="foo-contact-icons">
                                    <i className="fab fa-git-square"></i>
                                </div>
                                <div className="foo-contact-info">
                                github.com/shadoo77
                                </div>
                            </div>
                            <div className="contact-wraper">
                                <div className="foo-contact-icons">
                                    <i class="fas fa-envelope"></i>
                                </div>
                                <div className="foo-contact-info">
                                shadi.omar077@gmail.com
                                </div>
                            </div>
                        </CardText>
                    </Card>
                </Col>
                <Col sm>
                    <Card body>
                        <CardTitle>About the company</CardTitle>
                        <CardText>
                        HackYourFuture is a code school (foundation) teaching 
                        computer programming to refugees. Our aim is to empower 
                        our students through coding and get them to work as software 
                        developers. With 40 developers (all volunteers) we have 
                        created a 6-month program in which our students learn the 
                        fundamentals of web-development.
                        </CardText>
                    </Card>
                </Col>
                <Col lg>
                    <Card className="footer-logo" body>
                        <CardText>
                        <img src="./LogoMakr_89d5gV.png" alt="logoImg" className="mx-auto d-block"/>
                        <p>Copyright © 2018 Shadi Omar Technologies || All rights reserved.</p>
                        </CardText>
                    </Card>
                </Col>
            </Row>
        </footer>
    );
}
 
export default Footer;