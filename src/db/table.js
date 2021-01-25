/*
    Requirements
*/

const path = require('path');

const { commaSeparate } = require(path.resolve(__dirname, '../utils'));
const { pool } = require(path.resolve(__dirname, './pool.js'));
const { CRUD } = require(path.resolve(__dirname, './crud.js'));

/*
    Constructor function
*/

function Table(name, tableColumns) {

    this.tableColString = commaSeparate(tableColumns);
    this.template = `CREATE TABLE IF NOT EXISTS ${name} (${this.tableColString});`;

    (async function(template) {
        await pool.query(template);
    })(this.template)

    this.generateCRUD = function(queryColumns) {
        return new CRUD(name, queryColumns);
    };
};

/*
    Exports
*/

module.exports = { Table };
