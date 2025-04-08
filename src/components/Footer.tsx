import React from 'react';
import { Instagram, MessageCircle } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="text-gray-600 dark:text-gray-300">
            © 2025 Agenda Cultural. Todos los derechos reservados.
          </div>
          <div className="flex space-x-4">
            <a
              href="https://instagram.com/douglasdonaire"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://wa.me/584244093330?text=Hola, te contacto desde agenda cultural.."
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};