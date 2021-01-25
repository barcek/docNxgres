/*
    Requirements
*/

const path = require('path');
const validator = require('validator');

const { entriesCRUD } = require(path.resolve(__dirname, '../db'));

/*
    Utility functions
*/

const resetResult = () => {
    return {
        string: 'Error: please try again.',
        isError: false
    };
};

/*
    Request handlers
*/

const handleCreate = async (req, res) => {
    result = resetResult();
    /* if entry present & invalid length, return error */
    if (req.body.entry && !validator.isLength(req.body.entry, {min: 1, max: 128})) {
        result.string = 'Entry should be from 1 to 128 characters in length.';
        result.isError = true;
    /* otherwise sanitize, pass to 'create' query & return result */
    } else if (req.body.entry) {
        const escapedEntry = validator.escape(req.body.entry);
        try {
            const newEntry = await entriesCRUD.run('create', [escapedEntry]);
            const id = newEntry.rows[0].id;
            result.string = `Entry ${escapedEntry} added to database with id ${id}.`;
        } catch(err) {
            result.string = `Error: entry ${req.body.entry} not added to database.`;
            result.isError = true;
        };
    };
    res.json({result});
};

const handleReadAll = async (req, res) => {
    /* run 'readAll' query, consider row count & return result */
    result = resetResult();
    try {
        const allEntries = await entriesCRUD.run('readAll', []);
        if (allEntries.rows.length > 0) {
            const formattedRows = allEntries.rows.map((row) => `${row.id}: ${row.entry}`);
            result.string = `Database contains entries:\n\n${formattedRows.join('\n')}`;
        } else {
            result.string = `Database contains no entries.`;
        };
    } catch(err) {
        result.string = 'Error: could not read all entries from database.';
        result.isError = true;
    };
    res.json({result});
};

const handleDeleteAll = async (req, res) => {
    /* run 'deleteAll' query, then call 'handleReadAll' */
    result = resetResult();
    try {
        await entriesCRUD.run('deleteAll', []);
    } catch(err) {
        result.string = 'Error: could not delete entries from database.';
        result.isError = true;
    };
    handleReadAll(req, res);
};

/*
    Exports
*/

module.exports = {
    handleCreate,
    handleReadAll,
    handleDeleteAll
};
