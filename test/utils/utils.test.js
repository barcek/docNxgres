/*
    Test values
*/

const vals = {
    commaSpaceJoin: {
        input: {
            one: ['item 1'],
            many: ['item 1', 'item 2', 'item 3']
        },
        output: {
            one: 'item 1',
            many: 'item 1, item 2, item 3'
        }
    }
};

/*
    Exports
*/

module.exports = {
    vals
};
