import React from "react";
import "./Pump.css";
import pumpImage from "./public/IMG_1226.png";

const Pump: React.FC = () => {
  return <div className="pump-grid">
    <div className="pump-status">
      <h3>Pump: Running</h3>
    </div>
    <div className="pump-image">
      <img src={pumpImage} alt="Pump Image" />
    </div>
    <div className="pump-start">
      Start
    </div>
    <div className="pump-stop">
      Stop
    </div>
    <div className="next-sample">
      <p>{"Next >"}</p>
    </div>
    <div className="prev-sample">
      <p>{"< Prev"}</p>
    </div>

  </div>;
};

export default Pump;
