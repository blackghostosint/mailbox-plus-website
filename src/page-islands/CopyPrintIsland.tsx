import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CopyPrint } from '../page-components/CopyPrint';

export default function CopyPrintIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <CopyPrint />
            </BrowserRouter>
        </HelmetProvider>
    );
}
