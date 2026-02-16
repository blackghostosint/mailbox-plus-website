import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { DHLExpress } from '../page-components/DHLExpress';

export default function DHLExpressIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <DHLExpress />
            </BrowserRouter>
        </HelmetProvider>
    );
}
