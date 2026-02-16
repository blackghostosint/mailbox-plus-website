import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Copies } from '../page-components/Copies';

export default function CopiesIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Copies />
            </BrowserRouter>
        </HelmetProvider>
    );
}
