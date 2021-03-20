/*
    Requirements
*/

const path = require('path');
const fs = require('fs');

const { LOG } = require(path.resolve(__dirname, '../config'));

/*
    Log stream creation
*/

const logStream = fs.createWriteStream(
    path.resolve(__dirname, `../../logs/${LOG.FILENAME}`),
    { flags: 'a' }
);

/*
    Exports
*/

module.exports = {
    logStream
};
