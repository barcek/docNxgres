/*
    Requirements
*/

const path = require('path');

const { commaSpaceJoin } = require(path.resolve(__dirname, '../utils'));
const { pool: defaultPool } = require(path.resolve(__dirname, './pool.js'));

/*
    Utility functions
*/

const buildVars = crudColNames => crudColNames.map((column, index) => `\$${index + 1}`);

const buildVarString = crudColNames => commaSpaceJoin(buildVars(crudColNames));

const buildPairString = crudColNames => {
    const pairedItems = [];
    crudColNames.forEach((column, index) => {
        pairedItems.push(`${column} = ${buildVars(crudColNames)[index]}`);
    });
    return commaSpaceJoin(pairedItems);
};

/*
    Constructor function
*/

function CRUD(tableName, crudColNames, pool=defaultPool) {

    /*
        class: CRUD

        tableName:    string, table in query set
        crudColNames: array of strings, columns in query set

        On instantiation, completes a query set, each an SQL
        string for a CRUD operation on table 'tableName' for
        the columns 'crudColNames'; also sets a .label
        attribute for Table instance use

        Exposes the .summarize and .summarizeAll methods to
        summarize a single CRUD operation or all operations

        Exposes the .run method to perform a CRUD operation

        cf. Table class (./table.js)
    */

    this.label = crudColNames.join('-');

    this.colString = commaSpaceJoin(crudColNames);
    this.varString = buildVarString(crudColNames);
    this.pairString = buildPairString(crudColNames);

    this.templates = {
        create: {
            text: `INSERT INTO ${tableName} (${this.colString}) VALUES (${this.varString}) RETURNING *;`,
            expected: crudColNames.length
        },
        readById: {
            text: `SELECT * FROM ${tableName} WHERE id = $1;`,
            expected: 1
        },
        readAll: {
            text: `SELECT * FROM ${tableName};`,
            expected: 0
        },
        update: {
            text: `UPDATE ${tableName} SET ${this.pairString} WHERE id = $${crudColNames.length + 1} RETURNING *;`,
            expected: crudColNames.length + 1
        },
        deleteById: {
            text: `DELETE FROM ${tableName} WHERE id = $1;`,
            expected: 1
        },
        deleteAll: {
            text: `DELETE FROM ${tableName};`,
            expected: 0
        }
    };

    this.summarize = operation => {
    /*
        Returns a string summarizing a single CRUD operation

        operation:   string, key on the .templates attribute
    */
        const expected = this.templates[operation].expected;
        const text = this.templates[operation].text;
        return `${tableName} ${this.label} '${operation}' expects ${expected} value(s) for query '${text}'`;
    };

    this.summarizeAll = () => {
    /*
        Returns a string summarizing all CRUD operations
    */
        const summaries = [];
        for (let key of Object.keys(this.templates)) {
            summaries.push(this.summarize(key));
        };
        return summaries.join('\n');
    };

    this.run = (operation, values=[]) => {
    /*
        Returns the response received when calling pool.query
        with values on the .templates attribute for a given
        operation and the corresponding set of parameters

        operation:   string, key on the .templates attribute
        values:      array of strings, parameters for query
    */
        if (this.templates[operation].expected != values.length) {
            throw new Error(`${this.summarize(operation)}, but received ${values.length}`)
        };
        return pool.query({
            name: operation,
            text: this.templates[operation].text,
            values: values
        });
    };
};

/*
    Exports
*/

module.exports = { CRUD };
