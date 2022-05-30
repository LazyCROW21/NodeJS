const express = require('express')
const multer = require('multer')
const router = new express.Router()
const User = require('../models/user')
const sharp = require('sharp')
const authMiddleware = require('../middlewares/auth')
const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account')

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)) {
            cb(new Error('Please upload an image'))
        }
        cb(undefined, true)
    }
})

router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        // sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})

router.post('/users/me/avatar', authMiddleware, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send({ msg: 'File uploaded' })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.delete('/users/me/avatar', authMiddleware, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send({ msg: 'File removed' })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar) {
            throw new Error('Image not found')
        }
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', authMiddleware, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users', authMiddleware, async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.get('/users/me', authMiddleware, async (req, res) => {
    res.send(req.user)
})

router.get('/users/me', async (req, res) => {
    try {
        res.send(req.user)
    } catch (e) {
        res.status(500).send(e)
    }
})

router.patch('/users/me', authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = [
        'name', 'email', 'password', 'age'
    ]
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    if(!isValidOperation) {
        return res.status(400).send({ error: 'Invalid field list' })
    }
    try {
        updates.forEach((updKey) => req.user[updKey] = req.body[updKey]) 
        await req.user.save()
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', authMiddleware, async (req, res) => {
    try {
        await req.user.remove()
        // sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router