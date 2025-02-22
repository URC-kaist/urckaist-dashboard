import React, { useState } from "react";
import "./Drive.css";
import Map from "components/Map";

type Waypoint = {
  lat: number;
  lng: number;
};

const Drive: React.FC = () => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [newLat, setNewLat] = useState("");
  const [newLng, setNewLng] = useState("");

  const addWaypoint = () => {
    const lat = parseFloat(newLat);
    const lng = parseFloat(newLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setWaypoints([...waypoints, { lat, lng }]);
      setNewLat("");
      setNewLng("");
    }
  };

  return (
    <section className="drive-main">
      <main className="map">
        <Map waypoints={waypoints} />
      </main>
      <aside className="controls">
        <h2>Waypoint Editor</h2>
        <div className="waypoint-editor">
          <input
            type="text"
            placeholder="Latitude"
            value={newLat}
            onChange={(e) => setNewLat(e.target.value)}
          />
          <input
            type="text"
            placeholder="Longitude"
            value={newLng}
            onChange={(e) => setNewLng(e.target.value)}
          />
          <button onClick={addWaypoint}>Add Waypoint</button>
        </div>
        <h3>Waypoints</h3>
        <ul>
          {waypoints.map((wp, index) => (
            <li key={index}>
              {index + 1}: ({wp.lat}, {wp.lng})
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
};

export default Drive;
