import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Tracking } from '../page-components/Tracking';

export default function TrackingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Tracking />
            </BrowserRouter>
        </HelmetProvider>
    );
}
