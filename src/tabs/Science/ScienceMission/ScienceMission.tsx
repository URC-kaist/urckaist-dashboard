import React from 'react';
import './ScienceMission.css';
import SpinningObject from 'components/SpinningObject';
import SpinningObject2 from 'components/SpinningObject2';
import SpinningObject3 from 'components/SpinningObject3';

const ScienceMission: React.FC = () => {
  return <div className='container3d'>
    <div className='column1'>
      <SpinningObject3 />
    </div>
    <div className='column2'>
      <svg className='arrow' width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon className="blinking-arrow" points="20,10 80,50 20,90" fill="black" />
      </svg>
    </div>
    <div className='column3'>
      <SpinningObject />
    </div>
    <div className='column4'>
      <svg className='arrow' width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon className="blinking-arrow" points="20,10 80,50 20,90" fill="black" />
      </svg>
    </div>
    <div className='column5'>
      <SpinningObject2 />
    </div>
    
  </div>;
};

export default ScienceMission;
