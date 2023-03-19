const knex = require('../../config/knex')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')





async function signUp(req, res) {

    // const first_name = req.body.first_name
    // const last_name = req.body.last_name
    // const contact = req.body.contact
    // const email = req.body.email
    // const password = req.body.password

    const {first_name, last_name, contact, email, password} = req.body

    let user = await knex('users').where('email', email).first()

    if(user){
        res.send({
            Error: true,
            Message:"Email already exists"
        })
        return
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    let newUser = {
        first_name,
        last_name,
        contact,
        email,
        password: hashedPassword
    }


    await knex('users').insert(newUser)

    res.send({
        Error: false,
        Message: "Account created successfully"
    })

}

async function login(req, res) {
    
    const email = req.body.email
    const password = req.body.password

    const user = await knex('users').select("*").where('email', email).first()

    if(!user) {
        res.send({
            Error: true,
            Message: "Invalid email or password"
        })

        return

    }

    let matched = await bcrypt.compare(password, user.password)

    if(!matched) {
        res.send({
            Error: true,
            Message: "Invalid email or password"
        })
        return
    }

    // Generate JWT
    const userJwt = jwt.sign(

        {
            id: user.user_id,
            email: user.email
        },
        process.env.JWT_KEY,
        {expiresIn: process.env.JWT_EXPIRY_TIME}

    )
    res.send({
        token: userJwt
    })

}



module.exports = {
    signUp,
    login
}
