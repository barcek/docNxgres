/*
    Requirements
*/

const path = require('path');

const redis = require('redis');

const { CCH } = require(path.resolve(__dirname, '../config'));

/*
    Client creation
*/

const cacheURL = `redis://${CCH.HOST}:${CCH.PORT}`;

const client = redis.createClient(cacheURL);

/*
    Exports
*/

module.exports = {
    client
};
