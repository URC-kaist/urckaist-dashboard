import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Map.css";
import L, { latLng } from "leaflet";

type Waypoint = {
  lat: number;
  lng: number;
};

interface MapProps {
  waypoints: Waypoint[];
  onCenterChange?: (center: L.LatLng) => void;
}

function MapCenterUpdater({ onCenterChange }: { onCenterChange: (center: L.LatLng) => void }) {
  useMapEvents({
    moveend: (e) => {
      onCenterChange(e.target.getCenter());
    }
  });
  return null;
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

const Map: React.FC<MapProps> = ({ waypoints, onCenterChange }) => {
  // Default center: first waypoint if available, otherwise a preset coordinate (London)
  const center = waypoints.length > 0 ? [waypoints[0].lat, waypoints[0].lng] : [51.505, -0.09];

  return (
    <div className="map-container">
      <MapContainer center={latLng(center[0], center[1])} zoom={13} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        {onCenterChange && <MapCenterUpdater onCenterChange={onCenterChange} />}
        <TileLayer url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}" />
        {waypoints.map((wp, index) => (
          <Marker
            key={index}
            position={[wp.lat, wp.lng]}
            icon={createNumberedIcon(index + 1)}
          >
            <Popup>
              Waypoint {index + 1}: ({wp.lat.toFixed(4)}, {wp.lng.toFixed(4)})
            </Popup>
          </Marker>
        ))}
        {waypoints.length > 1 && (
          <Polyline positions={waypoints.map((wp) => [wp.lat, wp.lng])} color="white" />
        )}
      </MapContainer>
      <div className="crosshair"></div>
    </div>
  );
};

export default Map;

