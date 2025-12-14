import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import { services } from '../../config/services';
import { ServicePageV2 } from '../../components/ServicePageV2';

const MicroProblemPage: React.FC = () => {
    const location = useLocation();

    // Find service matching the current path
    const service = services.find(s => s.slug === location.pathname);

    // If no service found, or if it's not a micro-problem (safety check), 404
    if (!service || service.category !== 'micro-problem') {
        return <Navigate to="/404" replace />;
    }

    return <ServicePageV2 {...service} />;
};

export default MicroProblemPage;
