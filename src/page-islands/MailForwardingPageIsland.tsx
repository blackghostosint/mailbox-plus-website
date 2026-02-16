import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MailForwardingPage from '../page-components/mail-forwarding-concord-township';

export default function MailForwardingPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <MailForwardingPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
