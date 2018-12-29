import React, { Component } from 'react';
import axios from 'axios';
import { Alert, InputGroup, InputGroupAddon,
   Input, Button, ListGroup, ListGroupItem} from 'reactstrap';
import validator from 'validator';

class AddForm extends Component {
    constructor() {
        super();
        this.state = {
          selectedFile: '',
          urlText: '',
          urlIsValid: '',
          data: '',
          error: false,
          errorDetails: [],
          errReqMessage: '',
          formReport: false,
          isLoaded: true,
          showErrors: false,
          limitErr: 5
        };
    }

    onChange = (e) => {
      //console.log('hhhh', e.target.files[0]);
        switch (e.target.name) {
          case 'selectedFile':
            this.setState({ selectedFile: e.target.files[0] });
            break;
          default:
            this.setState({ [e.target.name]: e.target.value });
        }
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.setState({
          formReport: true,
          isLoaded: false,
          showErrors: false,
          limitErr: 5
        });
        const { selectedFile } = this.state;
        let formData = new FormData();

        //formData.append('description', description);
        formData.append('selectedFile', selectedFile);

          axios.post('/api/addjson', formData)
                .then(res => {
                  // console.log(res.data)
                    this.setState({
                      data: res.data,
                      isLoaded: true,
                      error: false,
                      errorDetails: res.data.errMessages,
                      errReqMessage: '' 
                    });
                })
                .catch(err => {
                    console.log('add error ::: ', err.response);
                    this.setState({
                      isLoaded: true,
                      error: true,
                      errReqMessage: err.response.data.message 
                        ? err.response.data.message 
                        : 'Invalid JSON file or there is a syntax error in it!'
                    });
                });
    }

    // URL functions
    handleURL = e => {
      this.setState({ [e.target.name]: e.target.value });
      if(!validator.isURL(e.target.value)) {
        this.setState({ urlIsValid: 'is-invalid' });
      }else this.setState({ urlIsValid: 'is-valid' });
    }

    urlSubmit = e => {
      e.preventDefault();
      const { urlText } = this.state;
        
        if(validator.isURL(urlText)) {
          this.setState({
            //urlIsValid: '',
            formReport: true,
            isLoaded: false,
            showErrors: false,
            limitErr: 5
          });

          axios.post('/api/addjson-url', {link: urlText})
                .then(res => {
                  this.setState({
                    data: res.data,
                    isLoaded: true,
                    error: false,
                    errorDetails: res.data.errMessages,
                    errReqMessage: '',  
                  });
                })
                .catch(err => {
                  this.setState({
                    isLoaded: true,
                    error: true,
                    errReqMessage: err.response.data.message 
                      ? err.response.data.message 
                      : 'Invalid JSON file or there is a syntax error in it!'
                  });
                });
          this.setState({ urlText: '' , urlIsValid: ''});
        }else {
          this.setState({ urlIsValid: 'is-invalid' });
        }
    }

    displayReportSection() {
      return !this.state.formReport ? "form-report hidden m-3" : "form-report m-3";
    }

    reportSection() {
      const {isLoaded, errReqMessage, data} = this.state;
      const errExtraDetails = <span>
         <span className="alert-link m-2"
          style={{cursor: "pointer"}}
          onClick={() => { this.setState({showErrors: true})}}>
          click here</span> to see the report
      </span>;
      if(!isLoaded) return <div>Loading ...</div>;
      else {
        return this.state.error 
               ? <div>
                  <Alert color="danger">
                  <span className="alert-link">{errReqMessage}</span>
                  </Alert>
                </div>
               : <div>
                  <Alert color="success">
                          <span className="alert-link">{data.insertedItems + " "}</span>
                          items inserted successful!
                  </Alert>
                  <Alert color="danger">
                          <span className="alert-link">{data.errors + " "}</span>
                          error! {data.errors < 1 ? null:errExtraDetails}
                  </Alert>
                </div>;
      }
    }

    errorsDetails() {
      const {showErrors, errorDetails, limitErr, data} = this.state;
      return !showErrors
      ? null 
      : <div>
        <ListGroup>
          {errorDetails.map((el, index) => {
            return index >= limitErr ? null
            : <ListGroupItem key={'pa'+index} tag="button" action className="error-item">
              <dl>
                <dt>Item number {el.id}</dt>
                {el.messages.map((ch, i) => {
                  return <dd key={i+'childI'}>{ch}</dd>
                })}
              </dl>
            </ListGroupItem>
          })}
        </ListGroup>
        <Button color="success"
        style={{visibility: limitErr >= data.errors ? 'hidden':null}}
        onClick={() => {
          this.setState({limitErr: this.state.limitErr+5})
        }}>
          show more
        </Button>
        </div>
    }

    render() { 
        //const { description } = this.state;
        
        return (
          <React.Fragment>
          <form onSubmit={this.onSubmit} id="file-upload-form" encType="multipart/form-data">
            <input
              type="file"
              name="selectedFile"
              //className="custom-file-input"
              id="upload-file"
              onChange={this.onChange}
              accept=".json"
              required
            /><label className="upload-label btn btn-primary m-3" htmlFor="upload-file">
            Browse...
            </label>
            <Button color="success">Submit</Button>
          </form>

          
          <form id="add-url-form" className="m-4" onSubmit={this.urlSubmit}>
          <InputGroup>
            <InputGroupAddon addonType="prepend">URL</InputGroupAddon>
            <Input 
            className={this.state.urlIsValid}
            name="urlText"
            onChange={this.handleURL}
            value={this.state.urlText}
            required
             />
            <InputGroupAddon addonType="prepend"><Button color="success">Add URL</Button></InputGroupAddon>
            <div className="valid-feedback">Good! valid URL</div>
            <div className="invalid-feedback">Invalid URL ! rewrite a valid URL</div>
          </InputGroup>
          
          </form>


          <div className={this.displayReportSection()}>
            {this.reportSection()}
          </div>
          <section className="error-details">
            {this.errorsDetails()}
          </section>
          </React.Fragment>
        );
    }
}
 
export default AddForm;