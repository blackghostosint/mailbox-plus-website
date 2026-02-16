import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import USPSDropOffAlternativePage from '../page-components/usps-drop-off-alternative-concord-township';

export default function USPSDropOffAlternativePageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <USPSDropOffAlternativePage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
