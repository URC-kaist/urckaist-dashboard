import React from 'react';
import ScienceMission from './ScienceMission';
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
    <div className="science-data">
      ScienceData
    </div>
  </section>;
};

export default Science;
