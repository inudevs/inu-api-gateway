import createError from 'http-errors';
import express from 'express';
import expressAglio from 'express-aglio';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import router from './router';

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');

app.use('/', router);

expressAglio(app, {
	source: __dirname + '/docs/source/index.apib',
  output: __dirname + '/docs/dist/index.html',
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