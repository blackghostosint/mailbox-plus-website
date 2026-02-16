import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import AmazonReturnsPage from '../page-components/amazon-returns-drop-off-concord-township';

export default function AmazonReturnsPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <AmazonReturnsPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
