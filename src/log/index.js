/*
    Requirements
*/

const path = require('path');
const fs = require('fs');

const morgan = require('morgan');

/*
    Assignments
*/

const logStream = fs.createWriteStream(
    path.resolve(__dirname, '../../logs/server.log'),
    { flags: 'a' }
);

const logger = morgan(
    ':date[web] :method :url :status :res[content-length] :response-time ms',
    { stream: logStream }
);

const addLogEntry = data => {
    logStream.write(`${(new Date).toUTCString()} ${data}\n`);
};

/*
    Exports
*/

module.exports = {
    logger,
    addLogEntry
};
