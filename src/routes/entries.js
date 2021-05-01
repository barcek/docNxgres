/*
    Requirements
*/

const router = require('express').Router();
const path = require('path');

const entries = require(path.resolve(__dirname, '../controllers'));

/*
    Endpoints
*/

router.post('/', async (req, res) => {
    await entries.handleCreate(req, res);
});

router.get('/', async (req, res) => {
    await entries.handleReadAll(req, res);
});

router.delete('/', async (req, res) => {
    await entries.handleDeleteAll(req, res);
});

/*
    Exports
*/

module.exports = router;
