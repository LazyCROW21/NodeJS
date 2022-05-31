const socket = io()

const cntspan = document.querySelector('#cnt-p')
const msginput = document.querySelector('#msg-inp')
const msgbox = document.querySelector('#msg-box')
const btn = document.querySelector('#send-btn')
const locbtn = document.querySelector('#loc-send-btn')

socket.on('message', (data) => {
    console.log(data)
    let msgDOM = document.createElement('p')
    msgDOM.textContent = data
    msgbox.appendChild(msgDOM)
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

locbtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            socket.emit(
                'sendLocation',
                `Location:- lat( ${position.coords.latitude} ), long ( ${position.coords.longitude} )`,
                (data) => {
                    let msgDOM = document.createElement('p')
                    msgDOM.textContent = 'Location shared'
                    msgbox.appendChild(msgDOM)
                }
            )
        })
    }
})