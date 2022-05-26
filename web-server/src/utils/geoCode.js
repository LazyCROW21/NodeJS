const request = require('postman-request');

const geoCode = (key, q, callback) => {
    const qENC = encodeURIComponent(q);
    const url = `http://api.weatherapi.com/v1/search.json?key=${key}&q=${qENC}`;
    const json = true;
    const geoCodingOptions = { url, json };
    request(geoCodingOptions, (err, res, body) => {
        if (err) {
            callback('Unable to connect to the weather service', undefined)
        } else if (body.error) {
            callback(body.error.message, undefined)
        } else {
            callback(undefined, body)
        }
    });
}

module.exports = geoCode;