import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { FaxServices } from '../page-components/FaxServices';

export default function FaxServicesIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <FaxServices />
            </BrowserRouter>
        </HelmetProvider>
    );
}
