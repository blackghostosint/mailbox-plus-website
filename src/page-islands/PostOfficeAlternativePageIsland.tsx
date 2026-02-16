import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PostOfficeAlternativePage from '../page-components/post-office-alternative-concord-township';

export default function PostOfficeAlternativePageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PostOfficeAlternativePage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
