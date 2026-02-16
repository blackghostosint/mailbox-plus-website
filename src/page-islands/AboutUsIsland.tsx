import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AboutUs } from '../page-components/AboutUs';

export default function AboutUsIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <AboutUs />
            </BrowserRouter>
        </HelmetProvider>
    );
}
