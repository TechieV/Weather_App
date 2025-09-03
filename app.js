const baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const baseForcast = "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey = "222567df567293a90ef7773617392883";
const metric = "&units=metric";

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

  let data = await fetch(URL);
  let response = await data.json();

  let forecastRes = await fetch(forcastURL);
  let forcastData = await forecastRes.json();

  console.log(response);
  console.log(forcastData);

  if (data.status == 200) {
    document.querySelector(".container").classList.remove("none-container");
    document.querySelector(".search-city").classList.add("none-container");
    document.querySelector(".not-found").classList.add("none-container");
  } else {
    document.querySelector(".container").classList.add("none-container");
    document.querySelector(".not-found").classList.remove("none-container");
    document.querySelector(".search-city").classList.add("none-container");
    return; // stop if city not found
  }

  const weatherData = {
    humidity: response.main.humidity,
    feelLike: response.main.feels_like,
    temp: response.main.temp,
    wind: response.wind.speed, // meter per sec
    id: response.weather[0].id,
    condition: response.weather[0].main,
    description: response.weather[0].description,
    city: response.name,
  };

  let id = weatherData.id;
  updateImg(id);
  updateWeather(weatherData, forcastData); // pass forecast too
  document.querySelector(".date").innerText = updateDate();

  updateForecast(forcastData); //  forecast cards
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

let updateWeather = async (weatherData, forcastData) => {
  //  Current weather
  document.querySelector(".location h3").innerText = weatherData.city;
  document.querySelector(".condition p").innerText = weatherData.condition;
  document.querySelector(".temp h1").innerText =
    Math.round(weatherData.temp) + " °C";

  document.querySelector(".feel-like p").innerText =
    Math.round(weatherData.feelLike) + " °C";

  document.querySelector(".humidity-info h4").innerText =
    weatherData.humidity + "%";
  document.querySelector(".wind-info h4").innerText =
    weatherData.wind + " M/S";

  //  Real daily Min/Max temps from forecast
  const today = new Date().toDateString();
  const todayTemps = forcastData.list
    .filter((item) => new Date(item.dt_txt).toDateString() === today)
    .map((item) => item.main.temp);

  if (todayTemps.length > 0) {
    const minTemp = Math.min(...todayTemps);
    const maxTemp = Math.max(...todayTemps);

    document.querySelector(".min-temp p").innerText =
      Math.round(minTemp) + " °C";
    document.querySelector(".max-temp p").innerText =
      Math.round(maxTemp) + " °C";
  }
};

const updateDate = () => {
  const now = new Date();
  const day = now.toLocaleDateString("en-US", { weekday: "short" });
  const date = now.toLocaleDateString("en-US", { day: "2-digit" });
  const month = now.toLocaleDateString("en-US", { month: "short" });
  const custom = `${day}, ${date} ${month}`;
  return custom;
};

//  Forecast Functionality (Date + Temp + Icon

const updateForecast = (forcastData) => {
  const forecastContainer = document.querySelector(".forcast-container");
  forecastContainer.innerHTML = ""; // clear old cards

  // Pick one forecast per day (around 12:00)
  const dailyForecasts = {};
  forcastData.list.forEach((item) => {
    const date = new Date(item.dt_txt);
    const dayKey = date.toLocaleDateString("en-US", {

      day: "2-digit",
      month: "short",
    });
    const hour = date.getHours();

    if (hour === 12 && !dailyForecasts[dayKey]) {
      dailyForecasts[dayKey] = item;
    }
  });

  // Take 5 days only
  Object.keys(dailyForecasts)
    .slice(0, 5)
    .forEach((day) => {
      const forecast = dailyForecasts[day];
      const temp = Math.round(forecast.main.temp);
      const condition = forecast.weather[0].main.toLowerCase();

      // Pick correct icon
      let icon = "clouds.svg";
      if (condition.includes("clear")) icon = "clear.svg";
      else if (condition.includes("rain")) icon = "rain.svg";
      else if (condition.includes("snow")) icon = "snow.svg";
      else if (condition.includes("drizzle")) icon = "drizzle.svg";
      else if (condition.includes("thunderstorm")) icon = "thunderstorm.svg";

      // Create forecast card
      const card = document.createElement("div");
      card.classList.add("forcast");

      card.innerHTML = `
        <p>${day}</p>
        <img src="assets/weather/${icon}" alt="${condition}">
        <p>${temp} °C</p>
      `;

      forecastContainer.appendChild(card);
    });
};
