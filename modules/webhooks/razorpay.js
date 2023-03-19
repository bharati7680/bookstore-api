const Razorpay = require('razorpay')
const knex = require('../../config/knex')

async function razorpayWebhook(req, res) {

    let body = req.body;
    let received_signature = req.headers["x-razorpay-signature"];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET

    var isValid = Razorpay.validateWebhookSignature(
      JSON.stringify(body),
      received_signature,
      secret
    );

    if (!isValid) {
        console.log("Invalid signature");
        res.json({status: 'ok'})
        return
    }

    let orderId = body.payload.payment.entity.notes.order_id

    await knex("orders").update({status: "CONFIRMED"}).where("order_id", orderId);

    console.log(orderId);

    res.json()
}


module.exports = razorpayWebhook