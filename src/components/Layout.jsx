import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaExchangeAlt, FaTags, FaBars, FaTimes } from 'react-icons/fa';

export function Layout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FaHome /> },
    { path: '/transactions', label: 'Transactions', icon: <FaExchangeAlt /> },
    { path: '/categories', label: 'Categories', icon: <FaTags /> },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">Budget Tracker</h1>
          
          <button 
            className="md:hidden text-gray-700 hover:text-gray-900 cursor-pointer"
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50 md:hidden" onClick={toggleMobileMenu}>
            <div className="absolute right-0 top-0 h-full w-64 bg-white shadow-lg" onClick={e => e.stopPropagation()}>
              <div className="p-4">
                <button 
                  className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 cursor-pointer"
                  onClick={toggleMobileMenu}
                  aria-label="Close menu"
                >
                  <FaTimes size={24} />
                </button>
                <div className="mt-8">
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <li key={item.path}>
                        <NavLink
                          to={item.path}
                          className={({ isActive }) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg ${
                              isActive
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`
                          }
                          onClick={toggleMobileMenu}
                        >
                          <span className="text-lg">{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Desktop sidebar */}
        <nav className="hidden md:block bg-white shadow-sm w-64 fixed h-[calc(100vh-64px)]">
          <div className="px-4 py-6">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-lg ${
                        isActive
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`
                    }
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        <main className="flex-1 p-4 md:p-6 md:ml-64">
          <div className="container mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      
      <footer className="mt-auto bg-white border-t border-gray-200 py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          <div className="flex items-center justify-center">
            <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-gray-800">
              Made on ZAPT
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}