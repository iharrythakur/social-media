import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiHome, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { userProfile, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-secondary-200">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-secondary-900">Social Platform</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <FiHome className="w-4 h-4" />
              <span>Home</span>
            </Link>
            
            <Link 
              to="/profile" 
              className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <FiUser className="w-4 h-4" />
              <span>Profile</span>
            </Link>
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <img 
                src={userProfile?.profile_picture_url || 'https://via.placeholder.com/40x40?text=U'} 
                alt="Profile" 
                className="avatar"
              />
              <span className="text-secondary-900 font-medium">{userProfile?.name}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="text-secondary-600 hover:text-red-600 transition-colors duration-200 flex items-center space-x-1"
            >
              <FiLogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-secondary-600 hover:text-secondary-900 hover:bg-secondary-100 transition-colors duration-200"
          >
            {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiHome className="w-4 h-4" />
                <span>Home</span>
              </Link>
              
              <Link 
                to="/profile" 
                className="text-secondary-600 hover:text-primary-600 transition-colors duration-200 flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <FiUser className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              
              <div className="flex items-center space-x-3 py-2">
                <img 
                  src={userProfile?.profile_picture_url || 'https://via.placeholder.com/40x40?text=U'} 
                  alt="Profile" 
                  className="avatar"
                />
                <span className="text-secondary-900 font-medium">{userProfile?.name}</span>
              </div>
              
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="text-secondary-600 hover:text-red-600 transition-colors duration-200 flex items-center space-x-2"
              >
                <FiLogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 