const express = require('express')
const router = new express.Router()
const authMiddleware = require('../middlewares/auth')
const Task = require('../models/task')

router.post('/tasks', authMiddleware, async (req, res) => {
    try {
        const t1 = new Task({
            ...req.body,
            owner: req.user._id
        })
        await t1.save()
        res.status(201).send(t1)
    } catch (e) {
        res.status(400).send(e)
    }
})

// GET /tasks?completed=true
// GET /tasks?limit=10&skip=0
// GET /tasks?sortBy=[createdAt, updatedAt, description, completed]-[asc, desc]
router.get('/tasks', authMiddleware, async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split('-')
        sort[parts[0]] = parts[1] === 'asc' ? 1 : -1
    }
    try {
        // const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOne({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/tasks/:id', authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        'completed', 'description'
    ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid field list' })
    }
    try {
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
        // const task = await Task.findById(req.params.id)
        if(!task) {
            return res.status(404).send()
        }
        updates.forEach((updKey) => task[updKey] = req.body[updKey]) 
        await task.save()
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if(!task) {
            return res.status(404).send()
        }
        // task.remove()
        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router