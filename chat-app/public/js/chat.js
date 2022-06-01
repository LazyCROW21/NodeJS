const socket = io()
let {
    username,
    room
} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})
const cntspan = document.querySelector('#cnt-p')
const msginput = document.querySelector('#msg-inp')
const msgbox = document.querySelector('#msg-box')
const btn = document.querySelector('#send-btn')
const locbtn = document.querySelector('#loc-send-btn')
const sidebar = document.querySelector('#sidebar');
const sysMsgTemplate = document.querySelector('#sys-msg-template').innerHTML
const otherMsgTemplate = document.querySelector('#other-msg-template').innerHTML
const myMsgTemplate = document.querySelector('#my-msg-template').innerHTML
const myLocMsgTemplate = document.querySelector('#my-loc-msg-template').innerHTML
const otherLocMsgTemplate = document.querySelector('#other-loc-msg-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

username = username.trim().toLowerCase()
room = room.trim().toLowerCase()

const autoscroll = () => {
    const newMsg = msgbox.lastElementChild
    const newMsgStyle = getComputedStyle(newMsg)
    const newMsgBottomMargin = parseInt(newMsgStyle.marginBottom)
    const newMsgTopMargin = parseInt(newMsgStyle.marginTop)
    const newMsgHeight = newMsg.offsetHeight + newMsgBottomMargin + newMsgTopMargin

    const visibleHeight = msgbox.offsetHeight

    const containerHeight = msgbox.scrollHeight

    const scrollOffset = msgbox.scrollTop + visibleHeight
    if(containerHeight - newMsgHeight <= scrollOffset) {
        msgbox.scrollTop = msgbox.scrollHeight
    }
}

const userColor = (str) => {
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    var colour = '#';
    for (var i = 0; i < 3; i++) {
        var value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

socket.on('sysMsg', (message) => {
    const html = Mustache.render(sysMsgTemplate, { message: message.message })
    // createdAt = moment(createdAt).format('h:mm a')
    msgbox.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('userMsg', (data) => {
    let html
    data.createdAt = moment(data.createdAt).format('h:mm a')
    if (data.username === username) {
        html = Mustache.render(myMsgTemplate, data)
    } else {
        data.color = userColor(data.username)
        html = Mustache.render(otherMsgTemplate, data)
    }
    msgbox.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('userLocMsg', (data) => {
    data.createdAt = moment(data.createdAt).format('h:mm a')
    let html
    if (data.username === username) {
        html = Mustache.render(myLocMsgTemplate, data)
    } else {
        data.color = userColor(data.username)
        html = Mustache.render(otherLocMsgTemplate, data)
    }
    msgbox.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

socket.on('roomData', ({room, users}) => {
    let html = Mustache.render(sidebarTemplate, {room, users})
    sidebar.innerHTML = html
})

msginput.addEventListener('keypress', (e) => {
    if (e.keyCode === 13) {
        msginput.disabled = true
        btn.disabled = true
        let msg = msginput.value.trim()
        if (!msg) {
            msginput.disabled = false
            btn.disabled = false
            return
        }
        socket.emit('sendMsg', msg, (data) => {
            msginput.disabled = false
            btn.disabled = false
            if (data) {
                console.log('Profrane word')
            } else {
                console.log('Msg was delivered!')
            }
        })
        msginput.value = ''
        msginput.focus()
    }
})

btn.addEventListener('click', () => {
    msginput.disabled = true
    btn.disabled = true
    let msg = msginput.value.trim()
    if (!msg) {
        msginput.disabled = false
        btn.disabled = false
        return
    }
    socket.emit('sendMsg', msg, (data) => {
        msginput.disabled = false
        btn.disabled = false
        if (data) {
            console.log('Profrane word')
        } else {
            console.log('Msg was delivered!')
        }
    })
    msginput.value = ''
    msginput.focus()
})

locbtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        locbtn.disabled = true
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit(
                'sendLocation',
                { lat: position.coords.latitude, lon: position.coords.longitude },
                (error) => {
                    locbtn.disabled = false
                    if(error) {
                        alert(error)
                        console.error(error)
                    }
                }
            )
        })
    }
})

socket.emit('join', {
    username,
    room
}, (error) => {
    if(error) {
        alert('CANNOT CONNECT TO ROOM:', error)
        location.href = '/'
    }
})