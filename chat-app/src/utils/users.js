const users = []

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!room || !username) {
        return {
            error: 'Username & room are required!'
        }
    }

    const existingUser = users.find((user) => user.room === room && user.username === username)

    if(existingUser) {
        return {
            error: 'Username is in use!'
        }
    }

    const user = { id, username, room}
    users.push(user);
    return { user }
}