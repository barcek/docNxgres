/*
    Requirements
*/

const router = require('express').Router();
const path = require('path');

const entries = require(path.resolve(__dirname, '../controllers/entries.js'));

/*
    Endpoints
*/

router.post('/', (req, res) => {
    entries.handleCreate(req, res);
});

router.get('/', (req, res) => {
    entries.handleReadAll(req, res);
});

router.delete('/', (req, res) => {
    entries.handleDeleteAll(req, res);
});

/*
    Exports
*/

module.exports = router;
