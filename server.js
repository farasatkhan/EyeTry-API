var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

require('./src/api/v1/services/database');

var AuthRouter = require('./src/api/v1/routes/auth');
var AdminAuthRouter = require('./src/api/v1/routes/adminAuth');

var usersRouter = require('./src/api/v1/routes/users');
var AdminRouter = require('./src/api/v1/routes/admin');

/*
    The goal of the test router is to facilite the testing of other routes.
*/
var testProductRouter = require('./test/routes/products');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));

app.use('/auth', AuthRouter);
app.use('/admin/auth', AdminAuthRouter);
app.use('/users', usersRouter);
app.use('/admin', AdminRouter);

/*
    The goal of the test router is to facilite the testing of other routes.
*/
app.use('/product', testProductRouter);

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
