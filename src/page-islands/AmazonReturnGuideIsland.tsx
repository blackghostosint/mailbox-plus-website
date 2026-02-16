import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AmazonReturnGuide } from '../page-components/AmazonReturnGuide';

export default function AmazonReturnGuideIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <AmazonReturnGuide />
            </BrowserRouter>
        </HelmetProvider>
    );
}
