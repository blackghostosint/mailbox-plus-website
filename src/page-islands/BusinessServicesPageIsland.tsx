import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import BusinessServicesPage from '../page-components/business-services-concord-township';

export default function BusinessServicesPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <BusinessServicesPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
