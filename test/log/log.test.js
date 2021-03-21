/*
    Requirements
*/

const path = require('path');

/*
    Utility functions
*/

function* counter(start, step) {
    let count = start;
    while (true) {
        yield count;
        count += step;
    };
};

/*
    Test values
*/

const vals = {
    log: {
        path: 'test/log/',
        name: 'log',
        entry: 'log entry'
    }
};

const posInts = counter(1, 1);

/*
    Exports
*/

module.exports = {
    vals,
    posInts
};
