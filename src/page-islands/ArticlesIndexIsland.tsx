import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ArticlesIndex from '../page-components/ArticlesIndex';

export default function ArticlesIndexIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ArticlesIndex />
            </BrowserRouter>
        </HelmetProvider>
    );
}
