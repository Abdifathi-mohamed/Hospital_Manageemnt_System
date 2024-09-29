var express = require('express');
var router = express.Router();
var db = require('../models/db_controller');
var bodyParser = require('body-parser');
var mysql = require('mysql');
var nodemailer = require("nodemailer");
var randomtoken = require('random-token');
const {check, validationResult} = require('express-validator');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/', [
    check('username').not().isEmpty().withMessage('Username is required'),
    check('email').isEmail().withMessage('Email is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], function (req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    var email_status = 'not_verified'
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var token = randomtoken(32);

    db.signup(req.body.username, req.body.email, req.body.password, email_status);
    var token = randomtoken(8);
    db.verify(req.body.username, email, token);

    db.getuserid(email, function(err, result){
        var id = result[0].id;
        var output = `<p>Dear ${username}, </p>
        <p>Thanks for the sign up. Your verification id and token is given below</p>:
        <ul>
         <li>User Id: ${id}</li>
         <li>Token: ${token}</li
        <p>verify link: <a href="http://localhost:3000/verify">Verify</p>
        <p><b>This is automatically generated mail</b></p>`;

        var transporter = nodemailer.createTransport({
            host:"smtp.gmail.com",
            port: 465,
            secure: true,
            auth:{
               user:"mohamedabdifathi@gmail.com",
               password:"Fatka123asd@"
            }
        });
        var mailOptions={
            from: "Hms@gmail.com",
            to: email,
            subject: "Email verification",
            html: output
        };
        transporter.sendMail(mailOptions, function(err, info){
            if(err){
                return console.log(err);
            }
            console.log(info);
        });
        res.send("check your email for token to verify")
    })
});

module.exports=router;

