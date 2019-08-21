'use strict';

let express = require('express');
let router = express.Router();

const sanitize = require('mongo-sanitize');

//This is how we specify routes
//user_login should be a JS file in the routes directory and loginFunc is the name of the function in the JS file
const ballot = require('./ballot');
router.post('/ballot', ballot.ballot);


router.post('*', (req, res, next) => {
    let vers = req.headers['x-ver'];
    console.log("Unspecified Route Post Req For version: " + vers + " req.path: " + req.path);
});

module.exports = router;
