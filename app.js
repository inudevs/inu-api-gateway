const createError = require('http-errors');
const express = require('express');
const expressAglio = require('express-aglio');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const router = require('./router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

expressAglio(app, {
	source: __dirname + '/docs/source/index.apib',
  output: __dirname + '/docs/html/index.html',
  uri: '/',
  aglioOptions: {
    theme: 'cyborg',
  }
});

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
