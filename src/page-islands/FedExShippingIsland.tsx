import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { FedExShipping } from '../page-components/FedExShipping';

export default function FedExShippingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <FedExShipping />
            </BrowserRouter>
        </HelmetProvider>
    );
}
