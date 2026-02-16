import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Insurance } from '../page-components/Insurance';

export default function InsuranceIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Insurance />
            </BrowserRouter>
        </HelmetProvider>
    );
}
