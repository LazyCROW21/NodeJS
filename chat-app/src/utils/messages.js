const generateUserMsg = (username, message) => {
    return {
        username,
        message,
        createdAt: new Date().getTime()
    }
}

const generateSysMsg = (message) => {
    return {
        message,
        createdAt: new Date().getTime()
    }
}

const generateUserLocMsg = (username, coords) => {
    return {
        username,
        link: `https://www.google.com/maps/@${coords.lat},${coords.lon}`,
        createdAt: new Date().getTime()
    }
}

module.exports = {
    generateUserMsg,
    generateSysMsg,
    generateUserLocMsg
}