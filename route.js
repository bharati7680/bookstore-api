var express = require('express');
var router = express.Router();

const authCheck = require('./middleware/auth.middleware')
const bookRouter = require('./modules/book/book.route')
const authRouter = require('./modules/auth/auth.route');
const orderRouter = require('./modules/order/order.route')


router.use('/book', bookRouter)
router.use('/auth', authRouter)
router.use('/initorder', authCheck, orderRouter)


module.exports = router; 

