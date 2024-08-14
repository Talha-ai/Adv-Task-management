let API_KEY = "a8e71c9932b20c4ceb0aed183e6a83bb";

getWeatherData = (city) => {
  const URL = "https://api.openweathermap.org/data/2.5/weather";
  const link = `${URL}?q=${city}&appid=${API_KEY}&units=imperial`
  return fetch(link).then(response => response.json())
}

const searchCity = async () => {
  const city = document.getElementById('city-input').value.trim();
  const data = await getWeatherData(city)
  console.log(data)
  showWeatherData(data)
}


const showWeatherData = (weatherData) => {
  console.log(weatherData)
  document.getElementById('city-name').innerText = weatherData.name
  document.getElementById('weather-type').innerText = weatherData.weather[0].main
  document.getElementById('temp').innerText = ((weatherData.main.temp - 32) * 5 / 9).toFixed(2)
  document.getElementById('min-temp').innerText = ((weatherData.main.temp_min - 32) * 5 / 9).toFixed(2)
  document.getElementById('max-temp').innerText = ((weatherData.main.temp_max - 32) * 5 / 9).toFixed(2)
  document.getElementById('humidity').innerText = weatherData.main.humidity

}

