require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const startingPointRouter = require('../startingPoint/startingPoint-router')
const monstersRouter = require('../monsterCard/monsters-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
    ? 'tiny'
    : 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())

app.use('/api/monsterStartingPoint', startingPointRouter)
app.use('/api/monsters', monstersRouter)
//app.use('/api/monsterAttacks',)
//app.use('/api/monsterSkills',)
//app.use('/api/monsterSpells',)

app.get('/', (req, res) => {
    res.send('Hello, World!')
})

app.get('/xss', (req, res) => {
    res.cookie('secretToken', '1234567890');
    res.sendfile(_dirname + '/xss-example.htlm');
})

app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = {error: {message: 'server error'}}
    } else {
        console.error(error)
        response = {message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app

