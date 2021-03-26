/*
    Requirements
*/

const path = require('path');

const assert = require('chai').assert;

const { vals } = require(path.resolve(__dirname, './utils.test.js'));
const { commaSpaceJoin } = require(path.resolve(__dirname, '../../src/utils/format.js'));

/*
    Assertions
*/

describe('commaSpaceJoin', () => {

    it('is a function', () => {
        assert.typeOf(commaSpaceJoin, 'function');
    });

    const commaSpaceJoinOneResult = commaSpaceJoin(vals.commaSpaceJoin.input.one);

    it('returns the item at index 0 if passed an array of length 1', () => {
        assert.equal(commaSpaceJoinOneResult, vals.commaSpaceJoin.output.one);
    });

    const commaSpaceJoinManyResult = commaSpaceJoin(vals.commaSpaceJoin.input.many);

    it('returns all items joined with a comma & space if passed an array of length 2+', () => {
        assert.equal(commaSpaceJoinManyResult, vals.commaSpaceJoin.output.many);
    });
});
