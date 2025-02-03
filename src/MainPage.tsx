import React, { useState } from 'react';
import ConnectionForm from './tabs/ConnectionForm';
import Dashboard from './tabs/Dashboard';
import Drive from './tabs/Drive';
import './MainPage.css';
import { useROS } from './ROSContext';

type page = 'Dashboard' | 'Drive';

const MainPage: React.FC = () => {
  const { ros } = useROS();
  const tabs: page[] = ['Dashboard', 'Drive'];


  const { status } = useROS();
  const [page, setPage] = useState<page>('Dashboard');

  const pageComponent = (page: page) => {
    switch (page) {
      case 'Dashboard':
        return <Dashboard />;
      case 'Drive':
        return <Drive />;
    }
  }

  if (status === 'Connected') {
    return <div className="main-page">
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
      <div className="tab-content">
        {pageComponent(page)}
      </div>
    </div>
  }
  return <ConnectionForm />;
};

export default MainPage;
