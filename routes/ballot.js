'use strict';

const ballot_model_path = require('../models/ballot');
const ballot = ballot_model_path.ballot;

const comFun = require('../common_functions');

module.exports.ballot = function (req, res, next) {

    console.log("Inside ballot function");
    //REM: NOT To print the req body as it contains password

    ballot.find({}, function (err, docs) {

        if(err){
            console.log("Error getting the ballot: ", err);
            res.json({success: -1, message: "Error getting the ballot"});
            return next();
        } else {
            console.log("Success!");
            res.json({success: 1, message: "Success!", ballot: docs});
            return next();
        }

    });

};
