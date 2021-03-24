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
        const expected = this.templates[operation].expected;
        const text = this.templates[operation].text;
        return `${tableName} ${this.label} '${operation}' expects ${expected} value(s) for query '${text}'`;
    };

    this.summarizeAll = () => {
        const summaries = [];
        for (let key of Object.keys(this.templates)) {
            summaries.push(this.summarize(key));
        };
        return summaries.join('\n');
    };

    this.run = (operation, values=[]) => {
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
