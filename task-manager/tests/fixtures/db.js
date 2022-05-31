const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Hardik',
    email: 'hk@g.com',
    password: 'qwerty12345',
    age: 21,
    tokens: [{
        token: jwt.sign({
            _id: userOneId
        }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Yash',
    email: 'yk@g.com',
    password: 'hardpwd12345',
    age: 19,
    tokens: [{
        token: jwt.sign({
            _id: userTwoId
        }, process.env.JWT_SECRET)
    }]
}

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Testing task 1',
    completed: false,
    owner: userOneId
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Testing task 2',
    completed: true,
    owner: userOneId
}

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Testing task 3',
    completed: true,
    owner: userTwoId
}

const setupUserDB = async () => {
    await User.deleteMany()
    await new User(userOne).save()
    await new User(userTwo).save()
}

const setupTaskDB = async () => {
    await Task.deleteMany()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userTwoId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupUserDB,
    setupTaskDB
}