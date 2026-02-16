import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import FedExOfficeAlternativePage from '../page-components/fedex-office-alternative-concord-township';

export default function FedExOfficeAlternativePageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <FedExOfficeAlternativePage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
