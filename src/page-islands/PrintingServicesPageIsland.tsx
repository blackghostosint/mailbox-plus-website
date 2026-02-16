import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrintingServicesPage from '../page-components/printing-services-concord-township';

export default function PrintingServicesPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PrintingServicesPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
