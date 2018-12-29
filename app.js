"use strict";

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false, limit:'50mb'}));
app.use(bodyParser.json({limit:'50mb'}));

//access for anywhere on the server
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Access-Token'
    );
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
        return res.status(200).json({});
    }
    next();
});

const list = require('./api/routes/list');
app.use('/api', list);


app.use((req, res, next) => {
    const error = new Error('inserted request is not found!');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res
        .status(error.status || 500)
        .json({Error: error.message});
});



const server = {
    host: 'http://localhost',
    port: 8000
};

const port = process.env.PORT || server.port;
    app.listen(port, () => {
        console.log(`Listening on ${server.host}:${port} ..`);
    });