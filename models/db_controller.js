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

module.exports.signup = function(username, email, password, status, callback) {
    con.query('select email from users where email = "'+email+'"', function(err, result) {
        if(result[0]==undefined){
            var query = "insert into `users`(`username`, `email`, `password`, `email_status`) values ('"+username+"', '"+email+"', '"+password+"', '"+status+"')"
        }
        console.log(query);
        con.query(query, callback)
    })
}

module.exports.verify = function(username, email, token, callback) {
      var query = "insert into `users`(`username`, `email`, `token`, `email_status`) values ('"+username+"', '"+email+"', '"+token+"', 'verified')"
      con.query(query, callback)

}
module.exports.getuserid = function(email, callback) {
    var query = "select * from verify where email = '"+email+"'";
    con.query(query, callback)
}

    