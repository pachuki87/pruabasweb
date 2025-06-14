import React from 'react';
import Header from '../components/layout/Header'; // Added import
import MasterAdiccionesContent from '../components/courses/MasterAdiccionesContent';

const MasterAdiccionesPage: React.FC = () => {
    return (
        <>
            <Header /> {/* Added Header */}
            <MasterAdiccionesContent />
        </>
    );
};

export default MasterAdiccionesPage;
