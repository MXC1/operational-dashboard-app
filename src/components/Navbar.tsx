import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/" onClick={() => console.log('Navigating to /')}>Dashboard</Link>
        </li>
        <li>
          <Link to="/completion-log" onClick={() => console.log('Navigating to /completion-log')}>Completion Log</Link>
        </li>
        <li>
          <Link to="/task-configuration" onClick={() => console.log('Navigating to /task-configuration')}>Task Configuration</Link>
        </li>
        <li>
          <Link to="/new-task-form" onClick={() => console.log('Navigating to /new-task-form')}>Add new task</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
