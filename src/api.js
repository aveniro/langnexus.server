const express = require('express');
const config = require('../config.json');
const package = require('../package.json');

// API endpoints
const update = require('./github/update');

const api = express.Router();

api.use('/update', update);

api.get('/', (req, res) => {
    res.send(
        {
            version: package.version
        }
    );
});

module.exports = api;