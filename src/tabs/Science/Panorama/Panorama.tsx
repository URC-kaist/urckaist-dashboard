import React from 'react';
import PanoramicImage from './public/panorama_example.jpeg';
import Scale from './public/scale.png';
import './Panorama.css';

const Panorama: React.FC = () => {
  return <div className="panorama">
    <img src={PanoramicImage} alt="Panoramic Image from Rover" className="panoramic-image" />
    <img src={Scale} className="scale" />
  </div>;
};

export default Panorama;
