import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BicycleShipping } from '../page-components/BicycleShipping';

export default function BicycleShippingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <BicycleShipping />
            </BrowserRouter>
        </HelmetProvider>
    );
}
