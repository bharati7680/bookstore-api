require('dotenv').config()
const app = require('./app')
// console.log(process.env)


function start() {


    app.listen(process.env.PORT, () => {
        console.log(`App listening on port ${process.env.PORT}`)
    })
}

start()