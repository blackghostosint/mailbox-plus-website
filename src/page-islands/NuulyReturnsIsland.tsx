import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { NuulyReturns } from '../page-components/NuulyReturns';

export default function NuulyReturnsIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <NuulyReturns />
            </BrowserRouter>
        </HelmetProvider>
    );
}
