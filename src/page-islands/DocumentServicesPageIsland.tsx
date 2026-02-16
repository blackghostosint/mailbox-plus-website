import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import DocumentServicesPage from '../page-components/document-services-concord-township';

export default function DocumentServicesPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <DocumentServicesPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
