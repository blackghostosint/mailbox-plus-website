import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ProfessionalPacking } from '../page-components/ProfessionalPacking';

export default function ProfessionalPackingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ProfessionalPacking />
            </BrowserRouter>
        </HelmetProvider>
    );
}
