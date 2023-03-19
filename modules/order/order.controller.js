const knex = require('../../config/knex')


async function  initOrder(req, res) {
        
   let books = req.body.books
//    console.log(books)

    let bookIds = []
    books.forEach((book) => {
        bookIds.push(book.book_id)
    });
    const existingBooks = await knex('books').whereIn('id', bookIds)

    if(bookIds.length !== existingBooks.length) {
        res.send({
            message: "Invalid book Id"
        })
        return
    }

    let totalPrice = 0

    existingBooks.forEach((book) => {
       let data = books.find((b) => b.book_id === book.id)
       totalPrice += book.price * data.quantity
    })

    let order = {
        order_id : "order_" + new Date().getTime(),
        user_id: req.user.id,
        total_price: totalPrice,
        status: "INITIALIZE"
    }

    await knex('orders').insert(order)

    let orderBookMapping = []
    existingBooks.forEach((book) => {
        let data = books.find((b) => b.book_id === book.id)
        let obj = {
            order_id: order.order_id,
            book_id: book.id,
            quantity: data.quantity,
            single_book_price: book.price
        }

        orderBookMapping.push(obj)
     })

     await knex('order_book_mapping').insert(orderBookMapping)

    res.send({
        order,
        orderBookMapping

    })
   
   
        
}

module.exports = {
    initOrder
}
