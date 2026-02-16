import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Home } from '../page-components/Home';

export default function HomeIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Home />
            </BrowserRouter>
        </HelmetProvider>
    );
}
