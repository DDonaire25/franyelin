import React from 'react';
import { Instagram, Apple as WhatsApp } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg mt-auto py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            Creado por Douglas Donaire
          </p>
          
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <a
              href="https://instagram.com/douglasdonaire"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Instagram className="h-5 w-5 mr-2" />
              <span className="text-sm">@douglasdonaire</span>
            </a>
            
            <a
              href="https://wa.me/584244093330"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 transition-colors"
            >
              <WhatsApp className="h-5 w-5 mr-2" />
              <span className="text-sm">+58 424-4093330</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};