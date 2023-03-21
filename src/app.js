// Functions

let unit = "metric";
console.log(unit);

function displayFarenheitTemperature(event) {
  event.preventDefault();
  celciusLink.classList.remove("active");
  farenheitLink.classList.add("active");
  let temperatureElement = document.querySelector("#temperature");
  let farenheitTemperature = (celciusTemperature * 9) / 5 + 32;
  temperatureElement.innerHTML = Math.round(farenheitTemperature);
}

function displayCelciusTemperature(event) {
  event.preventDefault();
  celciusLink.classList.add("active");
  farenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celciusTemperature);
}

let farenheitLink = document.querySelector("#farenheit-link");
farenheitLink.addEventListener("click", displayFarenheitTemperature);

let celciusLink = document.querySelector("#celcius-link");
celciusLink.addEventListener("click", displayCelciusTemperature);

function formatDate(timestamp) {
  // Calculate date
  let date = new Date(timestamp);
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  let hours = date.getHours();
  let minutes = date.getMinutes();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timeStamp) {
  let date = new Date(timeStamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  forecast = response.data.daily;
  let forecastElemement = document.querySelector("#forecast");

  let forecastHTML = ` <div class="card opacity-100">
                          <div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML =
        forecastHTML +
        `
  
              <div class="col-2">
                <div class="weather-forecast-date">${formatDay(
                  forecastDay.time
                )}</div> 
                <img
                  src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
                    forecastDay.condition.icon
                  }.png"
                  alt=""
                  width="50"
                  
                />
                <div class="weather-forecast-temperature">
                  <span class="weather-forecast-temperature-max">${Math.round(
                    forecastDay.temperature.minimum
                  )}° .&nbsp</span>
                  <span class="weather-forecast-temperature-min">${Math.round(
                    forecastDay.temperature.maximum
                  )}° .</span>
                </div>
              </div>
  `;
    }
  });

  forecastHTML = forecastHTML + `</div> </div>`;
  forecastElemement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "o48130fet42a8ab13ff24260fbc81c4c";
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${coordinates.longitude}&lat=${coordinates.latitude}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let temperatureElement = document.querySelector("#temperature");
  let cityElement = document.querySelector("#city");
  let descriptionElement = document.querySelector("#description");
  let humidityElement = document.querySelector("#humidity");
  let windElement = document.querySelector("#wind");
  let dateElement = document.querySelector("#date");
  let iconElement = document.querySelector("#icon");

  celciusTemperature = response.data.temperature.current;
  temperatureElement.innerHTML = Math.round(celciusTemperature);
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;
  windElement.innerHTML = Math.round(response.data.wind.speed);
  dateElement.innerHTML = formatDate(response.data.time * 1000);
  iconElement.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  iconElement.setAttribute("alt", response.data.condition.description);

  getForecast(response.data.coordinates);
}

function search(city) {
  let apiKey = "o48130fet42a8ab13ff24260fbc81c4c";
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${city}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

let celciusTemperature = null;

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

search("New York");
