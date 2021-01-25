/*
    Requirements
*/

const router = require('express').Router();
const path = require('path');

const { PRJ } = require(path.resolve(__dirname, '../config'));

/*
    Endpoint & routes
*/

router.get('/', (req, res) => {
    res.render('index', {
        title: PRJ.NAME,
        name: PRJ.NAME,
        csrfToken: req.csrfToken()
    });
});

router.use('/entries', require(path.resolve(__dirname, './entries.js')));

router.use('/error', require(path.resolve(__dirname, './error.js')));

/*
    Exports
*/

module.exports = router;
