import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { DigitalMailboxRental } from '../page-components/DigitalMailboxRental';

export default function DigitalMailboxRentalIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <DigitalMailboxRental />
            </BrowserRouter>
        </HelmetProvider>
    );
}
