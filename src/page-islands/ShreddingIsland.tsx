import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Shredding } from '../page-components/Shredding';

export default function ShreddingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Shredding />
            </BrowserRouter>
        </HelmetProvider>
    );
}
