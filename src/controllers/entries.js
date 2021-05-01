/*
    Requirements
*/

const path = require('path');

const { create, readAll, deleteAll } = require(path.resolve(__dirname, '../services'));

/*
    Request handlers
*/

const handleCreate = async (req, res) => {
    const entry = req.body.entry;
    const result = await create(entry);
    res.json({result});
};

const handleReadAll = async (req, res) => {
    const result = await readAll();
    res.json({result});
};

const handleDeleteAll = async (req, res) => {
    const result = await deleteAll();
    res.json({result});
};

/*
    Exports
*/

module.exports = {
    handleCreate,
    handleReadAll,
    handleDeleteAll
};
