/*
    Requirements
*/

const path = require('path');

const assert = require('chai').assert;

const { vals, poolTable, CRUD } = require(path.resolve(__dirname, './db.test.js'));
const { Table } = require(path.resolve(__dirname, '../src/db/table.js'));

/*
    Assertions
*/

describe('Table', () => {

    const TableInstanceResult = new Table(vals.table.name, vals.table.colNames,
        poolTable, CRUD);

    it('can be instantiated', () => {
        assert.instanceOf(TableInstanceResult, Table);
    });

    it('adds a table creation query string to the "template" property ' +
        '(for 3 test columns)', () => {
        const tableTemplateResult = TableInstanceResult.template;
        assert.equal(tableTemplateResult, vals.table.template);
    });

    describe('.createTable()', () => {

        it('passes the "template" property value & returns a response object ' +
            '(w/ corr. "command" property value)', async () => {
            const tableCreationResult = await
                TableInstanceResult.createTable(vals.table.template, poolTable);
            assert.include(tableCreationResult, vals.table.response);
        });

        it('adds a db response object to the "response" property', async () => {
            const tableResponseResult = await TableInstanceResult.response;
            assert.include(tableResponseResult, vals.table.response);
        });
    });

    describe('.generateCRUD()', () => {

        const CRUDInstanceResult =
            TableInstanceResult.generateCRUD(vals.crud.colNames, CRUD);

        it('passes column names (for 2 test columns) & returns a CRUD instance ' +
            '(w/ corr. "label" property value)', () => {
            const CRUDInstanceLabelResult = CRUDInstanceResult.label;
            assert.equal(CRUDInstanceLabelResult, vals.crud.label);
        });

        it('adds a CRUD instance to the table "cruds" property ' +
            'by instance "label" property value', () => {
            const crudsPropertyResult = TableInstanceResult.cruds[vals.crud.label];
            assert.typeOf(crudsPropertyResult, 'object');
        });
    });
});
