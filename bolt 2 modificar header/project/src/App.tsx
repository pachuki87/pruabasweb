import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Campus from './components/Campus';
import Programs from './components/Programs';
import News from './components/News';
import Events from './components/Events';
import Research from './components/Research';
import Footer from './components/Footer';

function App() {
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
}

export default App;