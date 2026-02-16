import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PackageReceiving } from '../page-components/PackageReceiving';

export default function PackageReceivingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PackageReceiving />
            </BrowserRouter>
        </HelmetProvider>
    );
}
