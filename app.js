var express = require('express');
var app = express();

import flip from './flip';

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function (req, res) { 

    let privacyMode;

    if ( req.query.state == "on" ) {
        privacyMode = false;
    } else if (req.query.state == "off") {
        privacyMode = true;

    } else {
        res.status(500).send('Something broke!')
        return
    }

    flip(privacyMode);
    res.send('Dispatching Action');

})

app.listen(3000, () => console.log('Example app listening on port 3000!'))
