import React, { useState } from 'react';
import './Sidebar.css';

function SideBar({ onNavigate }) {
  const [activeItem, setActiveItem] = useState('Projects');

  const handleClick = (item) => {
    setActiveItem(item);
    onNavigate(item);
  };

  return (
    <div className="sideBar">
      <div
        className={`sideBar-item ${activeItem === 'Employees' ? 'active' : ''}`}
        onClick={() => handleClick('Employees')}
      >
        Employees
      </div>
      <div
        className={`sideBar-item ${activeItem === 'Projects' ? 'active' : ''}`}
        onClick={() => handleClick('Projects')}
      >
        Projects
      </div>
      <div
        className={`sideBar-item ${activeItem === 'Tasks' ? 'active' : ''}`}
        onClick={() => handleClick('Tasks')}
      >
        Tasks
      </div>
    </div>
  );
}

export default SideBar;