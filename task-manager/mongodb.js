const mongodb = require('mongodb')

// const MongoClient = mongodb.MongoClient
// const ObjectID = MongoClient.ObjectID
const {
    MongoClient,
    ObjectId
} = mongodb

const connectionURL = 'mongodb://127.0.0.1:27017'
const dbName = 'task-manager'

// const id = new ObjectId()
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, {
    useNewURLParser: true
}, (error, client) => {
    if (error) {
        console.error('Error in connecting to db!')
        return console.error(error)
    }
    console.log('Connected Successfully to the database!')
    const db = client.db(dbName)

    db.collection('tasks').deleteOne({
        _id: new ObjectId("629078c6f76f3ac1b7c1b3ef")
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.error(error)
    }).finally(() => {
        client.close();
    })
})
// db.collection('users').deleteMany({
//     age: 20
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.error(error)
// }).finally(() => {
//     client.close();
// })
// db.collection('tasks').updateMany({
// }, {
//     $set: { completed: true }
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.error(error)
// }).finally(() => {
//     client.close();
// })
// db.collection('users').updateOne({
//     _id: new ObjectId('62907cc50d7807260b3001f8')
// }, {
//     $set: { name: 'David' }
// }).then((result) => {
//     console.log(result)
// }).catch((error) => {
//     console.error(error)
// })
// db.collection('users').findOne({
    //     // name: 'Jack'
    //     _id: new ObjectId("62907cc50d7807260b3001f8")
    // }, (error, result) => {
    //     client.close()
    //     if(error) {
    //         console.error('Error in inserting!')
    //         return console.error(error)
    //     }

    //     console.log(result)
    // })
    // db.collection('tasks').find({
    //     // name: 'Jack'
    //     completed: false
    // }).toArray((error, result) => {
    //     client.close()
    //     if(error) {
    //         console.error('Error in inserting!')
    //         return console.error(error)
    //     }

    //     console.log(result)
    // })
// db.collection('users').insertOne({
//     _id: id,
//     name: 'Jack',
//     age: 20
// }, (error, result) => {
//     client.close()
//     if(error) {
//         console.error('Error in inserting!')
//         return console.error(error)
//     }

//     console.log(result);
// })
// db.collection('tasks').insertMany([
//     {
//         description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime harum modi debitis consequatur similique minus suscipit sit quisquam non unde laboriosam eius perferendis ipsa, atque repudiandae reprehenderit quod inventore excepturi.',
//         completed: false
//     },
//     {
//         description: 'Lorem dolor amet consectetur adipisicing elit. Maxime harum modi debitis consequatur similique minus sit non unde laboriosam eius perferendis ipsa, repudiandae reprehenderit quod inventore excepturi.',
//         completed: true
//     }
// ], (error, result) => {
//     client.close()
//     if(error) {
//         console.error('Error in inserting!')
//         return console.error(error)
//     }

//     console.log(result);
// })