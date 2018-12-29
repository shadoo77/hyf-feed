import React, { Component } from 'react';
import {
    Carousel,
    CarouselItem,
    CarouselControl,
    CarouselIndicators,
    Card, CardTitle, CardText, Modal, ModalBody, Row, Col
  } from 'reactstrap';
class House extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgItems: [],
            activeIndex: 0,
            imgModal: {},
            modal: false
        };
    }

    onExiting = () => {
        this.animating = true;
      }
    
      onExited = () => {
        this.animating = false;
      }
    
      next = () => {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === this.state.imgItems.length - 1 ? 0 : this.state.activeIndex + 1;
        this.setState({ activeIndex: nextIndex });
      }
    
      previous = () => {
        if (this.animating) return;
        const nextIndex = this.state.activeIndex === 0 ? this.state.imgItems.length - 1 : this.state.activeIndex - 1;
        this.setState({ activeIndex: nextIndex });
      }
    
      goToIndex = (newIndex) => {
        if (this.animating) return;
        this.setState({ activeIndex: newIndex });
      }

      toggle = (imgSrc, altTxt) => {
        this.setState({
            modal: !this.state.modal,
            imgModal: {imgSrc, altTxt}
        });
      }

      modalShowOneImage = () => {
          const {imgSrc, altTxt} = this.state.imgModal;
          //console.log(imgSrc)
        return <div>
                    <Modal isOpen={this.state.modal}
                    toggle={this.toggle}
                    >
                        <ModalBody>
                            <img src={imgSrc}
                            alt={altTxt}
                            className="modal-image"
                            />
                        </ModalBody>
                    </Modal>
                </div>;
      }

      addDecimalPoints = (number) => {
        let output = number.toString();
        let nrArr = output.split("").reverse();
        let newValue = '';
        for (let i = 0; i < nrArr.length; i++) {
            if (i % 3 === 0 && i !== 0) {
                newValue += '.';
            }
            newValue += nrArr[i];
        }
        output = newValue.split("").reverse().join("");
        return output;
    }

    componentDidMount() {
        const imgArr = this.props.location.state.images.split(',');
        const imgItems = imgArr.map((img, i) => {
            let index = i + 1;
            return {src: img, altText: "image "+index};
        });
        this.setState({imgItems});
      }

    render() { 
        const { title, description, country, city,
        address, grossArea, rooms, price, currency} = this.props.location.state;
        const {imgItems, activeIndex} = this.state;
        //console.log(imgItems[0].src);
        const slides = imgItems.map((item, i, el) => {
            return (
              <CarouselItem
                className="custom-tag"
                onExiting={this.onExiting}
                onExited={this.onExited}
                key={'carouseHouse' + i}
              >
                <img src={item.src}
                alt={item.altText}
                onClick={() => this.toggle(item.src, item.altText)}
                style={{cursor: 'pointer'}}
                />
              </CarouselItem>
            );
          });
        return ( 
            <div className="single-house-container">
            {this.modalShowOneImage()}
                <Carousel
                    activeIndex={activeIndex}
                    next={this.next}
                    previous={this.previous}
                >
                    <CarouselIndicators items={imgItems} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
                    {slides}
                    <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
                    <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
                </Carousel>
                <hr />
                <h2>{title}</h2>
                <Row>
                    <Col sm="6" md="4">
                        <Card body>
                        <CardTitle>Country</CardTitle>
                        <CardText>{country}</CardText>
                        </Card>
                    </Col>
                    <Col sm="6" md="4">
                        <Card body>
                        <CardTitle>City</CardTitle>
                        <CardText>{city}</CardText>
                        </Card>
                    </Col>
                    <Col sm="6" md="4">
                        <Card body>
                        <CardTitle>Address</CardTitle>
                        <CardText>{address}</CardText>
                        </Card>
                    </Col>
                    <Col sm="6" md="4">
                        <Card body>
                        <CardTitle>Price</CardTitle>
                        <CardText>{this.addDecimalPoints(price) + " " + currency}</CardText>
                        </Card>
                    </Col>
                    <Col sm="6" md="4">
                        <Card body>
                        <CardTitle>Rooms</CardTitle>
                        <CardText>{rooms}</CardText>
                        </Card>
                    </Col>
                    <Col sm="6" md="4">
                        <Card body>
                        <CardTitle>Living area</CardTitle>
                        <CardText>{grossArea + ' m2'}</CardText>
                        </Card>
                    </Col>
                </Row>
                {/* <div class="container"> */}
                <Row className="justify-content-center">
                    <Col md='10'>
                    <Card body>
                        <CardTitle>Description</CardTitle>
                        <CardText>{description}</CardText>
                    </Card>
                    </Col>
                </Row>
                {/* </div> */}
            </div>
         );
    }
}
 
export default House;