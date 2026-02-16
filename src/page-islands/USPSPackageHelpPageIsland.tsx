import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import USPSPackageHelpPage from '../page-components/usps-package-help-concord-township';

export default function USPSPackageHelpPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <USPSPackageHelpPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
