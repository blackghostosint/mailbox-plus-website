import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { DocumentPrinting } from '../page-components/DocumentPrinting';

export default function DocumentPrintingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <DocumentPrinting />
            </BrowserRouter>
        </HelmetProvider>
    );
}
