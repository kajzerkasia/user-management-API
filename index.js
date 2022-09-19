const express = require('express');
require('express-async-errors');
require('dotenv').config()

const methodOverride = require('method-override');
const {engine} = require('express-handlebars');
const cookieParser = require('cookie-parser');

const {apiRouter} = require("./routers/api");
const {homeRouter} = require("./routers/home");

const {handleError} = require("./utils/errors");

const app = express();

app.use(cookieParser());

app.use(methodOverride('_method'));

app.use(express.urlencoded({
    extended: true,
}));

app.use(express.static('public'))
app.use(express.json())

app.engine('.hbs', engine({
    extname: '.hbs',
}));

app.set('view engine', '.hbs');

app.use('/', homeRouter);
app.use('/api', apiRouter);

app.use(handleError)

app.listen(3000, 'localhost', () => {
    console.log('Listening on http://localhost:3000')
});