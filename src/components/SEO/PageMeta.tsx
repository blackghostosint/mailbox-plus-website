import React from 'react';
import { Helmet } from 'react-helmet-async';

interface PageMetaProps {
    title: string;
    description: string;
    canonical?: string;
}

export const PageMeta: React.FC<PageMetaProps> = ({ title, description, canonical }) => {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            {canonical && <link rel="canonical" href={canonical} />}
        </Helmet>
    );
};
