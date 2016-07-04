var path = process.cwd();
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 3000;
var passport = require('passport');
var morgan       = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session      = require('express-session');
var configDB = require('./config/database.js');


mongoose.connect(configDB.url, function(){
    console.log('database connected');
});

require('./config/passport.js')(passport);

app.use(bodyParser());
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser());

app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

app.use(express.static('./public'));
app.use(express.static('./views'));

var routes = require('./app/routes/index.js');
routes.init(app,passport);

app.listen(port, function(req,res){
    console.log("Listening on port " + port);
});
