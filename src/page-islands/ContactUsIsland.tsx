import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { ContactUs } from '../page-components/ContactUs';

export default function ContactUsIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <ContactUs />
            </BrowserRouter>
        </HelmetProvider>
    );
}
