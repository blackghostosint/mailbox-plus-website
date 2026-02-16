import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { DocumentScanning } from '../page-components/DocumentScanning';

export default function DocumentScanningIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <DocumentScanning />
            </BrowserRouter>
        </HelmetProvider>
    );
}
