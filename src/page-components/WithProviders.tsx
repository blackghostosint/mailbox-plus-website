import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

interface Props {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    component: React.ComponentType<any>;
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
