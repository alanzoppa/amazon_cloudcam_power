var express = require('express');
var app = express();

import flip from './index.src';

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) {
    flip(req.query.state == "off");
    res.send('Dispatching Action');

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
