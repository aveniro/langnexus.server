const express = require('express');
const config = require('../config.json');

const api = require('./api.js');

const app = express();
app.use(express.json())

app.use('/', api);

app.listen(config.port, () => {
    console.log(`Listening on port ${config.port}...`)
});