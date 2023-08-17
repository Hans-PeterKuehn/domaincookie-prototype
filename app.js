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

function cookieResponse() {
    return (req, res, next) => {
        try {
            const referer = req.header("referer");
            if (referer.includes(otherSubdomain)) {
                res.header("Set-Cookie", `foo=cross-origin-cookie; HttpOnly; Secure; SameSite=None`);
                res.header("Access-Control-Allow-Origin", completeOtherDomain);
                res.header("Access-Control-Allow-Credentials", "true")
                res.json({ ok: 200 });
            }
        } catch (e) {
            next(e);
        }
    };
}

const otherSubdomain = "4bc2-80-187-122-184";
const completeOtherDomain = `https://${otherSubdomain}.ngrok-free.app`;
app.use((req, res, next) => {
    res.locals.otherDomain = completeOtherDomain;
    next();
})

app.options("*", (req, res, next) => {
    const referer = req.header("referer");
    if (referer.includes(otherSubdomain)) {
        res.header("Access-Control-Allow-Origin", completeOtherDomain);
        res.header("Access-Control-Allow-Credentials", "true")
        res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        res.header("Access-Control-Max-Age", 5)
        res.sendStatus(204);
    } else {
        next();
    }
})

app.use('/other', cookieResponse());
app.use('/local', (req, res, next) => {
    res.header("Set-Cookie", `foo=same-origin-cookie; HttpOnly; Secure; SameSite=None`);
    res.sendStatus(200);
});
app.get("/iframe", (req, res, next) => {
    res.render('iframe', { title: req.hostname });
});
app.use('/', indexRouter);


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
    console.log(err);
    res.render('error');
});

module.exports = app;
