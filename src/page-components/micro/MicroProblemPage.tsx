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

// Astro island variant — accepts slug as prop instead of useLocation
export const MicroProblemContent: React.FC<{ slug: string }> = ({ slug }) => {
    const service = services.find(s => s.slug === slug);
    if (!service || service.category !== 'micro-problem') {
        return (
            <div className="max-w-4xl mx-auto py-20 text-center">
                <h1 className="text-3xl font-bold text-gray-800">Page Not Found</h1>
            </div>
        );
    }
    return <ServicePageV2 {...service} />;
};
