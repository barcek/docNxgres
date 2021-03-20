/*
    Requirements
*/

const path = require('path');

const morgan = require('morgan');

const { LOG } = require(path.resolve(__dirname, '../config'));
const { logStream } = require(path.resolve(__dirname, './logstream.js'));

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

const logger = morgan(logFormat, { stream: logStream });

/*
    Exports
*/

module.exports = {
    logger
};
