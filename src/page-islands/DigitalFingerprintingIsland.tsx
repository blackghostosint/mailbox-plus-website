import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { DigitalFingerprinting } from '../page-components/DigitalFingerprinting';

export default function DigitalFingerprintingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <DigitalFingerprinting />
            </BrowserRouter>
        </HelmetProvider>
    );
}
