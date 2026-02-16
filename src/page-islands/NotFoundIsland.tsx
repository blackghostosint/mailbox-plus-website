import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { NotFound } from '../page-components/NotFound';

export default function NotFoundIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <NotFound />
            </BrowserRouter>
        </HelmetProvider>
    );
}
