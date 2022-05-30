const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const userOne = {
    name: 'Hardik',
    email: 'hk@g.com',
    password: 'qwerty12345',
    age: 21,
}

beforeEach(async () => {
    await User.deleteMany()
    await new User(userOne).save()
})

// test('Should signup a new user', async () => {
//     await request(app).post('/users').send({
//         name: 'Hardik',
//         email: 'hardik@gmail.com',
//         password: 'Awesome123',
//         age: 21
//     }).expect(201)
// })

// test('Should login existing user', async () => {
//     await request(app).post('/users/login').send({
//         email: userOne.email,
//         password: userOne.password
//     }).expect(200)
// })

test('Should login existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'wrong@email.com',
        password: 'wrongpassword'
    }).expect(400)
})
