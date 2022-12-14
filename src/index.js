// Return current time --> Saturday 12:03
function TimeC(time) {
  let day = time.getDay();
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday"
  ];
  let hour = time.getHours();
  let minute = time.getMinutes();
  if (minute <= 9) {
    return days[day] + " " + hour + ":0" + minute;
  } else {
    return days[day] + " " + hour + ":" + minute;
  }
}

//Forecast for 7 days
function displayforecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecElement = document.querySelector("#forecast");

  let forecastHtml = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    let maxTemp = Math.round(forecastDay.temp.max);
    let minTemp = Math.round(forecastDay.temp.min);
    if (index === 0) {
      forecastHtml =
        forecastHtml +
        `<div class="forecast-block col-2">
          <div class="weather-forecast-date">Today</div>
          <img
            src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
            alt=""
            width="55"
            class="forec-icon"
          />
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max"> ${maxTemp}° </span>
            <span class="weather-forecast-temperature-min"> ${minTemp}° </span>
          </div>
        </div>
  `;
    }
    if (index <= 6 && index > 0) {
      forecastHtml =
        forecastHtml +
        `<div class="forecast-block col-2"> 
            <div class="weather-forecast-date">${displayforecastDay(
              forecastDay.dt
            )}</div>
          <img
            src="http://openweathermap.org/img/wn/${
              forecastDay.weather[0].icon
            }@2x.png"
            alt=""
            width="55"
            class="forec-icon"
          />
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max"> ${maxTemp}° </span>
            <span class="weather-forecast-temperature-min"> ${minTemp}° </span>
          </div>
        </div>`;
    }
  });

  forecastHtml = forecastHtml + `</div>`;
  forecElement.innerHTML = forecastHtml;
}
function getForecast(coordinates) {
  let apiKey = "ebb3d64cbdc8a91fbd86324a76ac4571";
  let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;
  axios.get(url).then(displayForecast);
}

//Current time (dispaly)
let now = new Date();
let date = document.querySelector("#date");
date.innerHTML = TimeC(now);

//Current temperature at your city
function dTemp(response) {
  let temperature = Math.round(response.data.main.temp);
  let ntemp = document.querySelector("#d-temp");
  ntemp.innerHTML = temperature;

  cTemp = response.data.main.temp;

  let dweather = document.querySelector("#desc");
  dweather.innerHTML = response.data.weather[0].description;

  let h1 = document.querySelector("#urcity");
  h1.innerHTML = response.data.name;
  urCityS = response.data.name;

  let humidity = document.querySelector("#humid");
  humidity.innerHTML = response.data.main.humidity + "%";

  let wind = document.querySelector("#wind");
  wind.innerHTML = Math.round(response.data.wind.speed);
  if (unit == "metric") {
    wind.innerHTML = Math.round(response.data.wind.speed * 3.6) + " km/h";
  }
  if (unit == "imperial") {
    wind.innerHTML = wind.innerHTML + " mph";
  }
  let icon = document.querySelector("#w-icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  icon.setAttribute(
    "alt",
    `http://openweathermap.org/img/wn/${response.data.weather[0].description}@2x.png`
  );

  getForecast(response.data.coord);
}

//Search for city to get temperature
function searchC(city) {
  let apiKey = "ebb3d64cbdc8a91fbd86324a76ac4571";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${unit}`;
  axios.get(url).then(dTemp);
}

//Click on map button
function CurPosition(position) {
  let apiKey = "ebb3d64cbdc8a91fbd86324a76ac4571";
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${apiKey}`;
  axios.get(url).then(dTemp);
}
//Display your city, which you have typed
function SubC(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  searchC(city);
}
function Nav(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(CurPosition);
}

//Switch units
let cTemp = null;
let switchC = document.querySelector("#c-link");
let switchF = document.querySelector("#f-link");
function switchCe(event) {
  let tempElement = document.querySelector("#d-temp");
  event.preventDefault();
  tempElement.innerHTML = Math.round(cTemp);
  switchF.classList.remove("active");
  switchC.classList.add("active");
  unit = "metric";
  searchC(urCityS);
}
function switchFe(event) {
  let tempElement = document.querySelector("#d-temp");
  event.preventDefault();
  let Fnum = Math.round((tempElement.innerHTML * 9) / 5 + 32);
  tempElement.innerHTML = Fnum;
  switchF.classList.add("active");
  switchC.classList.remove("active");
  unit = "imperial";
  searchC(urCityS);
}
switchC.addEventListener("click", switchCe);
switchF.addEventListener("click", switchFe);

let unit = "metric"; 
/*Global variable that changes when you click the unit conversion links (see functions switchFe and switchCe). 
Then I use it for unit conversion of my current temp. and forecast temp. 
+ for conversion of wind speed(call the forecast API again using that new unit value and repopulate the forecast with the new temperature values provided by the API) */

let form = document.querySelector(".search-form");
form.addEventListener("submit", SubC);

let urCityS = "Kharkiv";

let mapBut = document.querySelector("#cur-location");
mapBut.addEventListener("click", Nav);

searchC("Kharkiv");
