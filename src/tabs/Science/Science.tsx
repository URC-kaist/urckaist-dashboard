import React, { useState, useEffect } from "react";
import { useROS } from "../../ROSContext";
import ROSLIB from "roslib";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import ToggleSwitch from "../../components/DevModeToggle/DevModeToggle";

import PanoramicImage from './public/pamorama_example.jpeg';

const Science: React.FC = () => {
  const { ros } = useROS();

  return <div>
    
    <img src={PanoramicImage} alt="Panoramic Image from Rover" className="panoramic-image"/>
    
  </div>;
};

export default Science;
