const request = require('postman-request');

const weather = (key, q, callback) => {
    const qENC = encodeURIComponent(q);
    const url = `http://api.weatherapi.com/v1/current.json?key=${key}&q=${qENC}&aqi=yes`;
    const json = true;
    const options = { url, json };
    request(options, (err, res, body) => {
        if (err) {
            callback('Unable to connect to the weather service', undefined)
        } else if (body.error) {
            callback(body.error.message, undefined)
        } else {
            callback(undefined, body)
        }
    });
}

module.exports = weather;