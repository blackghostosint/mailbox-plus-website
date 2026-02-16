import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Privacy } from '../page-components/Privacy';

export default function PrivacyIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Privacy />
            </BrowserRouter>
        </HelmetProvider>
    );
}
