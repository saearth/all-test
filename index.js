const express = require('express')
const bcrypt = require('bcrypt')

const app = express()
const port = 3000
const users = []

app.use(express.json())

app.post('/register', (req, res) => {
    const user = {
        email: req.body.email,
        password: req.body.password
    }
    // Vailidate the email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(user.email)) {
        return res.status(400).json({
            message: 'Invalid email format'
        })
    }

    // Vailidate the email no duplicates
    const duplicate = users.find((u) => u.email === user.email)
    if (duplicate) {
        return res.status(409).json({
            message: 'Email already exists'
        })
    }
    // Hash the password
    bcrypt.hash(user.password, 10, (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err)
            return
        } else {
            user.password = hash
            users.push(user)
            return res.status(201).json({
                message: 'User created'
            })
        }
    })
})

app.post('/login', (req, res) => {
    const { email, password } = req.body
    const user = users.find((u) => u.email === email)
    if (!user) {
        return res.status(401).json({
            message: 'Invalid email or password'
        })
    }
    bcrypt.compare(password, user.password, (err, result) => {
        if (err) {
            console.error('Error comparing password:', err)
            return
        }
        if (result) {
            return res.status(200).json({
                message: 'Login successful'
            })
        } else {
            return res.status(401).json({
                message: 'Invalid email or password'
            })
        }
    })
})

app.get('/users', (req, res) => {
    res.json({
        users
    })
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})