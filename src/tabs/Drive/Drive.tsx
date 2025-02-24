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
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number } | null>(null);

  const addWaypoint = () => {
    const lat = parseFloat(newLat);
    const lng = parseFloat(newLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setWaypoints([...waypoints, { lat, lng }]);
      setNewLat("");
      setNewLng("");
    }
  };

  const addWaypointFromCenter = () => {
    if (mapCenter) {
      setWaypoints([...waypoints, { lat: mapCenter.lat, lng: mapCenter.lng }]);
    }
  };

  const deleteWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  return (
    <section className="drive-main">
      <main className="map">
        <Map
          waypoints={waypoints}
          onCenterChange={(center) => setMapCenter({ lat: center.lat, lng: center.lng })}
        />
      </main>
      <aside className="controls">
        <h2>Add Waypoint</h2>
        <div className="waypoint-editor">
          <div className="form-group">
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
          </div>
          <div className="form-group">
            <button onClick={addWaypoint}>Add Waypoint</button>
          </div>
          <div className="form-group center-group">
            <button onClick={addWaypointFromCenter}>Add Waypoint from Map Center</button>
            {mapCenter && (
              <span className="center-coord">
                Lat: {mapCenter.lat.toFixed(4)}, Lng: {mapCenter.lng.toFixed(4)}
              </span>
            )}
          </div>
        </div>
        <h3>Waypoints</h3>
        <ul className="waypoint-list">
          {waypoints.map((wp, index) => (
            <li key={index} className="waypoint-item">
              <span>
                {index + 1}: Lat: {wp.lat.toFixed(4)}, Lng: {wp.lng.toFixed(4)}
              </span>
              <button className="delete-button" onClick={() => deleteWaypoint(index)}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
};

export default Drive;
