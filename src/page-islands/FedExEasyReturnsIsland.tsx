import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { FedExEasyReturns } from '../page-components/fedex-easy-returns';

export default function FedExEasyReturnsIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <FedExEasyReturns />
            </BrowserRouter>
        </HelmetProvider>
    );
}
