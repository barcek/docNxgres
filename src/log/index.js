/*
    Requirements
*/

const path = require('path');
const fs = require('fs');

const morgan = require('morgan');

const { logger } = require(path.resolve(__dirname, './logger.js'));
const { addLogEntry } = require(path.resolve(__dirname, './utils.js'));

/*
    Exports
*/

module.exports = {
    logger,
    addLogEntry
};
