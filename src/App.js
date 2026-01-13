import { useEffect, useState } from "react";

function App() {
  const [aqi, setAqi] = useState(null);
  const [city, setCity] = useState("");

  useEffect(() => {
    fetch("https://api.waqi.info/feed/shanghai/?token=demo")
      .then((res) => res.json())
      .then((data) => {
        setAqi(data.data.aqi);
        setCity(data.data.city.name);
      });
  }, []);

  const getAqiStatus = (aqi) => {
    if (aqi <= 50) return "Good 😊";
    if (aqi <= 100) return "Moderate 😐";
    if (aqi <= 200) return "Unhealthy 😷";
    if (aqi <= 300) return "Very Unhealthy 🤢";
    return "Hazardous ☠️";
  };

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Air Quality Visualizer</h1>

      {aqi === null ? (
        <p>Loading AQI data...</p>
      ) : (
        <>
          <h2>City: {city}</h2>
          <h2>AQI: {aqi}</h2>
          <h3>Status: {getAqiStatus(aqi)}</h3>
        </>
      )}
    </div>
  );
}

export default App;
