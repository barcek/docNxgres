/*
    Requirements
*/

const path = require('path');

const assert = require('chai').assert;

const { vals, poolCRUD } = require(path.resolve(__dirname, './db.test.js'));
const { CRUD } = require(path.resolve(__dirname, '../../src/db/crud.js'));

/*
    Assertions
*/

describe('CRUD', () => {

    const CRUDInstanceResult = new CRUD(vals.table.name, vals.crud.colNames,
        poolCRUD);

    it('can be instantiated', () => {
        assert.instanceOf(CRUDInstanceResult, CRUD);
    });

    it('adds a string combining column names to the "label" property ' +
        '(for 2 test columns)', () => {
        const CRUDInstanceLabelResult = CRUDInstanceResult.label;
        assert.equal(CRUDInstanceLabelResult, vals.crud.label);
    });

    for (const [key, value] of Object.entries(vals.crud.templates)) {

        let crudTemplatesResult;

        it(`adds the "${key}" query string & value count to the "templates" property ` +
            '(for 2 test columns)', () => {
            crudTemplatesResult = CRUDInstanceResult.templates;
            assert.include(crudTemplatesResult[key], value);
        });
    };

    describe('.summarize()', () => {

        let crudSummarizeResult;

        for (const [key, value] of Object.entries(vals.crud.summaries)) {

            it(`returns a string summarizing the "${key}" operation ` +
                '(for 2 test columns)', () => {
                crudSummarizeResult = CRUDInstanceResult.summarize(key);
                assert.equal(crudSummarizeResult, value);
            });
        };
    });

    describe('.summarizeAll()', () => {

        it('returns a string containing each string summary, newline separated ' +
            '(for 2 test columns)', () => {
            const crudSummarizeAllResult = CRUDInstanceResult.summarizeAll();
            assert.equal(crudSummarizeAllResult, vals.crud.summaryAll);
        });
    });

    describe('.run()', () => {

        it('throws an error if passed an unexpected number of values ' +
            '(for "create" w/ 2 test columns)', () => {
            assert.throws(CRUDInstanceResult.run.bind(this, 'create',
                vals.crud.values.readAll), vals.crud.errors.below);
            assert.throws(CRUDInstanceResult.run.bind(this, 'create',
                vals.crud.values.update), vals.crud.errors.above);
        });

        let crudRunQueryResult;

        for (const [key, value] of Object.entries(vals.crud.responses)) {

            it(`passes the "${key}" operation object & returns a response object ` +
                '(w/ corr. "command" property value)', async () => {
                crudRunQueryResult = await CRUDInstanceResult.run(key,
                    vals.crud.values[key]);
                assert.include(crudRunQueryResult, value);
            });
        };
    });

});
