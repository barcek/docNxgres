/*
    Requirements
*/

const path = require('path');

const { logStream } = require(path.resolve(__dirname, './logstream.js'));

/*
    Utility functions
*/

const createLogUtils = (stream) => {
    return {
        addLogEntry: data => {
            stream.write(`${(new Date).toUTCString()} ${data}\n`);
        }
    };
};

const { addLogEntry } = createLogUtils(logStream);

/*
    Exports
*/

module.exports = {
    createLogUtils,
    addLogEntry
};
