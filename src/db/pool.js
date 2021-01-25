/*
    Requirements
*/

const path = require('path');

const { Pool } = require('pg');

const { DB } = require(path.resolve(__dirname, '../config'));

/*
    Pool creation
*/

const dbURL = `postgresql://${DB.USER}:${DB.PASS}@${DB.HOST}:${DB.PORT}/${DB.NAME}`;

const pool = new Pool({
    connectionString: dbURL
});

/*
    Exports
*/

module.exports = { pool };
