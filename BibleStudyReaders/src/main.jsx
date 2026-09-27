import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import WebApp from '@twa-dev/sdk';
import './index.css';

WebApp.ready();
WebApp.expand();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
