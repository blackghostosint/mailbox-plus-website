import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../../config/siteConfig';

interface PageMetaProps {
    title: string;
    description: string;
    canonical?: string;
}

export const PageMeta: React.FC<PageMetaProps> = ({ title, description, canonical }) => {
    const location = useLocation();

    // Logic to determine the final canonical URL
    let finalCanonical = canonical;

    if (!finalCanonical) {
        // Auto-generate from current location
        const pathname = location.pathname;
        // Remove trailing slash if not root
        const cleanPath = pathname !== "/" && pathname.endsWith("/")
            ? pathname.slice(0, -1)
            : pathname;

        finalCanonical = `${siteConfig.domain}${cleanPath}`;
    } else {
        // If relative path provided, prepend domain
        if (finalCanonical.startsWith("/")) {
            finalCanonical = `${siteConfig.domain}${finalCanonical}`;
        }
    }

    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <link rel="canonical" href={finalCanonical} />
        </Helmet>
    );
};
