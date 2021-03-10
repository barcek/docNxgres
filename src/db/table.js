/*
    Requirements
*/

const path = require('path');

const { commaSeparate } = require(path.resolve(__dirname, '../utils'));
const { pool: defaultPool } = require(path.resolve(__dirname, './pool.js'));
const { CRUD: defaultCRUD } = require(path.resolve(__dirname, './crud.js'));

/*
    Constructor function
*/

function Table(tableName, tableColNames, pool=defaultPool, CRUD=defaultCRUD) {

    this.createTable = async (template) => {
        const response = await pool.query(template);
        return response;
    };

    this.template = `CREATE TABLE IF NOT EXISTS ${tableName} (${commaSeparate(tableColNames)});`;
    this.response = this.createTable(this.template);
    this.cruds = {};

    this.generateCRUD = (crudColNames) => {
        const crud = new CRUD(tableName, crudColNames);
        this.cruds[crud.label] = crud;
        return crud;
    };
};

/*
    Exports
*/

module.exports = { Table };
