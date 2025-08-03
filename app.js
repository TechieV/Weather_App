const baseURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const baseForcast =
  "https://api.openweathermap.org/data/2.5/forecast?q=";
const apiKey = "222567df567293a90ef7773617392883";
const metric = "&units=metric";
const baseAQI = "https://api.waqi.info/feed/";
const tokenAQI = "ed8524167a44b9e188c1032f2a9eb2aeec749286";
let inputCity = document.querySelector(".input-container input");
const btn = document.querySelector(".input-container button");

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  inputCity = inputCity.value;
  console.log("input ", inputCity);
  weather(inputCity);
});

const weather = async (city) => {
  let URL = `${baseURL}${city}&appid=${apiKey}${metric}`;
  let forcastURL = `${baseForcast}${city}&appid=${apiKey}${metric}`;
  let aqiURL = `${baseAQI}${city}/?token=${tokenAQI}`;

  Aqi = await fetch(aqiURL);
  data = await fetch(URL);
  forcastData = await fetch(forcastURL); 
  
  Aqi = await Aqi.json(); 
  forcastData = await forcastData.json();
  response = await data.json();

  console.log(response);
  console.log(forcastData);
  console.log(Aqi)
  if (data.status == "200" || data.status == 200) {
    document.querySelector(".container").classList.remove("none-container");
    document.querySelector(".search-city").classList.add("none-container");
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
    main: response.weather[0].main,
    description: response.weather[0].description,
    city: response.name,
  };

  // document.querySelector('.temp h1').innerText= Math.round(weatherData.temp)+" °C";
  console.log(weatherData);
};
