import React from 'react';
import EmployeeList from './EmployeeList';
import ProjectList from './ProjectList';
import TaskList from './TaskList';

function MainContent({ activeSection }) {
  switch (activeSection) {
    case 'Employees':
      return <EmployeeList />;
    case 'Projects':
      return <ProjectList />;
    case 'Tasks':
      return <TaskList />;
    default:
      return <ProjectList />;
  }
}

export default MainContent;