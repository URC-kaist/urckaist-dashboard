import React from 'react';
import ScienceMission from './ScienceMission';
import Stratigraphy from './Stratigraphy';
import './Science.css';
import Panorama from './Panorama/Panorama';

const Science: React.FC = () => {
  return <section className="science-main">
    <div className="panorama-container">
      <Panorama />
    </div>
    <div className="science-mission">
      <ScienceMission />
    </div>
    <div className="stratigraphy">
      <Stratigraphy />
    </div>
    <div className="soil">
      Soil
    </div>
    <div className="pump">
      pump
    </div>
  </section>;
};

export default Science;
