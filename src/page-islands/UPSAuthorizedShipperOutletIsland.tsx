import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { UPSAuthorizedShipperOutlet } from '../page-components/UPSAuthorizedShipperOutlet';

export default function UPSAuthorizedShipperOutletIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <UPSAuthorizedShipperOutlet />
            </BrowserRouter>
        </HelmetProvider>
    );
}
