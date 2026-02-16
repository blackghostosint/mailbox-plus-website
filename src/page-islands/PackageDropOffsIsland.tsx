import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PackageDropOffs } from '../page-components/PackageDropOffs';

export default function PackageDropOffsIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PackageDropOffs />
            </BrowserRouter>
        </HelmetProvider>
    );
}
