import React from 'react';
import Header from '../components/layout/Header';
import MasterAdiccionesContent from '../components/courses/MasterAdiccionesContent';
import Footer from '../components/layout/Footer';

const MasterAdiccionesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <MasterAdiccionesContent />
            <Footer />
        </div>
    );
};

export default MasterAdiccionesPage;
