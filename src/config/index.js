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
    PROJECT_NAME,
    NODE_ENV = 'development',
    SERVER_PORT = 3000,
    //SESSION_NAME = 'session',
    //SESSION_SECRET, //NOTE: default value should be changed in .env
    //SESSION_MAXAGE = 3600000, //1000 * 60 * 60 = 1 hour
    DATABASE_DEV_USER,
    DATABASE_DEV_PASS,
    DATABASE_DEV_HOST,
    DATABASE_DEV_PORT,
    DATABASE_DEV_NAME,
    DATABASE_PROD_USER,
    DATABASE_PROD_PASS,
    DATABASE_PROD_HOST,
    DATABASE_PROD_PORT,
    DATABASE_PROD_NAME
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
        PORT: SERVER_PORT
    },
    /*
    SSN: {
        NAME: SESSION_NAME,
        SECRET: SESSION_SECRET,
        MAXAGE: SESSION_MAXAGE
    },
    */
    DB: {
        USER: IN_PROD ? DATABASE_PROD_USER : DATABASE_DEV_USER,
        PASS: IN_PROD ? DATABASE_PROD_PASS : DATABASE_DEV_PASS,
        HOST: IN_PROD ? DATABASE_PROD_HOST : DATABASE_DEV_HOST,
        PORT: IN_PROD ? DATABASE_PROD_PORT : DATABASE_DEV_PORT,
        NAME: IN_PROD ? DATABASE_PROD_NAME : DATABASE_DEV_NAME
    }
};
