import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { NotaryServices } from '../page-components/NotaryServices';

export default function NotaryServicesIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <NotaryServices />
            </BrowserRouter>
        </HelmetProvider>
    );
}
