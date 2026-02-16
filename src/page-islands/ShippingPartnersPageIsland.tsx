import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ShippingPartnersPage from '../page-components/ShippingPartners';

export default function ShippingPartnersPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ShippingPartnersPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
