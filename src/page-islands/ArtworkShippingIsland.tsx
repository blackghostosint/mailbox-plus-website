import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ArtworkShipping } from '../page-components/ArtworkShipping';

export default function ArtworkShippingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ArtworkShipping />
            </BrowserRouter>
        </HelmetProvider>
    );
}
