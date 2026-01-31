import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchEngine from "./SearchEngine";
import Forecast from "./Forecast";

import "../styles.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const [query, setQuery] = useState("London"); // Default city
  const [weather, setWeather] = useState({
    loading: true,
    data: {},
    error: false,
  });

  const fetchWeather = async (city) => {
    try {
      const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

      const res = await axios.get(url);

      const formattedData = {
        city: res.data.name,
        country: res.data.sys.country,
        temperature: {
          current: res.data.main.temp,
          humidity: res.data.main.humidity,
        },
        condition: {
          description: res.data.weather[0].description,
          icon_url: `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`,
        },
        wind: {
          speed: res.data.wind.speed,
        },
      };

      setWeather({ data: formattedData, loading: false, error: false });
    } catch (error) {
      setWeather({ data: {}, loading: false, error: true });
      console.error("Error fetching weather data:", error);
    }
  };

  const search = async (event) => {
    event.preventDefault();

    if (!query.trim()) return; // prevent empty search

    if (
      event.type === "click" ||
      (event.type === "keypress" && event.key === "Enter")
    ) {
      setWeather({ ...weather, loading: true });
      fetchWeather(query);
    }
  };

  useEffect(() => {
    fetchWeather(query);
  }, []); // only once on load

  return (
    <div className="App">
      <SearchEngine query={query} setQuery={setQuery} search={search} />

      {weather.loading && <h4>Searching...</h4>}

      {weather.error && (
        <span className="error-message">
          Sorry, city not found. Please try again.
        </span>
      )}

      {weather.data && weather.data.condition && (
        <Forecast weather={weather} />
      )}
    </div>
  );
}

export default App;
