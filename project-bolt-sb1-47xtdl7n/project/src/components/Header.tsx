import React, { useState } from 'react';
import { Search, Menu, X, ChevronDown } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="text-2xl font-bold text-red-600">IESE</div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-8">
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
                Programas <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
                Investigación <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-red-600 transition-colors">
                Conocimiento <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
            <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Alumni</a>
            <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Empresas</a>
            <a href="#" className="text-gray-700 hover:text-red-600 transition-colors">Campus</a>
          </nav>

          {/* Search and Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-500 hover:text-red-600 transition-colors"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="absolute top-16 left-0 right-0 bg-white border-t border-gray-200 p-4">
            <div className="max-w-3xl mx-auto">
              <input
                type="text"
                placeholder="Buscar..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                autoFocus
              />
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-t border-gray-200">
            <nav className="px-4 py-6 space-y-4">
              <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors">Programas</a>
              <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors">Investigación</a>
              <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors">Conocimiento</a>
              <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors">Alumni</a>
              <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors">Empresas</a>
              <a href="#" className="block text-gray-700 hover:text-red-600 transition-colors">Campus</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;