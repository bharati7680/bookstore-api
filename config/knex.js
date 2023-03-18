const mysql = require('knex') ({
    client: 'mysql',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        timezone: "IST"
    },
    userNullAsDefault: true,
    acquireConnectionTimeout: 3000000,
})


mysql.raw("use "  +  process.env.DB_NAME).then(() =>{
    console.log("MySql Connected")
})
.catch((e) => {
    console.log("MySql not connected")
    console.log(e)
})


module.exports = mysql