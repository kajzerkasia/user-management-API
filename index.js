require('dotenv').config()
const express = require('express');
require('express-async-errors');
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
// app.get('/test', (req, res) => {
//     db.create({
//         name: 'Test123',
//         mail: 'a@b.c',
//     });
//     res.send('Ok');
    //
    // res.send(db.getOne("d638c13b-5121-413f-90c5-4f35595d56d9").name)
// })

app.use(handleError)

app.listen(3000, 'localhost', () => {
    console.log('Listening on http://localhost:3000')
});