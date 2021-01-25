/*
    Requirements
*/

const router = require('express').Router();
const path = require('path');

const { PRJ } = require(path.resolve(__dirname, '../config'));

/*
    Endpoints
*/

router.get('/', (req, res) => {
    res.redirect('../');
});

router.get('/404', (req, res) => {
    res.render('error', {
        title: '404: Not Found',
        name: PRJ.NAME
    });
});

router.get('/500', (req, res) => {
    res.render('error', {
        title: '500: Internal Server Error',
        name: PRJ.NAME
    });
});

/*
    Exports
*/

module.exports = router;
