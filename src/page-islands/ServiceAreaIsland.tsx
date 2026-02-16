import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ServiceAreaContent } from '../page-components/ServiceAreaPage';

interface Props { slug: string; }

export default function ServiceAreaIsland({ slug }: Props) {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ServiceAreaContent slug={slug} />
            </BrowserRouter>
        </HelmetProvider>
    );
}
