import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('Projects');

  const handleNavigation = (section) => {
    setActiveSection(section);
  };

  return (
    <div className="app-container">
      <Sidebar onNavigate={handleNavigation} />
      <div className="main-content">
        <MainContent activeSection={activeSection} />
      </div>
    </div>
  );
}

export default App;