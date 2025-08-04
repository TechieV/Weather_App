const baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const baseForcast = "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey = "222567df567293a90ef7773617392883";
const metric = "&units=metric";
const baseAQI = "https://api.waqi.info/feed/";
const tokenAQI = "ed8524167a44b9e188c1032f2a9eb2aeec749286";
let inputCity = document.querySelector(".input-container input");
const btn = document.querySelector(".input-container button");

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  cityValue = inputCity.value.trim();
  console.log("input ", cityValue);
  weather(cityValue);
});

const weather = async (city) => {
  let URL = `${baseURL}${city}&appid=${apiKey}${metric}`;
  let forcastURL = `${baseForcast}${city}&appid=${apiKey}${metric}`;
  
  data = await fetch(URL);
  forcastData = await fetch(forcastURL);

  forcastData = await forcastData.json();
  response = await data.json();

  let aqiURL = `${baseAQI}${response.name}/?token=${tokenAQI}`;
  
  Aqi = await fetch(aqiURL);
  Aqi = await Aqi.json();
  
  console.log(response);
  console.log(forcastData);
  console.log(Aqi)

  if (data.status == "200" || data.status == 200) {
    document.querySelector(".container").classList.remove("none-container");
    document.querySelector(".search-city").classList.add("none-container");
    document.querySelector(".not-found").classList.add("none-container");
  } else if (data.status !== "200" || data.status !== 200) {
    document.querySelector(".container").classList.add("none-container");
    document.querySelector(".not-found").classList.remove("none-container");
    document.querySelector(".search-city").classList.add("none-container");
  }

  const weatherData = {
    humidity: response.main.humidity,
    feelLike: response.main.feels_like,
    temp: response.main.temp,
    maxTemp: response.main.temp_max,
    minTemp: response.main.temp_min,
    wind: response.wind.speed, //meter per sec
    id: response.weather[0].id,
    condition: response.weather[0].main,
    description: response.weather[0].description,
    city: response.name,
  };
  
  
  
  let id = weatherData.id; 
  updateImg(id);
  updateWeather(weatherData);
};

let updateImg = async (id) => {
  let img = document.querySelector(".weather-img img");

  if (id == 800) {
    img.src = "assets/weather/clear.svg";
  } else if (id >= 801 && id <= 804) {
    img.src = "assets/weather/clouds.svg";
  } else if (id >= 701 && id <= 781) {
    img.src = "assets/weather/atmosphere.svg";
  } else if (id >= 600 && id <= 622) {
    img.src = "assets/weather/snow.svg";
  } else if (id >= 500 && id <= 531) {
    img.src = "assets/weather/rain.svg";
  } else if (id >= 300 && id <= 321) {
    img.src = "assets/weather/drizzle.svg";
  } else if (id >= 200 && id <= 232) {
    img.src = "assets/weather/thunderstorm.svg";
  }
};

let updateWeather = async (weatherData) => {
  
  document.querySelector(".location h3").innerText = weatherData.city;
  document.querySelector(".condition p").innerText = weatherData.condition;
  document.querySelector(".temp h1").innerText =
Math.round(weatherData.temp) + " °C";
  document.querySelector(".feel-like p").innerText =
    Math.round(weatherData.feelLike) + " °C";
  document.querySelector(".min-temp p").innerText =
    Math.round(weatherData.minTemp) + " °C";
  document.querySelector(".max-temp p").innerText =
    Math.round(weatherData.maxTemp) + " °C";
  document.querySelector(".humidity-info h4").innerText =
    weatherData.humidity + "%";
  document.querySelector(".wind-info h4").innerText = weatherData.wind + "M/S";

}