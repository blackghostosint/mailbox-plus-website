import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { CustomBoxMaking } from '../page-components/CustomBoxMaking';

export default function CustomBoxMakingIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <CustomBoxMaking />
            </BrowserRouter>
        </HelmetProvider>
    );
}
