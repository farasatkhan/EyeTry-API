var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

require('./src/api/v1/services/database');

var AuthRouter = require('./src/api/v1/routes/auth');
var AdminAuthRouter = require('./src/api/v1/routes/adminAuth');

var UsersRouter = require('./src/api/v1/routes/users');
var AdminRouter = require('./src/api/v1/routes/admin');
var ProductRouter = require('./src/api/v1/routes/products');

var GlassesRouter = require('./src/api/v1/routes/Products/Glasses');
var CategoryRouter = require('./src/api/v1/routes/Products/Category');
var FAQRouter = require('./src/api/v1/routes/FAQ/FAQ');
var ReviewsRouter = require('./src/api/v1/routes/Products/Reviews');
var OrderRouter = require('./src/api/v1/routes/order');
var paymentRouter = require('./src/api/v1/routes/payment');

var AgentAuthRouter = require('./src/api/v1/routes/agentAuth')
var AgentRouter = require('./src/api/v1/routes/supportAgent')
var TicketRouter = require('./src/api/v1/routes/tickets')

var AgentAuthRouter = require('./src/api/v1/routes/agentAuth')
var AgentRouter = require('./src/api/v1/routes/supportAgent')
var TicketRouter = require('./src/api/v1/routes/tickets')
var ChatRouter = require('./src/api/v1/routes/chat')
var MessageRouter = require('./src/api/v1/routes/message')
/*
    The goal of the test router is to facilite the testing of other routes.
*/
var testProductRouter = require('./test/routes/products');
var testVisionAssessmentRouter = require('./test/routes/VisionAssessment');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'np')));

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:5001', 'http://127.0.0.1:3000', 'http://127.0.0.1:5001', 'http://127.0.0.1:5000','http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'PUT', 'POST', 'DELETE'],
  allowedHeaders: ['Authorization', 'Content-Type', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials']
}));

app.use('/auth', AuthRouter);
app.use('/admin/auth', AdminAuthRouter);
app.use('/users', UsersRouter);
app.use('/admin', AdminRouter);
app.use('/products/', ProductRouter)
app.use('/payment/', paymentRouter)

app.use('/products/v1/glasses', GlassesRouter);
app.use('/products/v1/category', CategoryRouter);
app.use('/v1/faq', FAQRouter);
app.use('/products/v1/reviews', ReviewsRouter);
app.use('/products/v1/order', OrderRouter);

// Support Tickets
app.use('/support', TicketRouter)

// Customer Support 
app.use('/agent/auth', AgentAuthRouter)
app.use('/agent', AgentRouter)

// Chats 
app.use('/chat',ChatRouter)
app.use('/message',MessageRouter)

/*
    The goal of the test router is to facilite the testing of other routes.
*/
app.use('/test/product', testProductRouter);
app.use('/test/vision_assessment', testVisionAssessmentRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
