import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Terms } from '../page-components/Terms';

export default function TermsIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Terms />
            </BrowserRouter>
        </HelmetProvider>
    );
}
