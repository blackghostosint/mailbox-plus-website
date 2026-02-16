import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { GraphicDesign } from '../page-components/GraphicDesign';

export default function GraphicDesignIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <GraphicDesign />
            </BrowserRouter>
        </HelmetProvider>
    );
}
