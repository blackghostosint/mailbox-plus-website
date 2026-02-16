import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ShippingCenterPage from '../page-components/shipping-center-concord-township';

export default function ShippingCenterPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ShippingCenterPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
