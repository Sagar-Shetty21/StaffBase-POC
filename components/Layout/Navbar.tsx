import React, { useState } from "react";
import { NavLink } from "react-router";
import {
  Users,
  UserPlus,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  HelpCircle,
} from "lucide-react";
import styles from "./Navbar.module.scss";
import { useGlobalSearch } from "utils/contexts/GlobalSearchContext";

const Navbar = () => {
  const { search, setSearch, setIsActive } = useGlobalSearch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsNotificationDropdownOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsProfileDropdownOpen(false);
  };

  const notifications = [
    {
      id: 1,
      text: "New employee Sarah Johnson added",
      time: "5 min ago",
      unread: true,
    },
    {
      id: 2,
      text: "Salary review completed for Marketing dept",
      time: "1 hour ago",
      unread: true,
    },
    {
      id: 3,
      text: "Monthly report ready for download",
      time: "2 hours ago",
      unread: false,
    },
  ];

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarContainer}>
        {/* Logo */}
        <NavLink to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <Users size={24} />
          </div>
          <span>StaffBase</span>
        </NavLink>

        {/* Search Bar (Desktop) */}
        <div className={styles.searchContainer}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search employees, departments..."
            className={styles.searchInput}
            value={search}
            onFocus={() => setIsActive(true)}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Desktop Navigation */}
        <ul className={styles.navLinks}>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <BarChart3 size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/employees"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <Users size={18} />
              <span>Employee List</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/add"
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ""}`
              }
            >
              <UserPlus size={18} />
              <span>Add Employee</span>
            </NavLink>
          </li>
        </ul>

        {/* Right Side Actions */}
        <div className={styles.rightActions}>
          {/* Notifications */}
          <div className={styles.dropdown}>
            <button
              className={styles.iconButton}
              onClick={toggleNotificationDropdown}
            >
              <Bell size={20} />
              {unreadCount > 0 && (
                <span className={styles.badge}>{unreadCount}</span>
              )}
            </button>

            {isNotificationDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <h4>Notifications</h4>
                  <span className={styles.markAllRead}>Mark all read</span>
                </div>
                <div className={styles.notificationList}>
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`${styles.notificationItem} ${notification.unread ? styles.unread : ""}`}
                    >
                      <div className={styles.notificationText}>
                        {notification.text}
                      </div>
                      <div className={styles.notificationTime}>
                        {notification.time}
                      </div>
                      {notification.unread && (
                        <div className={styles.unreadDot}></div>
                      )}
                    </div>
                  ))}
                </div>
                <div className={styles.dropdownFooter}>
                  <button className={styles.viewAll}>
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className={styles.dropdown}>
            <button
              className={styles.profileButton}
              onClick={toggleProfileDropdown}
            >
              <div className={styles.profileAvatar}>
                <User size={18} />
              </div>
              <div className={styles.profileInfo}>
                <span className={styles.profileName}>John Doe</span>
                <span className={styles.profileRole}>HR Manager</span>
              </div>
              <ChevronDown size={16} className={styles.chevron} />
            </button>

            {isProfileDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.profileMenuHeader}>
                  <div className={styles.profileAvatar}>
                    <User size={20} />
                  </div>
                  <div>
                    <div className={styles.profileName}>John Doe</div>
                    <div className={styles.profileEmail}>
                      john.doe@company.com
                    </div>
                  </div>
                </div>
                <div className={styles.dropdownDivider}></div>
                <div className={styles.menuItems}>
                  <button className={styles.menuItem}>
                    <User size={16} />
                    <span>Profile Settings</span>
                  </button>
                  <button className={styles.menuItem}>
                    <Settings size={16} />
                    <span>Preferences</span>
                  </button>
                  <button className={styles.menuItem}>
                    <HelpCircle size={16} />
                    <span>Help & Support</span>
                  </button>
                </div>
                <div className={styles.dropdownDivider}></div>
                <button className={styles.menuItem}>
                  <LogOut size={16} />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={styles.mobileMenuToggle}
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileSearchContainer}>
            <Search size={20} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search employees..."
              className={styles.searchInput}
            />
          </div>

          <ul className={styles.mobileNavLinks}>
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.active : ""}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <BarChart3 size={20} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/employees"
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.active : ""}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users size={20} />
                <span>Employee List</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/add"
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.active : ""}`
                }
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserPlus size={20} />
                <span>Add Employee</span>
              </NavLink>
            </li>
          </ul>

          <div className={styles.mobileProfile}>
            <div className={styles.profileAvatar}>
              <User size={20} />
            </div>
            <div className={styles.profileInfo}>
              <span className={styles.profileName}>John Doe</span>
              <span className={styles.profileRole}>HR Manager</span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
