import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SmallBusinessShippingPage from '../page-components/small-business-shipping-concord-township';

export default function SmallBusinessShippingPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <SmallBusinessShippingPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
