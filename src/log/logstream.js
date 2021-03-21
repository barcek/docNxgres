/*
    Requirements
*/

const path = require('path');
const fs = require('fs');

const { LOG } = require(path.resolve(__dirname, '../config'));

/*
    Log stream creation
*/

const createLogStream = function(pathToLog) {
    return fs.createWriteStream(
        path.resolve(__dirname, `../../${pathToLog}`),
        { flags: 'a' }
    );
};

const logStream = createLogStream(LOG.PATH);

/*
    Exports
*/

module.exports = {
    createLogStream,
    logStream
};
