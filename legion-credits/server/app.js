const express = require('express');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
// const crypto = require('crypto')
// const Credits = require('./models').Credits
require('dotenv').load()

mongoose.connect(`mongodb://${process.env.DBUSER}:${process.env.DBPASSWORD}@ds155150.mlab.com:55150/legionizer`)
const db = mongoose.connection
const app = express();

const creditsSchema = mongoose.Schema({
    id: String,
    cards: [{ title: String, names: [String] }]
})

const Credits = mongoose.model('Credits', creditsSchema)

// Setup logger
app.use(morgan(':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'));

// Setup bodyParser
app.use(bodyParser.json())


// Serve static assets
app.use(express.static(path.resolve(__dirname, '..', 'build')));

app.get('/credits/:id', (req, res) => {
    Credits.findOne({ id: req.params.id }, 'cards', (err, credits) => {
        if (err) return err.message
        console.log(credits)
        res.end(JSON.stringify(credits))
    })
})

app.post('/credits', (req, res) => {
    // const hash = crypto.randomBytes(20).toString('hex')
    const credits = new Credits({id: req.body.id, cards: req.body.cards })
    credits.save()
    console.log(req.body)
    res.end('logged the post')
})

// Always return the main index.html, so react-router render the route in the client
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'build', 'index.html'));
});

module.exports = app;