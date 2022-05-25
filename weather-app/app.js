const weather = require('./utils/weather');
const geoCode = require('./utils/geoCode');

// lewev63307@sceath.com
// ASDF1234

const key = '5bb2d4238cd8486e899102010222505'
let location = 'Ahmedabad'

// weather(key, location, (err, data) => {
//     console.error(err);
//     console.log(data);
// });

geoCode(key, location, (err, data) => {
    if(err) {
        return console.error(err);
    }
    weather(key, data[0].name, (err, data) => {
        console.error(err);
        console.log(data);
    });
});





