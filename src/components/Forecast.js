import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactAnimatedWeather from "react-animated-weather";

function Forecast({ weather }) {
  const { data } = weather;
  const [forecastData, setForecastData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(true);

  useEffect(() => {
    if (!data.city) return;

    const fetchForecastData = async () => {
      try {
        const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${data.city}&appid=${apiKey}&units=metric`;

        const response = await axios.get(url);
        setForecastData(response.data.list);
      } catch (error) {
        console.error("Error fetching forecast data:", error);
      }
    };

    fetchForecastData();
  }, [data.city]);

  const formatDay = (timestamp) => {
    const options = { weekday: "short" };
    return new Date(timestamp * 1000).toLocaleDateString("en-US", options);
  };

  const getCurrentDate = () => {
    const options = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    return new Date().toLocaleDateString("en-US", options);
  };

  const toggleTemperatureUnit = () => {
    setIsCelsius((prev) => !prev);
  };

  const convertToFahrenheit = (temp) => Math.round((temp * 9) / 5 + 32);

  const renderTemperature = (temp) =>
    isCelsius ? Math.round(temp) : convertToFahrenheit(temp);

  return (
    <div>
      <div className="city-name">
        <h2>
          {data.city}, <span>{data.country}</span>
        </h2>
      </div>

      <div className="date">
        <span>{getCurrentDate()}</span>
      </div>

      <div className="temp">
        {data.condition.icon_url && (
          <img
            src={data.condition.icon_url}
            alt={data.condition.description}
            className="temp-icon"
          />
        )}
        {renderTemperature(data.temperature.current)}
        <sup className="temp-deg" onClick={toggleTemperatureUnit}>
          {isCelsius ? "°C" : "°F"} | {isCelsius ? "°F" : "°C"}
        </sup>
      </div>

      <p className="weather-des">{data.condition.description}</p>

      <div className="weather-info">
        <div className="col">
          <ReactAnimatedWeather icon="WIND" size={40} />
          <div>
            <p className="wind">{data.wind.speed} m/s</p>
            <p>Wind speed</p>
          </div>
        </div>
        <div className="col">
          <ReactAnimatedWeather icon="RAIN" size={40} />
          <div>
            <p className="humidity">{data.temperature.humidity}%</p>
            <p>Humidity</p>
          </div>
        </div>
      </div>

      <div className="forecast">
        <h3>5-Day Forecast:</h3>
        <div className="forecast-container">
          {forecastData
            .filter((item, index) => index % 8 === 0)
            .slice(0, 5)
            .map((day) => (
              <div className="day" key={day.dt}>
                <p className="day-name">{formatDay(day.dt)}</p>

                <img
                  className="day-icon"
                  src={`https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png`}
                  alt={day.weather[0].description}
                />

                <p className="day-temperature">
                  {Math.round(day.main.temp_min)}° /{" "}
                  <span>{Math.round(day.main.temp_max)}°</span>
                </p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default Forecast;
