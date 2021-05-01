/*
    Requirements
*/

const path = require('path');

const { create, readAll, deleteAll } = require(path.resolve(__dirname, './entries.js'));

/*
    Exports
*/

module.exports = {
    create,
    readAll,
    deleteAll
};
