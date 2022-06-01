const socket = io()
const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })
const cntspan = document.querySelector('#cnt-p')
const msginput = document.querySelector('#msg-inp')
const msgbox = document.querySelector('#msg-box')
const btn = document.querySelector('#send-btn')
const locbtn = document.querySelector('#loc-send-btn')
const msgTemplate = document.querySelector('#msg-template').innerHTML
const locMsgTemplate = document.querySelector('#loc-msg-template').innerHTML

socket.on('message', ({message, createdAt}) => {
    createdAt = moment(createdAt).format('h:mm a')
    const html = Mustache.render(msgTemplate, { message, createdAt })
    msgbox.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', ({message, createdAt}) => {
    createdAt = moment(createdAt).format('h:mm a')
    const html = Mustache.render(locMsgTemplate, { link: message, title: "User's Location", createdAt })
    msgbox.insertAdjacentHTML('beforeend', html)
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
        socket.emit('message', msg, (data) => {
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
    socket.emit('message', msg, (data) => {
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

const locMSG = (lat, long) => {
    return `https://www.google.com/maps/@${lat},${long}`
}

locbtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        locbtn.disabled = true
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit(
                'sendLocation',
                locMSG(position.coords.latitude, position.coords.longitude),
                () => {
                    locbtn.disabled = false
                }
            )
        })
    }
})

socket.emit('join', { username, room })