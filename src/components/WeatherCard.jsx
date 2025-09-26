const WeatherCard = ({ weather }) => {
  return (
    <div className="mt-6 bg-white/20 p-4 rounded-lg text-center">
      <h2 className="text-xl font-bold">{weather.city}, {weather.country}</h2>
      <p>Temperature: {weather.temperature} °C</p>
      <p>Wind Speed: {weather.windspeed} km/h</p>
      <p>Condition: {weather.description}</p>
    </div>
  );
};

export default WeatherCard;
