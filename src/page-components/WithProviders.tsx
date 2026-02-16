import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

interface Props {
    component: React.ComponentType<Record<string, unknown>>;
    [key: string]: unknown;
}

export function WithProviders({ component: Component, ...props }: Props) {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Component {...props} />
            </BrowserRouter>
        </HelmetProvider>
    );
}
