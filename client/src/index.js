import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Router } from 'react-router-dom';
import history from './history';
import {Provider} from 'mobx-react';
import HousesStore from './stores/HousesStore';

const Root = (
    <Provider HousesStore={HousesStore}>
        <App />
    </Provider>
);

ReactDOM.render(
    <Router history={history}>
        {Root}
    </Router>,
 document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
