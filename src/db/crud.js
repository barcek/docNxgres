/*
    Requirements
*/

const path = require('path');

const { commaSeparate } = require(path.resolve(__dirname, '../utils'));
const { pool } = require(path.resolve(__dirname, './pool.js'));

/*
    Utility functions
*/

const buildVars = columns => columns.map((column, index) => `\$${index + 1}`);

const buildVarString = columns => commaSeparate(buildVars(columns));

const buildPairString = columns => {
    const pairedItems = [];
    columns.forEach((column, index) => {
        pairedItems.push(`${column} = ${buildVars(columns)[index]}`);
    });
    return commaSeparate(pairedItems);
};

/*
    Constructor function
*/

function CRUD(table, columns) {

    this.colString = commaSeparate(columns);
    this.varString = buildVarString(columns);
    this.pairString = buildPairString(columns);

    this.templates = {
        create: `INSERT INTO ${table} (${this.colString}) VALUES (${this.varString}) RETURNING *;`,
        readById: `SELECT * FROM ${table} WHERE id = $1;`,
        readAll: `SELECT * FROM ${table};`,
        update: `UPDATE ${table} SET ${this.pairString} WHERE id = $${columns.length + 1} RETURNING *;`,
        deleteById: `DELETE FROM ${table} WHERE id = $1;`,
        deleteAll: `DELETE FROM ${table};`
    };

    this.run = function(operation, values) {
        return pool.query({
            name: operation,
            text: this.templates[operation],
            values: values
        });
    };
};

/*
    Exports
*/

module.exports = { CRUD };
