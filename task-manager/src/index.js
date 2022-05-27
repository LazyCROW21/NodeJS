const express = require('express')
require('./db/mongoose')
const User = require('./models/user')

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())

app.post('/users', (req, res) => {
    const u1 = new User(req.body)
    u1.save()
    .then((result) => {
        res.send(result)
    })
    .catch((error) => {
        console.error(error)
        res.status(400).send(error)
    })
})

app.listen(port, () => {
    console.log(`Server running at port: ${port}`)
})