var express = require('express');
var router = express.Router();

const authCheck = require('./middleware/auth.middleware')
const bookRouter = require('./modules/book/book.route')
const authRouter = require('./modules/auth/auth.route');
const orderRouter = require('./modules/order/order.route')
const razorpayWebhook = require('./modules/webhooks/razorpay')


router.use('/book', bookRouter)
router.use('/auth', authRouter)
router.use('/order', authCheck, orderRouter)
router.use('/razorpay-webhook', razorpayWebhook)


module.exports = router; 

