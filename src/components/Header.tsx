import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiBell, FiLogOut } from 'react-icons/fi';

const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-primary-600">MeducateNow</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <FiBell className="h-5 w-5 text-gray-600" />
            </button>
            <div className="relative">
              <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
                <span className="text-sm font-medium text-gray-700">{user?.full_name}</span>
                <FiUser className="h-5 w-5 text-gray-600" />
              </button>
            </div>
            <button 
              onClick={() => signOut()}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <FiLogOut className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
