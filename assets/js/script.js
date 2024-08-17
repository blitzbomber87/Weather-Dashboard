//My API Key
const apiKey = '1db7415655c8e803a7c4593d59e57368 '; 
const searchForm = document.getElementById('searchForm');
const cityInput = document.getElementById('cityInput');
const currentWeatherInfo = document.getElementById('current-weather-info');
const forecastContainer = document.getElementById('forecastContainer');
const historyList = document.getElementById('searchHistoryList');

let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];

document.addEventListener('DOMContentLoaded', () => {
    renderSearchHistory();
    if (searchHistory.length > 0) {
        getWeather(searchHistory[0]);
    }
});

//Event Listener for search form submit
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        updateSearchHistory(city);
        cityInput.value = '';
    }
});

// Function to get current and future weather
function getWeather(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`;
    
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.cod === '200') {
                displayCurrentWeather(data);
                displayForecast(data);
            } else {
                alert('City not found');
            }
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
        });
}

//Function to display weather data
function displayCurrentWeather(data) {
    const city = data.city.name;
    const date = new Date().toLocaleDateString();
    const iconUrl = `https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`;
    const temp = data.list[0].main.temp;
    const humidity = data.list[0].main.humidity;
    const windSpeed = data.list[0].wind.speed;
    
    currentWeatherInfo.innerHTML = `
        <h3>${city} (${date}) <img src="${iconUrl}" alt="Weather icon"></h3>
        <p>Temperature: ${temp} °C</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} m/s</p>
    `;
}

function displayForecast(data) {
    forecastContainer.innerHTML = '';
    for (let i = 0; i < data.list.length; i += 8) { // Each 3-hour forecast, 8 * 3 = 24-hour
        const forecastDay = document.createElement('div');
        forecastDay.classList.add('forecast-day');
        
        const date = new Date(data.list[i].dt_txt).toLocaleDateString();
        const iconUrl = `https://openweathermap.org/img/wn/${data.list[i].weather[0].icon}.png`;
        const temp = data.list[i].main.temp;
        const humidity = data.list[i].main.humidity;
        const windSpeed = data.list[i].wind.speed;
        
        forecastDay.innerHTML = `
            <h4>${date}</h4>
            <img src="${iconUrl}" alt="Weather icon">
            <p>Temp: ${temp} °C</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind: ${windSpeed} m/s</p>
        `;
        
        forecastContainer.appendChild(forecastDay);
    }
}

function updateSearchHistory(city) {
    if (!searchHistory.includes(city)) {
        searchHistory.unshift(city);
        if (searchHistory.length > 5) {
            searchHistory.pop();
        }
        localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
        renderSearchHistory();
    }
}

function renderSearchHistory() {
    historyList.innerHTML = '';
    searchHistory.forEach(city => {
        const historyItem = document.createElement('li');
        historyItem.textContent = city;
        historyItem.addEventListener('click', () => getWeather(city));
        historyList.appendChild(historyItem);
    });
}