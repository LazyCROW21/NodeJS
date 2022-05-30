const sgMail = require('@sendgrid/mail')

// const sendGridAPIKey = ''

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hardikkardam21@gmail.com',
        subject: 'Thanks for choosing our App!',
        text: `WELCOME to the App, ${name}. Let me how you get along with the App`
    })
}

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'hardikkardam21@gmail.com',
        subject: 'Sorry to see you go!',
        text: `Goodbye, ${name}. I hope to see sometime soon.`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}