import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-12">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-900">404</h1>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-gray-900">Página no encontrada</h2>
        <p className="mt-4 text-lg text-gray-600">Lo sentimos, no pudimos encontrar la página que estás buscando.</p>
        
        <Link 
          to="/" 
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
        >
          <HomeIcon className="h-5 w-5" />
          Volver al Inicio
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
