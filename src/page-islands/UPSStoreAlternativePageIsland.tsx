import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import UPSStoreAlternativePage from '../page-components/ups-store-alternative-concord-township';

export default function UPSStoreAlternativePageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <UPSStoreAlternativePage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
