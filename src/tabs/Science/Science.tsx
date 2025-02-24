import React from 'react';
import ScienceMission from './ScienceMission';
import Stratigraphy from './Stratigraphy';
import './Science.css';
import Panorama from './Panorama/Panorama';
import Soil from './Soil';
import Pump from './Pump';

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
      <Soil />
    </div>
    <div className="pump">
      <Pump />
    </div>
  </section>;
};

export default Science;
