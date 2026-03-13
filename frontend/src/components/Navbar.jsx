import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaLeaf, FaSignOutAlt } from 'react-icons/fa';
import { authService } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout failed', err);
    }
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-soft sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <FaLeaf className="text-secondary text-2xl" />
            <span className="font-semibold text-xl text-primary tracking-tight">NatureJournal</span>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-primary transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
