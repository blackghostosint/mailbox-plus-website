import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { FlyersBrochures } from '../page-components/FlyersBrochures';

export default function FlyersBrochuresIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <FlyersBrochures />
            </BrowserRouter>
        </HelmetProvider>
    );
}
