import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { MicroProblemContent } from '../page-components/micro/MicroProblemPage';

interface Props { slug: string; }

export default function MicroProblemContentIsland({ slug }: Props) {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <MicroProblemContent slug={slug} />
            </BrowserRouter>
        </HelmetProvider>
    );
}
