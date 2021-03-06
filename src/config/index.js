/*
    Requirements
*/

require('dotenv').config();

/*
    Environment variable destructuring
*/

/*
    If express-session chosen for use with csurf middleware,
    session environment variables are expected in app.js &
    the default SESSION_SECRET should be changed in .env.
*/

const {
    PROJECT_NAME = '',
    NODE_ENV = 'development',
    SERVER_MULTIPLIER = 1,
    SERVER_PORT = 3000,
    //SESSION_NAME = 'session',
    //SESSION_SECRET, //NOTE: default value should be changed in .env
    //SESSION_MAXAGE = 3600000, //1000 * 60 * 60 = 1 hour
    LOG_FORMAT = 'discreet',
    LOG_PATH = 'logs/server.log',
    CACHE_HOST,
    CACHE_PORT,
    DB_DEV_USER,
    DB_DEV_PASS, //NOTE: default value could be changed in .env
    DB_DEV_HOST,
    DB_DEV_PORT,
    DB_DEV_NAME,
    DB_PROD_USER,
    DB_PROD_PASS, //NOTE: default value should be changed in .env
    DB_PROD_HOST,
    DB_PROD_PORT,
    DB_PROD_NAME
} = process.env;

/*
    Exports
*/

const IN_PROD = NODE_ENV === 'production' ? true : false;

module.exports = {
    PRJ: {
        NAME: PROJECT_NAME
    },
    SVR: {
        IN_PROD,
        MULTIPLIER: SERVER_MULTIPLIER,
        PORT: SERVER_PORT
    },
    LOG: {
        FORMAT: LOG_FORMAT,
        PATH: LOG_PATH
    },
    /*
    SSN: {
        NAME: SESSION_NAME,
        SECRET: SESSION_SECRET,
        MAXAGE: SESSION_MAXAGE
    },
    */
    CCH: {
        HOST: CACHE_HOST,
        PORT: CACHE_PORT
    },
    DB: {
        USER: IN_PROD ? DB_PROD_USER : DB_DEV_USER,
        PASS: IN_PROD ? DB_PROD_PASS : DB_DEV_PASS,
        HOST: IN_PROD ? DB_PROD_HOST : DB_DEV_HOST,
        PORT: IN_PROD ? DB_PROD_PORT : DB_DEV_PORT,
        NAME: IN_PROD ? DB_PROD_NAME : DB_DEV_NAME
    }
};
