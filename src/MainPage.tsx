import React, { useState } from 'react';
import ROSConnectionForm from './ROSConnectionForm';
import Dashboard from './Dashboard';
import Calibrate from './Calibrate';
import { useROS } from './ROSContext';

type page = 'Dashboard' | 'Calibrate';

const MainPage: React.FC = () => {
  const { ros } = useROS();
  const tabs: page[] = ['Dashboard', 'Calibrate'];


  const { status } = useROS();
  const [page, setPage] = useState<page>('Dashboard');
  const pageComponent = (page: page) => {
    switch (page) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Calibrate':
        return <Calibrate />;
    }
  }


  if (status === 'Connected') {
    return <div className="dashboard-container">
      <header className="tab-bar">
        {tabs.map((tab) => (
          <button
            key={tab}
            className={`tab-item  ${tab === page ? 'active' : ''}`}
            onClick={() => setPage(tab)}
          >
            {tab}
          </button>
        ))}
        <button
          onClick={() => ros?.close()}
          className="disconnect-button"
        >Disconnect</button>
      </header>
      {pageComponent(page)}
    </div>
  }
  return <ROSConnectionForm />;
};

export default MainPage;
