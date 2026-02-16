import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { EveryDoorDirectMail } from '../page-components/EveryDoorDirectMail';

export default function EveryDoorDirectMailIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <EveryDoorDirectMail />
            </BrowserRouter>
        </HelmetProvider>
    );
}
