import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// ---------- AQI marker (CSS-based, NO images) ----------
const createAQIMarker = () =>
  L.divIcon({
    html: `<div style="
      background-color:#1976d2;
      width:18px;
      height:18px;
      border-radius:50%;
      border:3px solid white;
      box-shadow:0 0 6px rgba(0,0,0,0.6);
    "></div>`,
    className: "",
  });

// ---------- AQI status + health advice ----------
const getAqiInfo = (aqi) => {
  if (aqi <= 50) return { status: "Good", advice: "Enjoy outdoor activities 😊" };
  if (aqi <= 100) return { status: "Moderate", advice: "Sensitive people should limit prolonged exertion 😐" };
  if (aqi <= 200) return { status: "Unhealthy", advice: "Avoid prolonged outdoor exertion 😷" };
  if (aqi <= 300) return { status: "Very Unhealthy", advice: "Stay indoors, wear a mask 🤢" };
  return { status: "Hazardous", advice: "Emergency conditions ☠️" };
};

// Temporary city → coordinates mapping (prototype only)
const CITY_COORDS = {
  tokyo: [35.6895, 139.6917],
  beijing: [39.9042, 116.4074],
  delhi: [28.6139, 77.2090],
  london: [51.5074, -0.1278],
  paris: [48.8566, 2.3522],
  newyork: [40.7128, -74.0060],
};


function App() {
  const [inputCity, setInputCity] = useState("tokyo");
  const [aqi, setAqi] = useState(null);
  const [station, setStation] = useState("");
  const [coords, setCoords] = useState([35.6895, 139.6917]); // default Tokyo

  const fetchAQI = (cityName) => {
    const key = cityName.replace(/\s+/g, "").toLowerCase();

    // 1️⃣ Move map based on city search (always works)
    if (CITY_COORDS[key]) {
      setCoords(CITY_COORDS[key]);
    } else {
      alert("City not in demo list. Try: tokyo, delhi, london");
    }
    // 2️⃣ Fetch AQI (may map to nearest station)
    fetch(`https://api.waqi.info/feed/${cityName}/?token=demo`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "ok") {
          setAqi(data.data.aqi);
          setStation(data.data.city.name);
        }
      })
      .catch(() => alert("Error fetching AQI data"));
  };


  // Load default city once
  useEffect(() => {
    fetchAQI("tokyo");
    // eslint-disable-next-line
  }, []);

  const aqiInfo = aqi !== null ? getAqiInfo(aqi) : null;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Air Quality Visualizer</h1>

      <input
        value={inputCity}
        onChange={(e) => setInputCity(e.target.value)}
        placeholder="Enter city (e.g. tokyo)"
        style={{ padding: "8px", marginRight: "10px" }}
      />

      <button onClick={() => fetchAQI(inputCity.trim().toLowerCase())}>
        Search
      </button>

      <hr />

      {aqi !== null && (
        <>
          <h3>Monitoring Station: {station}</h3>
          <h3>AQI: {aqi}</h3>
          <h3>Status: {aqiInfo.status}</h3>
          <p><strong>Health Advice:</strong> {aqiInfo.advice}</p>

          <p style={{ fontSize: "0.9em", color: "#555" }}>
            ℹ️ AQI shown is from the nearest available monitoring station.
            City-level real-time accuracy will be enabled using official
            authenticated sources in the final version.
          </p>

          {/* key forces map to update location */}
          <MapContainer
            key={`${coords[0]}-${coords[1]}`}
            center={coords}
            zoom={10}
            style={{ height: "400px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="© OpenStreetMap contributors"
            />

            <Marker position={coords} icon={createAQIMarker()}>
              <Popup>
                <strong>{station}</strong>
                <br />
                AQI: {aqi}
                <br />
                {aqiInfo.status}
              </Popup>
            </Marker>
          </MapContainer>
        </>
      )}
    </div>
  );
}

export default App;
