/*
    Requirements
*/

const path = require('path');
const fs = require('fs');

const morgan = require('morgan');

const { LOG } = require(path.resolve(__dirname, '../config'));

/*
    Logger setup
*/

const logFormat = {
    combined: 'combined',
    common: 'common',
    dev: 'dev',
    discreet: ':date[web] :method :url :status :res[content-length] :response-time ms',
    short: 'short',
    tiny: 'tiny'
}[LOG.FORMAT];

const logStream = fs.createWriteStream(
    path.resolve(__dirname, `../../logs/${LOG.FILENAME}`),
    { flags: 'a' }
);

const logger = morgan(logFormat, { stream: logStream });

/*
    Utility functions
*/

const addLogEntry = data => {
    logStream.write(`${(new Date).toUTCString()} ${data}\n`);
};

console.log(LOG.FILENAME, logStream.path);
addLogEntry('new filename test');

/*
    Exports
*/

module.exports = {
    logger,
    addLogEntry
};
