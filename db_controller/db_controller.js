var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var con = mysql.createConnection({ 
    host:'localhost',
    user: 'root',
    password: 'root123',
    database: 'hms'
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the database!");
});
