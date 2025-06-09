import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../components/Hero';
import Campus from '../components/Campus';
import Programs from '../components/Programs';
import News from '../components/News';
import Events from '../components/Events';
import Research from '../components/Research';

type HomePageProps = {
  currentRole: string;
  onRoleChange: (role: string) => void;
};

const HomePage: React.FC<HomePageProps> = ({ currentRole, onRoleChange }) => {
  // La lógica de cursos y usuarios de Supabase ya no es necesaria para esta HomePage clonada.
  // Se mantiene la estructura básica del componente React.

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Campus />
        <Programs />
        <News />
        <Events />
        <Research />
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
