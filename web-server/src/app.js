const express = require('express');
const path = require('path');
const hbs = require('hbs');

const app = express();

const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')
app.set('views', viewsPath)

app.use(express.static(path.join(__dirname, '../public')))

app.get('/', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Hardik Kardam'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Hardik Kardam'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Get some help',
        name: 'Hardik Kardam',
        msg: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Tempore odio illo dignissimos consequatur ratione odit quisquam quod aspernatur officiis. Ab expedita natus quaerat ipsum mollitia molestiae, repellendus dolor. Temporibus, incidunt.'
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Hardik Kardam',
        msg: 'The help page you are looking for is not found or is removed'
    })
})

app.get('/weather', (req, res) => {
    res.send({cond: 'weather world'})
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error 404',
        name: 'Hardik Kardam',
        msg: 'The page you are looking for is not found or is removed'
    })
})

app.listen(5000, () => {
    console.log('Server running at port: 5000')
})