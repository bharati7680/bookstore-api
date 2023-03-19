const express = require('express')
const router = express.Router()

const booksController = require('./book.controller')

router.get('/', booksController.getBookList)
router.get('/:isbn_13', booksController.getBookDetails)



module.exports = router;

//order - user_id, book_id, total_price
//order bookMapping -  order_id, book_id, quantity