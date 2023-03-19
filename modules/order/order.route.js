const express = require('express')
const router = express.Router()


const {initOrder, getOrderList} = require('./order.controller' )



router.post('/initorder', initOrder)
router.get('/order-list', getOrderList)


module.exports = router;