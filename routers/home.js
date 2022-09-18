const express = require('express');

const homeRouter = express.Router();

homeRouter

    .get('/', (req, res) => {
        res.redirect('/login');
    })

    .get('/login', (req, res) => {
        res.render('login/login');
    })

module.exports = {
    homeRouter,
}