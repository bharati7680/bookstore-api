const knex = require('../../config/knex')
// const { validatoinResult } = require('')

async function getBookList(req, res) {

    const page = req.query.page || 1
    const limit = req.query.limit || 5
    const offset = (page - 1) * limit

    const books = await knex('books')
        .select(
            'books.id',
            'books.name',
            'books.price',
            'books.author',
            'books.publisher',
            'books.isbn_13',
            'books.language',
            'books.img_url',
            'books.status'
        )
        .orderBy('id', 'asc')
        .limit(limit)
        .offset(offset)
        
        // const book = JSON.parse(JSON.stringify(books))

    
        console.log(books);

        const totalBooks = await knex('books').count('id as count').first()
            
        const totalPages = Math.ceil(totalBooks.count / limit)



        return res.status(200).json({books, page, limit, totalPages, total_Books: totalBooks.count})
}


async function getBookDetails(req, res) {

    const isbn_13 = req.params.isbn_13

        const bookDetails = await knex('books').where('isbn_13', isbn_13).first()
        console.log(bookDetails)
        
        return res.send(bookDetails)

}


module.exports = {
    getBookList,
    getBookDetails
}