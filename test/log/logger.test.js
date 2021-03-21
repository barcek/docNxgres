/*
    Requirements
*/

const path = require('path');

const assert = require('chai').assert;

const { logger } = require(path.resolve(__dirname, '../../src/log/logger.js'));

/*
    Assertions
*/

describe('logger', () => {

    it('is a function', () => {
        assert.typeOf(logger, 'function');
    });
});
