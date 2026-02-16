import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GolfClubShipping } from '../page-components/GolfClubShipping';

export default function GolfClubShippingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <GolfClubShipping />
            </BrowserRouter>
        </HelmetProvider>
    );
}
