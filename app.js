require('dotenv').config()
const express  = require('express');
const app      = express();
const PORT     = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const mongoose = require('mongoose');
const index = require('./routes');
const cors = require('cors')

mongoose.connect(process.env.DB_URI + '_' + NODE_ENV, {useNewUrlParser: true});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

app.use('/', index)

app.listen(PORT , () => {
    console.log(`STARTING at ${PORT}`);
})

module.exports = app;