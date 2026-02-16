import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import UPSDropOffAlternativePage from '../page-components/ups-drop-off-alternative-concord-township';

export default function UPSDropOffAlternativePageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <UPSDropOffAlternativePage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
