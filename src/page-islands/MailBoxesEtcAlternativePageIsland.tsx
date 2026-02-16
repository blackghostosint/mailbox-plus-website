import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import MailBoxesEtcAlternativePage from '../page-components/mail-boxes-etc-alternative-concord-township';

export default function MailBoxesEtcAlternativePageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <MailBoxesEtcAlternativePage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
