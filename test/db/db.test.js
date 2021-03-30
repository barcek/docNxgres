/*
     Requirements
*/

const path = require('path');

/*
    Test values
*/

const vals = {
    table: {
        name: 'table1',
        colNames: ['col1 SERIAL PRIMARY KEY', 'col2 VARCHAR(255)', 'col3 INT'],
        template: `CREATE TABLE IF NOT EXISTS table1 (col1 SERIAL PRIMARY KEY, col2 VARCHAR(255), col3 INT);`,
        response: { command: 'CREATE' }
    },
    crud: {
        colNames: ['col2', 'col3'],
        label: 'col2-col3',
        templates: {
            create: {
                text: 'INSERT INTO table1 (col2, col3) VALUES ($1, $2) RETURNING *;',
                expected: 2
            },
            readById: {
                text: 'SELECT * FROM table1 WHERE id = $1;',
                expected: 1
            },
            readAll: {
                text: 'SELECT * FROM table1;',
                expected: 0
            },
            update: {
                text: 'UPDATE table1 SET col2 = $1, col3 = $2 WHERE id = $3 RETURNING *;',
                expected: 3
            },
            deleteById: {
                text: 'DELETE FROM table1 WHERE id = $1;',
                expected: 1
            },
            deleteAll: {
                text: 'DELETE FROM table1;',
                expected: 0
            }
        },
        summaries: {
            create: "table1 col2-col3 'create' expects 2 value(s) for query 'INSERT INTO table1 (col2, col3) VALUES ($1, $2) RETURNING *;'",
            readById: "table1 col2-col3 'readById' expects 1 value(s) for query 'SELECT * FROM table1 WHERE id = $1;'",
            readAll: "table1 col2-col3 'readAll' expects 0 value(s) for query 'SELECT * FROM table1;'",
            update: "table1 col2-col3 'update' expects 3 value(s) for query 'UPDATE table1 SET col2 = $1, col3 = $2 WHERE id = $3 RETURNING *;'",
            deleteById: "table1 col2-col3 'deleteById' expects 1 value(s) for query 'DELETE FROM table1 WHERE id = $1;'",
            deleteAll: "table1 col2-col3 'deleteAll' expects 0 value(s) for query 'DELETE FROM table1;'"
        },
        summaryAll: "table1 col2-col3 'create' expects 2 value(s) for query 'INSERT INTO table1 (col2, col3) VALUES ($1, $2) RETURNING *;'\ntable1 col2-col3 'readById' expects 1 value(s) for query 'SELECT * FROM table1 WHERE id = $1;'\ntable1 col2-col3 'readAll' expects 0 value(s) for query 'SELECT * FROM table1;'\ntable1 col2-col3 'update' expects 3 value(s) for query 'UPDATE table1 SET col2 = $1, col3 = $2 WHERE id = $3 RETURNING *;'\ntable1 col2-col3 'deleteById' expects 1 value(s) for query 'DELETE FROM table1 WHERE id = $1;'\ntable1 col2-col3 'deleteAll' expects 0 value(s) for query 'DELETE FROM table1;'",
        values: {
            create: ['value1', '2'],
            readById: ['3'],
            readAll: [],
            update: ['value1', '2', '3'],
            deleteById: ['3'],
            deleteAll: []
        },
        errors: {
            below: "table1 col2-col3 'create' expects 2 value(s) for query 'INSERT INTO table1 (col2, col3) VALUES ($1, $2) RETURNING *;', but received 0",
            above: "table1 col2-col3 'create' expects 2 value(s) for query 'INSERT INTO table1 (col2, col3) VALUES ($1, $2) RETURNING *;', but received 3"
        },
        responses: {
            create: { command: 'INSERT' },
            readById: { command: 'SELECT' },
            readAll: { command: 'SELECT' },
            update: { command: 'UPDATE' },
            deleteById: { command: 'DELETE' },
            deleteAll: { command: 'DELETE' }
        }
    }
};

/*
    Stubs & mocks
*/

const poolTable = {
    query: (template) => {
        if (template === vals.table.template) {
            return vals.table.response;
        };
    }
};

const poolCRUD = {
    query: (object) => {
        if (Object.keys(vals.crud.templates).indexOf(object.name) !== -1
            && object.text === vals.crud.templates[object.name].text
            && object.values === vals.crud.values[object.name]) {
            return vals.crud.responses[object.name];
        };
    }
};

const CRUD = function(tableName, crudColNames) {
    if (tableName === vals.table.name && crudColNames === vals.crud.colNames) {
        this.label = crudColNames.join('-');
    };
};

/*
    Exports
*/

module.exports = {
    vals,
    poolTable,
    poolCRUD,
    CRUD
};
