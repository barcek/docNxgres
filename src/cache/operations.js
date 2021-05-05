/*
    Requirements
*/

const path = require('path');
const { promisify } = require('util');

const { client } = require(path.resolve(__dirname, './client.js'));

/*
    Promisification
*/

const setAsync = promisify(client.set).bind(client);
const getAsync = promisify(client.get).bind(client);

/*
    Operations
*/

const setCachedValue = async (key, value) => {
    await setAsync(key, value);
};

const getCachedValue = async key => {
    return await getAsync(key);
};

/*
    Exports
*/

module.exports = {
    setCachedValue,
    getCachedValue
};
