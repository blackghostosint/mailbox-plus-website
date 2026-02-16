import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PostcardPrinting } from '../page-components/PostcardPrinting';

export default function PostcardPrintingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PostcardPrinting />
            </BrowserRouter>
        </HelmetProvider>
    );
}
