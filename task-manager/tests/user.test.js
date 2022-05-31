const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupUserDB } = require('./fixtures/db')

beforeEach(setupUserDB)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Hardik',
        email: 'hardik@gmail.com',
        password: 'Awesome123',
        age: 21
    }).expect(201)

    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user: {
            name: 'Hardik',
            email: 'hardik@gmail.com',
            age: 21
        },
        token: user.tokens[0].token
    })
    expect(user.password).not.toBe('Awesome123')
})

test('Should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    const user = await User.findOne({
        email: response.body.user.email,
        "tokens.token": response.body.token
    });
    expect(user).not.toBeNull()
})

// test('Should not login non-existing user', async () => {
//     await request(app).post('/users/login').send({
//         email: 'wrong@email.com',
//         password: 'wrongpassword'
//     }).expect(400)
// })

// test('Should get profile existing user', async () => {
//     await request(app)
//         .get('/users/me')
//         .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
//         .send()
//         .expect(200)
// })

// test('Should not get profile unauthenticated user', async () => {
//     await request(app)
//         .get('/users/me')
//         .send()
//         .expect(401)
// })

test('Should delete profile for existing & Authenticated user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    const user = await User.findById(userOneId);
    expect(user).toBeNull()
})

// test('Should not delete profile for unauthenticated user', async () => {
//     await request(app)
//         .delete('/users/me')
//         .send()
//         .expect(401)
// })

test('Should update user name', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'Dexter'
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toBe('Dexter')
})

test('Should invalidate update req', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            username: 'Dexter'
        })
        .expect(400)
})

test('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/img.jpg')
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})