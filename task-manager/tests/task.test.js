const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const Task = require('../src/models/task')
const { taskOne, userTwo, userOne, setupUserDB, setupTaskDB } = require('./fixtures/db')

beforeAll(setupUserDB)
beforeEach(setupTaskDB)

test('Should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'Perform Testing'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

test('Should fetch user tasks', async () => {
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .expect(200)
    expect(response.body.length).toEqual(2)
})

test('Should prevent deletion of task from unauth users', async () => {
    await request(app)
        .delete('/tasks/'+taskOne._id.toString())
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)
    const task1 = await Task.findById(taskOne._id)
    expect(task1).not.toBeNull()
})