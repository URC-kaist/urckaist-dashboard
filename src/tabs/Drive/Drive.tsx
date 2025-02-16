import React, { useState, useEffect } from "react";
import "./Drive.css";
import Map from "components/Map";

const Drive: React.FC = () => {
  return <section className="drive-main">
    <main className="map">
      <Map />
    </main>
    <aside className="controls">
      Controls
    </aside>
  </section>;
};

export default Drive;
