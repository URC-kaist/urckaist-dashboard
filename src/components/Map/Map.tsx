import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import './Map.css';

export const Map = () => {
  return <div className="map-container">
    <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={true} style={{
      height: "100%",
      width: "100%",
    }}>
      <TileLayer
        url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
      />
      <Marker position={[51.505, -0.09]}>
        <Popup>
          A pretty CSS3 popup. <br /> Easily customizable.
        </Popup>
      </Marker>
    </MapContainer>
  </div>;
}

export default Map
