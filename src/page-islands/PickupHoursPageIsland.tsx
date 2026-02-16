import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import PickupHoursPage from '../page-components/PickupHours';

export default function PickupHoursPageIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PickupHoursPage />
            </BrowserRouter>
        </HelmetProvider>
    );
}
