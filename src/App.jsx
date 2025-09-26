import { useState } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import video from "./video.mp4";

const getWeatherDescription = (code) => {
  const map = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Drizzle: Light",
    53: "Drizzle: Moderate",
    55: "Drizzle: Dense",
    56: "Freezing drizzle: Light",
    57: "Freezing drizzle: Dense",
    61: "Rain: Slight",
    63: "Rain: Moderate",
    65: "Rain: Heavy",
    66: "Freezing rain: Light",
    67: "Freezing rain: Heavy",
    71: "Snow fall: Slight",
    73: "Snow fall: Moderate",
    75: "Snow fall: Heavy",
    77: "Snow grains",
    80: "Rain showers: Slight",
    81: "Rain showers: Moderate",
    82: "Rain showers: Violent",
    85: "Snow showers: Slight",
    86: "Snow showers: Heavy",
    95: "Thunderstorm: Slight or moderate",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail",
  };
  return map[code] || "Unknown";
};

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = `https://api.open-meteo.com/v1/forecast`;

  const fetchWeather = async (city) => {
    setLoading(true);
    setError("");
    try {
      
      const geoResponse = await axios.get(                                              //Getting coordinates for city
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
      );

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        setError("City not found. Please try again.");
        setWeather(null);
        setLoading(false);
        return;
      }

      const { latitude, longitude, name, country } = geoResponse.data.results[0];

      // Fetch current weather
      const weatherResponse = await axios.get(
        `${API_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      );

      
      const currentWeather = {
        ...weatherResponse.data.current_weather,
        city: name,
        country: country,
        description: getWeatherDescription(weatherResponse.data.current_weather.weathercode),
      };

      setWeather(currentWeather);
    }
    catch (err) {
  console.error("Error fetching weather:", err);
  setError("An error occurred. Please try again later.");
  setWeather(null);
}

   finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-100 relative overflow-hidden">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src={video} type="video/mp4" />
        Your browser does not support the video tag
      </video>
      <div className="absolute top-0 left-0 w-full h-full bg-black/20 z-1"></div>
      <div className="bg-black/70 text-white rounded-lg shadow-lg p-8 max-w-md w-full z-10">
        <h1 className="text-3xl font-bold text-center mb-6">Weather App</h1>
        <SearchBar fetchWeather={fetchWeather} />
        {loading && <p className="text-center mt-4">Loading...</p>}
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        {weather && <WeatherCard weather={weather} />}
      </div>
    </div>
  );
}

export default App;
