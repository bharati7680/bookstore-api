const express = require('express')
const app = express()
const indexRouter = require('./route')


app.use(express.json())
app.use('/api', indexRouter)


module.exports = app;