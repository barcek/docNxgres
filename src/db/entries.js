/*
    Requirements
*/

const path = require('path');

const { Table } = require(path.resolve(__dirname, './table.js'));

/*
    Table & CRUD instantiations
*/

const entriesTable = new Table('entries', [
    'id SERIAL PRIMARY KEY',
    'entry VARCHAR(128) NOT NULL'
]);

const entriesCRUD = entriesTable.generateCRUD(['entry']);

module.exports = { entriesCRUD };
