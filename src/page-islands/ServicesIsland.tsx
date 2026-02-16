import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Services } from '../page-components/Services';

export default function ServicesIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Services />
            </BrowserRouter>
        </HelmetProvider>
    );
}
