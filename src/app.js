// imports
const createError   = require('http-errors');
const express       = require('express');
const path          = require('path');
const cookieParser  = require('cookie-parser');
const morgan        = require('morgan');
const multer        = require('multer');
const session       = require('express-session');
const validator     = require('express-validator');
const passport      = require('passport');
const localStratg   = require('passport-local').Strategy;
const mysql		      = require('mysql');
const myConn	      = require('express-myconnection');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

//app.use(multer({"dest": "./uploads"}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// mysql
app.use(myConn(mysql, {
  host: 'localhost'
, user: 'root'
, password: '123'
, port: 3306
, database: 'crud-nodejs'
}, 'single')); // ??

// sessions
app.use(session({
  secret: "secret",
  saveUninitialized: true, 
  resave: true
}));

// Passport
app.use(passport.initialize());
app.use(passport.session()); 


// validator
// In this example, the formParam value is going to get morphed into form body format useful for printing.
app.use(validator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

//flash notification rendering
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

//routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
