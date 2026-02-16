import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { PostageStamps } from '../page-components/PostageStamps';

export default function PostageStampsIsland() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <PostageStamps />
            </BrowserRouter>
        </HelmetProvider>
    );
}
