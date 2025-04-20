import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import EmployeeList from './components/EmployeeList';
import ProjectList from './components/ProjectList';
import TaskList from './components/TaskList';
import './App.css';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <Router>
      <div className="app-container">
        <button className="hamburger-menu" onClick={toggleMenu}>
          ☰
        </button>
        <nav className={`sidebar ${isMenuOpen ? 'open' : ''}`}>
          <ul>
            <li>
              <Link to="/employees" onClick={() => setIsMenuOpen(false)}>
                Employees
              </Link>
            </li>
            <li>
              <Link to="/projects" onClick={() => setIsMenuOpen(false)}>
                Projects
              </Link>
            </li>
            <li>
              <Link to="/tasks" onClick={() => setIsMenuOpen(false)}>
                Tasks
              </Link>
            </li>
          </ul>
        </nav>
        <div className="main-content">
          <Routes>
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/projects" element={<ProjectList />} />
            <Route path="/tasks" element={<TaskList />} />
            {/* Ruta por defecto (puedes cambiarla si lo deseas) */}
            <Route path="/" element={<ProjectList />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;