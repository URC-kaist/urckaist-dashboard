import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import L, { latLng } from "leaflet";

type Waypoint = {
  lat: number;
  lng: number;
};

interface MapProps {
  waypoints: Waypoint[];
}

const createNumberedIcon = (number: number) => {
  return L.divIcon({
    html: `<div style="
      background-color: white; 
      border: 1px solid black; 
      border-radius: 50%; 
      width: 24px; 
      height: 24px; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      font-size: 12px;">
        ${number}
      </div>`,
    className: "",
    iconSize: [24, 24],
  });
};

const Map: React.FC<MapProps> = ({ waypoints }) => {
  // Use first waypoint as center if available, otherwise default to London
  const center =
    waypoints.length > 0 ? [waypoints[0].lat, waypoints[0].lng] : [51.505, -0.09];

  return (
    <div className="map-container">
      <MapContainer
        center={latLng(center[0], center[1])}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
        {waypoints.map((wp, index) => (
          <Marker
            key={index}
            position={[wp.lat, wp.lng]}
            icon={createNumberedIcon(index + 1)}
          >
            <Popup>
              Waypoint {index + 1}: ({wp.lat}, {wp.lng})
            </Popup>
          </Marker>
        ))}
        {waypoints.length > 1 && (
          <Polyline
            positions={waypoints.map((wp) => [wp.lat, wp.lng])}
            color="blue"
          />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
