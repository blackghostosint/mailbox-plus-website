import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PackAndShipServicesPage from '../page-components/pack-and-ship-services-concord-township';

export default function PackAndShipServicesPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PackAndShipServicesPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
