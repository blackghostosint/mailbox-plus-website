import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MultiCarrierShippingPage from '../page-components/ups-fedex-usps-dhl-shipping-concord-township';

export default function MultiCarrierShippingPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <MultiCarrierShippingPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
