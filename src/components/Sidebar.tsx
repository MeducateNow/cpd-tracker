import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FiHome, 
  FiVideo, 
  FiAward, 
  FiCheckSquare, 
  FiUser 
} from 'react-icons/fi';

const Sidebar = () => {
  const navItems = [
    { path: '/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/webinars', icon: <FiVideo />, label: 'Webinars' },
    { path: '/certificates', icon: <FiAward />, label: 'Certificates' },
    { path: '/accreditation', icon: <FiCheckSquare />, label: 'Accreditation' },
    { path: '/profile', icon: <FiUser />, label: 'Profile' },
  ];

  return (
    <aside className="w-64 bg-primary-700 text-white">
      <div className="p-6">
        <h2 className="text-2xl font-bold">CPD Tracker</h2>
      </div>
      <nav className="mt-6">
        <ul>
          {navItems.map((item) => (
            <li key={item.path} className="px-6 py-2">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-600 text-white'
                      : 'text-primary-100 hover:bg-primary-600 hover:text-white'
                  }`
                }
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
