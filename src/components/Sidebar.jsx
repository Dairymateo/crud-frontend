import React, { useState } from 'react';
//import './Sidebar.css';

function Sidebar({ onNavigate }) {
  const [activeItem, setActiveItem] = useState('Projects');

  const handleClick = (item) => {
    setActiveItem(item);
    onNavigate(item);
  };

  return (
    <div className="sidebar">
      <div
        className={`sidebar-item ${activeItem === 'Employees' ? 'active' : ''}`}
        onClick={() => handleClick('Employees')}
      >
        Employees
      </div>
      <div
        className={`sidebar-item ${activeItem === 'Projects' ? 'active' : ''}`}
        onClick={() => handleClick('Projects')}
      >
        Projects
      </div>
      <div
        className={`sidebar-item ${activeItem === 'Tasks' ? 'active' : ''}`}
        onClick={() => handleClick('Tasks')}
      >
        Tasks
      </div>
    </div>
  );
}

export default Sidebar;