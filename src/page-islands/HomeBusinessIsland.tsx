import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { HomeBusiness } from '../page-components/HomeBusiness';

export default function HomeBusinessIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <HomeBusiness />
            </BrowserRouter>
        </HelmetProvider>
    );
}
