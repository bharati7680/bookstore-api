const knex = require("../../config/knex");
const Razorpay = require("razorpay");

async function initOrder(req, res) {
  let books = req.body.books;
  //    console.log(books)

  let bookIds = [];
  books.forEach((book) => {
    bookIds.push(book.book_id);
  });
  const existingBooks = await knex("books").whereIn("id", bookIds);

  if (bookIds.length !== existingBooks.length) {
    res.send({
      message: "Invalid book Id",
    });
    return;
  }

  let totalPrice = 0;

  existingBooks.forEach((book) => {
    let data = books.find((b) => b.book_id === book.id);
    totalPrice += book.price * data.quantity;
  });

  let order = {
    order_id: "order_" + new Date().getTime(),
    user_id: req.user.id,
    total_price: totalPrice,
    status: "INITIALIZE",
  };

  await knex("orders").insert(order);

  let orderBookMapping = [];
  existingBooks.forEach((book) => {
    let data = books.find((b) => b.book_id === book.id);
    let obj = {
      order_id: order.order_id,
      book_id: book.id,
      quantity: data.quantity,
      single_book_price: book.price,
    };

    orderBookMapping.push(obj);
  });

  await knex("order_book_mapping").insert(orderBookMapping);

  var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET
  })

  const expiredTime = Math.floor(Date.now() / 1000) + (16 * 60);


  var options = {
    amount: totalPrice*100,  // amount in the smallest currency unit
    currency: "INR",
    description: "payment for book",
    notes: {
        order_id: order.order_id
    },
    customer: {
        name: "bharati",
        email: "bharatidfk@gmail.com",
        contact: "1235678945"
    },
    expire_by: expiredTime,
    callback_url: "http://localhost:3000/my_orders"
  };
  instance.paymentLink.create(options, function(err, rz_order) {
    console.log(err);
    if(err) {
        return res.send({message: "failed to create order"})
    } 
    res.send({
        message:"order created successfully",
        data: {
            paymentLink: rz_order.short_url
        }
    })
    console.log(order);
  });

//   res.send({
//     order,
//     orderBookMapping,
//   });
}


async function getOrderList(req, res) {
    const userId = req.user.id

    let orders = await knex.raw(`
        select 
            JSON_OBJECT(
                "order_id", orders.order_id,
                "total_price", orders.total_price,
                "status", orders.status,
                "books", JSON_ARRAYAGG(
                    JSON_OBJECT(
                        "book_id", order_book_mapping.book_id,
                        "quantity", order_book_mapping.quantity,
                        "price", order_book_mapping.single_book_price,
                        "name", books.name,
                        "image", books.img_url
                    )
                )
            ) as order_details
        from users 
        join orders on orders.user_id = users.user_id
        join order_book_mapping on order_book_mapping.order_id = orders.order_id
        join books on books.id = order_book_mapping.book_id 
        where users.user_id = ${userId}
        group by orders.order_id;
    `)

    orders = orders[0]

    let newOrders = []

    orders.forEach((order) => {
      newOrders.push(JSON.parse(order.order_details))
    })

    res.send({
        message: "successful",
        data: {
            newOrders
        }
    })
}

module.exports = {
  initOrder,
  getOrderList
};
