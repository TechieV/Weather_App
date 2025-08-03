const baseURL =
  "https://api.openweathermap.org/data/2.5/weather?q=bihar&appid=";
const baseForcast ="https://api.openweathermap.org/data/2.5/forecast?q=delhi&appid=";
const apiKey = "222567df567293a90ef7773617392883";
const metric = "&units=metric";

const weather = async () => {
  let data = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=222567df567293a90ef7773617392883" +
      metric
  );
  response = await data.json();
  console.log(response);

  const weatherData = {
    humidity: response.main.humidity,
    feelLike: response.main.feels_like,
    temp: response.main.temp,
    maxTemp : response.main.temp_max,
    minTemp : response.main.temp_min,
    wind : response.wind.speed, //meter per sec
    id : response.weather[0].id,
    main : response.weather[0].main,
    description : response.weather[0].description

};
console.log(weatherData);
};
