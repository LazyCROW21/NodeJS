const https = require('https');

const url = 'https://jsonplaceholder.typicode.com/todos/1';

const request = https.request(url, (response) => {
    let data = ''

    response.on('data', (chunk) => {
        data += chunk;
        console.log(chunk);
    });
    response.on('end', () => {
        console.log(data);
        console.log(JSON.parse(data));
    });
});

request.on('error', (err) => {
    console.error(err);
});

request.end();
