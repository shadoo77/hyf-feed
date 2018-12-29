import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Header from './components/header/header';
import Footer from './components/footer';
import {List, CityStatus, AddJson, WrongPage} from './routes/routes';
import House from './components/house';

import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
      <div className="site-container">
        <Header />
        <div className="site-body">
        <Switch>
          <Route path="/" exact render={() => (
                <Redirect to="/list" />
            )}
          />
          <Route path="/list" exact component={List} />
          <Route path="/status" component={CityStatus} />
          <Route path="/add-json" component={AddJson} />
          <Route path="/house" component={House} />
          <Route component={WrongPage} />
        </Switch>
        </div>
        <Footer />
        </div>
      </div>
    );
  }
}

export default App;
