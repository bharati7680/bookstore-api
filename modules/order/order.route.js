const express = require('express')
const router = express.Router()


const {initOrder, getOrderList} = require('./order.controller' )



router.post('/initOrder', initOrder)
router.get('/myorders', getOrderList)


module.exports = router;