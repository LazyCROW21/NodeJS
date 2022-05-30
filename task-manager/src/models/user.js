const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error('Invalid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
        validate(value) {
            if(validator.contains(value, 'password', {ignoreCase: true})) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if(value < 0) {
                throw new Error('Age must be positive')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'owner',
})

userSchema.methods.toJSON = function () {
    const user = this
    const userObj = user.toObject()
    delete userObj.password
    delete userObj.tokens
    delete userObj.avatar
    return userObj
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id: user._id.toString()}, 'SECRETKEY')
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, pwd) => {
    const user = await User.findOne({ email })
    if(!user) {
        throw new Error('Invalid Credential')
    }

    const isMatch = await bcrypt.compare(pwd, user.password)

    if(!isMatch) {
        throw new Error('Invalid Credential')
    }

    return user
}

userSchema.pre('save', async function(next) {
    const user = this
    if(user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

userSchema.pre('remove', async function(next) {
    const user = this
    await Task.deleteMany({ owner: user._id})
    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User