import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import VirtualMailboxPage from '../page-components/virtual-mailbox-concord-township';

export default function VirtualMailboxPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <VirtualMailboxPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
