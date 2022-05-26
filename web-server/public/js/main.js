
const fetchWeather = (addr) => {
    fetch('/weather?address=' + encodeURIComponent(addr))
        .then((response) => {
            response.json().then((data) => {
                console.log(data)
                if(data.error) {
                    setError(data.error)
                } else {
                    setData(data.location, data.weather.current)
                }
            })
        })
        .catch((error) => {
            console.error(error)
            setError(error.error)
        })
}

const locP = document.querySelector('#locationData');
const weaP = document.querySelector('#weatherData');


const setData = ({name, region, country, lat, lon}, {condition, temp_c, wind_dir}) => {
    locP.textContent = `${name}, ${region}, ${country} (lat: ${lat}, long: ${lon})`
    weaP.textContent = `condition: ${condition.text}, Temp(deg C): ${temp_c}, Wind Direction: ${wind_dir}`
}

const setError = (error) => {
    locP.textContent = 'Error: ' + error
    weaP.textContent = ''
}

const locInput = document.querySelector('#locSearch');
const weatherForm = document.querySelector('form');

weatherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if(locInput.value) {
        fetchWeather(locInput.value);
    } else {
        alert('You must enter a location')
    }
    locInput.value = ''
})

fetchWeather('ahme')