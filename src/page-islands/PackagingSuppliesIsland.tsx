import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PackagingSupplies } from '../page-components/PackagingSupplies';

export default function PackagingSuppliesIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PackagingSupplies />
            </BrowserRouter>
        </HelmetProvider>
    );
}
