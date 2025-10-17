import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import TagManager from 'react-gtm-module';
import App from './App.tsx';
import './index.css';

const tagManagerArgs = {
  gtmId: 'GTM-53WJ275G', // replace with your container ID
};

TagManager.initialize(tagManagerArgs);

 // console.log('main.tsx: Starting render');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);
