import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function App() {
  const [station, setStation] = useState("");
  const [aqi, setAqi] = useState(null);
  const [inputCity, setInputCity] = useState("");
  const [history, setHistory] = useState([]);

  const fetchAQI = (cityName) => {
    fetch(`https://api.waqi.info/feed/${cityName}/?token=demo`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setAqi(data.data.aqi);
          setStation(data.data.city.name);

          // Extract PM2.5 history
          const pm25History =
            data.data.forecast?.daily?.pm25?.map((item) => ({
              day: item.day,
              value: item.avg,
            })) || [];

          setHistory(pm25History);
        } else {
          alert("City not found or data unavailable");
        }
      })
      .catch(() => {
        alert("Error fetching AQI data");
      });
  };

  useEffect(() => {
    fetchAQI("shanghai");
  }, []);

  const getAqiStatus = (aqi) => {
    if (aqi <= 50) return "Good 😊";
    if (aqi <= 100) return "Moderate 😐";
    if (aqi <= 200) return "Unhealthy 😷";
    if (aqi <= 300) return "Very Unhealthy 🤢";
    return "Hazardous ☠️";
  };

  const getBackgroundColor = (aqi) => {
    if (aqi <= 50) return "#9cff9c";
    if (aqi <= 100) return "#ffff99";
    if (aqi <= 200) return "#ffb366";
    if (aqi <= 300) return "#ff6666";
    return "#b30000";
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
        backgroundColor: aqi ? getBackgroundColor(aqi) : "white",
        minHeight: "100vh",
      }}
    >
      <h1>Air Quality Visualizer</h1>

      <input
        type="text"
        placeholder="Enter city name"
        value={inputCity}
        onChange={(e) => setInputCity(e.target.value)}
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <button onClick={() => fetchAQI(inputCity.trim().toLowerCase())}>
        Search
      </button>

      <hr />

      {aqi === null ? (
        <p>Loading AQI data...</p>
      ) : (
        <>
          <h2>Monitoring Station: {station}</h2>
          <h2>AQI: {aqi}</h2>
          <h3>Status: {getAqiStatus(aqi)}</h3>

          <h3>PM2.5 Trend (Daily)</h3>

          {history.length === 0 ? (
            <p>No historical data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={history}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#000"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </>
      )}
    </div>
  );
}

export default App;
