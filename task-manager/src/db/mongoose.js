const mongoose = require('mongoose')

const dbName = 'task-manager-api'
const connectionURL = `mongodb+srv://LazyCROW21:LazyCROW%2321@lazy-server.y2dst.mongodb.net/${dbName}?retryWrites=true&w=majority`

mongoose.connect(connectionURL, {
    useNewUrlParser: true,
    useCreateIndex: true
}).then((result) => {
    console.log('Connected successfully!')
}).catch((error) => {
    console.error(error)
})

const Task = mongoose.model('Task', {
    description: {
        type: String,
        trim: true,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    }
})