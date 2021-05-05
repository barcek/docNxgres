/*
    Requirements
*/

const path = require('path');

const { setCachedValue, getCachedValue } = require(path.resolve(__dirname, './operations.js'));

/*
    Exports
*/

module.exports = {
    setCachedValue,
    getCachedValue
};
