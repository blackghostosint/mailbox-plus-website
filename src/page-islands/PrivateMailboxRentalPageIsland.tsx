import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PrivateMailboxRentalPage from '../page-components/private-mailbox-rental-concord-township';

export default function PrivateMailboxRentalPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PrivateMailboxRentalPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
