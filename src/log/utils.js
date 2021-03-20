/*
    Requirements
*/

const path = require('path');

const { logStream } = require(path.resolve(__dirname, './logstream.js'));

/*
    Utility functions
*/

const addLogEntry = data => {
    logStream.write(`${(new Date).toUTCString()} ${data}\n`);
};

/*
    Exports
*/

module.exports = {
    addLogEntry
};
