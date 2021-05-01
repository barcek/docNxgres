/*
    Requirements
*/

const path = require('path');

const validator = require('validator');

const { entriesCRUD } = require(path.resolve(__dirname, '../db'));

/*
    Other values
*/

const successResult = {
    isError: false
};

const failureResult = {
    isError: true
};

/*
    Request handlers
*/

const create = async (entry) => {

    /* if entry absent, return error */

    if (!entry) {
        return Object.assign(failureResult, {
            string: `Error: invalid entry; not added to database.`
        });
    };

    /* if entry present & invalid length, return error */

    if (entry && !validator.isLength(entry, {min: 1, max: 128})) {
        return Object.assign(failureResult, {
            string: 'Entry should be from 1 to 128 characters in length.'
        });
    };

    /* otherwise sanitize, pass to 'create' query & return result */

    const escapedEntry = validator.escape(entry);
    try {
        const newEntry = await entriesCRUD.run('create', [escapedEntry]);
        const id = newEntry.rows[0].id;
        return Object.assign(successResult, {
            string: `Entry ${escapedEntry} added to database with id ${id}.`
        });

    } catch(err) {
        return Object.assign(failureResult, {
            string: `Error: entry ${entry} not added to database.`
        });
    };
};

const readAll = async () => {

    /* run 'readAll' query, generate string based on row count & return result */

    try {
        const allEntries = await entriesCRUD.run('readAll', []);
        if (allEntries.rows.length === 0) {
            return Object.assign(successResult, {
                string: `Database contains no entries.`
            });
        };
        const formattedRows = allEntries.rows.map((row) => `${row.id}: ${row.entry}`);
        return Object.assign(successResult, {
            string: `Database contains entries:\n\n${formattedRows.join('\n')}`
        });

    } catch(err) {
        return Object.assign(failureResult, {
            string: 'Error: could not read all entries from database.'
        });
    };
};

const deleteAll = async () => {

    /* run 'deleteAll' query, call 'readAll' for result & return result */

    try {
        await entriesCRUD.run('deleteAll', []);
        return await readAll();

    } catch(err) {
        return Object.assign(failureResult, {
            string: 'Error: could not delete entries from database.'
        });
    };
};

/*
    Exports
*/

module.exports = {
    create,
    readAll,
    deleteAll
};
