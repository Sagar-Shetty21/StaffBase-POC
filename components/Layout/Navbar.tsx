import React from 'react';
import styles from './Navbar.module.scss';
import { NavLink } from 'react-router';

const Navbar: React.FC = () => {
  return (
    <nav className={styles.navbar}>
      <NavLink  to="/" className={styles.logo}>StaffBase</NavLink>
      <ul className={styles.navLinks}>
        <li>
          <NavLink to="/employees" className={styles.link} style={({isActive, isPending, isTransitioning}) => ({color: isActive ? "#007bff" : "white"})}>Employee List</NavLink>
        </li>
        <li>
          <NavLink to="/add" className={styles.link} style={({isActive, isPending, isTransitioning}) => ({color: isActive ? "#007bff" : "white"})}>Add New Employee</NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
