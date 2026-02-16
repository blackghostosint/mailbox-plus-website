import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import OfficeDepotAlternativePage from '../page-components/office-depot-alternative-concord-township';

export default function OfficeDepotAlternativePageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <OfficeDepotAlternativePage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
