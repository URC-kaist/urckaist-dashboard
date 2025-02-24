import React, { useState, useEffect } from "react";
import { useROS } from "../../ROSContext";
import './Science.css';

import PanoramicImage from './public/panorama_example.jpeg';
import Scale from './public/scale.png';

const Science: React.FC = () => {
  const { ros } = useROS();

  return <div>
    <div className="panorama">
        <img src={PanoramicImage} alt="Panoramic Image from Rover" className="panoramic-image"/> 
        <img src={Scale} className="scale"/>
    </div>
    
    
  </div>;
};

export default Science;
