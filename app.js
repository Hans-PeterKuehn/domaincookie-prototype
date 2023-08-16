var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

function cookieResponse(domain) {
  return (req, res, next) => {
    try {
      res.header("Set-Cookie", `foo=cross-origin-cookie; Expires=Mon, 17 Aug 2023 15:15:20 GMT; HttpOnly; Secure; SameSite=None`);
      res.header("Access-Control-Allow-Origin", domain);
      res.header("Access-Control-Allow-Credentials", "true")
      res.json({ ok: 200 });
    }catch (e) {
      next(e);
    }
  };
}
//https://ab48-89-1-211-91.ngrok-free.app

app.options("*", () => {
  res.header("Access-Control-Allow-Origin", "https://5409-80-187-122-184.ngrok-free.app");
  res.header("Access-Control-Allow-Credentials", "true")
  res.header("Access-Control-Allow-Methods","POST, GET, OPTIONS")
  res.sendStatus(204);
})

app.use('/', indexRouter);
app.use('/ngrok', cookieResponse("https://5409-80-187-122-184.ngrok-free.app"));
app.use('/local', cookieResponse("https://5409-80-187-122-184.ngrok-free.app"));

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
  console.log(err);
  res.render('error');
});

module.exports = app;
