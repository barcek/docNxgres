/*
    Requirements
*/

const path = require('path');

const { handleCreate, handleReadAll, handleDeleteAll } = require(path.resolve(__dirname, './entries.js'));

/*
    Exports
*/

module.exports = {
    handleCreate,
    handleReadAll,
    handleDeleteAll
};
