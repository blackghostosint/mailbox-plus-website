import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PostersPrinting } from '../page-components/PostersPrinting';

export default function PostersPrintingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PostersPrinting />
            </BrowserRouter>
        </HelmetProvider>
    );
}
