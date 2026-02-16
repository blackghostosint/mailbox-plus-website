import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PackShip } from '../page-components/PackShip';

export default function PackShipIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PackShip />
            </BrowserRouter>
        </HelmetProvider>
    );
}
