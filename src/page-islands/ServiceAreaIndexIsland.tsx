import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ServiceAreaIndex } from '../page-components/ServiceAreaIndex';

export default function ServiceAreaIndexIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ServiceAreaIndex />
            </BrowserRouter>
        </HelmetProvider>
    );
}
