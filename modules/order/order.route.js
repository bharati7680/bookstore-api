const express = require('express')
const router = express.Router()


const {initOrder} = require('./order.controller' )


router.post('/', initOrder)


module.exports = router;