import React from 'react';
import ScienceMission from './ScienceMission';
import './Science.css';

const Science: React.FC = () => {
  return <section className="science-main">
    <div className="panoramic">
      Panorama
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
