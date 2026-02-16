import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import StaplesAlternativePage from '../page-components/staples-printing-alternative-concord-township';

export default function StaplesAlternativePageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <StaplesAlternativePage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
