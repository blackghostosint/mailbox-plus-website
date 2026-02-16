import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { USPSServices } from '../page-components/USPSServices';

export default function USPSServicesIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <USPSServices />
            </BrowserRouter>
        </HelmetProvider>
    );
}
