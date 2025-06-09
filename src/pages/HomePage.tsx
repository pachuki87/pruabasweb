import React from 'react';
import Header from '../components/layout/Header';
import Hero from '../components/Hero';
import Programs from '../components/Programs';
import News from '../components/News';
import Events from '../components/Events';
import Research from '../components/Research';
import Campus from '../components/Campus';
import Footer from '../components/layout/Footer';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Campus />
      <Programs />
      <News />
      <Events />
      <Research />
      <Footer />
    </div>
  );
};

export default HomePage;
