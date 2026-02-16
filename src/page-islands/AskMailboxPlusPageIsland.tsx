import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AskMailboxPlusPage from '../page-components/ask-mailbox-plus';

export default function AskMailboxPlusPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <AskMailboxPlusPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
