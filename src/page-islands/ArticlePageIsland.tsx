import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ArticlePageContent } from '../page-components/ArticlePage';

interface Props { slug: string; }

export default function ArticlePageIsland({ slug }: Props) {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ArticlePageContent slug={slug} />
            </BrowserRouter>
        </HelmetProvider>
    );
}
