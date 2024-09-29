var express = require('express');
var router = express.Router();
var db = require('../models/db_controller');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var session = require('express-session');
var sweetalert2 = require('sweetalert2');
const { check, validationResult } = require('express-validator');

// 
var con = mysql.createConnection({ 
    host: 'localhost',
    user: 'root',
    password: 'root123',
    database: 'hms'
});

// Use session middleware
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());


router.post('/', [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required')  
], function(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    var username = req.body.username; // Get username from request body
    var password = req.body.password; // Get password from request body

    if (username && password) {
        con.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password],
            function(error, results) {
                if (error) {
                    return res.status(500).send("Database query error");
                }

                if (results.length > 0) {
                    req.session.loggedIn = true;
                    req.session.username = username;

                    // set up cookie-parser
                    res.cookie('username', username);
                    var status = results[0].email_status;
                    
                    if (status === "not_verified") {
                        res.send("Please verify your email");
                    } else {
                        sweetalert2.fire('Logged in');
                        res.redirect('/home');
                    }
                } else {
                    res.send("Incorrect Username/password");
                }res.end();
            }
        )
    } else {
        res.send("please enter your username and password");
        res.end();
    }
});

// Export the router
module.exports = router;
