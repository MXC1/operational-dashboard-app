import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/" onClick={() => console.log('Navigating to Dashboard')}>Dashboard</Link>
        </li>
        <li>
          <Link to="/completion-log" onClick={() => console.log('Navigating to Completion Log')}>Completion Log</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
