/*
    Requirements
*/

const path = require('path');
const fs = require('fs');

const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const pug = require('pug');

/*
    With csurf middleware, choice of express-session or
    cookie-parser; cookie-parser chosen & lines for SSN
    environment variables, express-session middleware &
    corresponding use of csurf middleware commented out.
*/

//const session = require('express-session');
const cookieParser = require('cookie-parser');
const csurf = require('csurf');

//const { SVR, SSN } = require(path.resolve(__dirname, './config'));
const { SVR } = require(path.resolve(__dirname, './config'));

/*
    Initialization
*/

const app = express();

/*
    Error handlers
*/

process.on("uncaughtException", (err) => {
    console.log(err);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
});

/*
    Middleware
*/

app.use(helmet());

/*
    For static file serving, choice of reverse proxy or
    express.static middleware; reverse proxy chosen &
    line for express.static commented out.
*/

//app.use(express.static(path.resolve(__dirname, 'public')));

const logStream = fs.createWriteStream(
    path.resolve(__dirname, '../logs/server.log'),
    { flags: 'a' }
);
app.use(morgan(
    ':date[web] :method :url :status :res[content-length] :response-time ms',
    { stream: logStream }
));

app.set('views', path.resolve(__dirname, 'views'));
app.set('view engine', 'pug');

/*
    For data transfer, choice of URI encoding or JSON;
    JSON chosen, line for URI encoding commented out
    & parseJSON, not parseURI, applied to routes.
*/

//const parseURI = express.urlencoded({extended: false});
const parseJSON = express.json();

/*
app.set('trust proxy', 1);
app.use(session({
    name: SSN.NAME,
    resave: false,
    saveUninitialized: false,
    secret: SSN.SECRET,
    cookie: {
        httpOnly: true,
        sameSite: true,
        secure: SVR.IN_PROD,
        maxAge: parseInt(SSN.MAXAGE)
    }
}));
*/
app.use(cookieParser());

//const csrfProtection = csurf();
const csrfProtection = csurf({
    cookie: {
        httpOnly: true,
        sameSite: true,
        secure: SVR.IN_PROD
    }
});

/*
    Routes & fallbacks
*/

app.use('/', parseJSON, csrfProtection, require(path.resolve(__dirname, './routes')));

app.use((req, res) => {
    res.status(404).redirect('/error/404');
});

app.use((req, res, err) => {
    res.status(err.status || 500).redirect('/error/internal');
});

/*
    Exports
*/

module.exports = app;
