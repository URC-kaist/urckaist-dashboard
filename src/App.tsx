import React from 'react';
import { ROSProvider } from './ROSContext';
import './App.css';
import MainPage from './MainPage';

const App: React.FC = () => {
  return (
    <ROSProvider>
      <MainPage />
    </ROSProvider>
  );
};

export default App;
