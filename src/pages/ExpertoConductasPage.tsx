import React from 'react';
import Header from '../components/layout/Header';
import ExpertoConductasContent from '../components/courses/ExpertoConductasContent';
import Footer from '../components/layout/Footer';

const ExpertoConductasPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-white">
            <Header />
            <ExpertoConductasContent />
            <Footer />
        </div>
    );
};

export default ExpertoConductasPage;