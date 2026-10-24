import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import WebApp from '@twa-dev/sdk';
import './index.css';

// DEV-ONLY Telegram stub: adding ?telegram=1 to the dev-server URL makes the
// plain browser pretend to be a Telegram mini-app launch, so the registration
// modal's "Fetch account" button and the chat-id lookups can be exercised
// without really opening the app inside Telegram. The chat id / display name
// come from ?chat= / ?name=. Guarded by DEV + query param, so production
// builds are never affected.
if (import.meta.env.DEV && new URLSearchParams(window.location.search).has('telegram')) {
  const params = new URLSearchParams(window.location.search);
  const real = window.Telegram.WebApp;
  Object.defineProperty(window.Telegram, 'WebApp', {
    configurable: true,
    value: {
      ...real,
      platform: 'android',
      initData: 'mock-init-data',
      initDataUnsafe: {
        user: {
          id: Number(params.get('chat') || 1),
          first_name: params.get('name') || 'Issav',
          last_name: '',
          username: 'mock_user',
        },
      },
      HapticFeedback: {
        impactOccurred: () => {},
        notificationOccurred: () => {},
        selectionChanged: () => {},
      },
    },
  });

  // &blockAutoRestore=1 fakes a 404 for the FIRST by-chat request only, so the
  // automatic restore on boot is skipped and the modal (with its Fetch
  // account button) still shows. Manual button clicks then hit the real API.
  if (params.has('blockAutoRestore')) {
    let blockedOnce = false;
    const realFetch = window.fetch.bind(window);
    window.fetch = (input, init) => {
      const url = typeof input === 'string' ? input : (input?.url ?? '');
      if (!blockedOnce && url.includes('/readers/by-chat/')) {
        blockedOnce = true;
        return Promise.resolve(new Response(null, { status: 404 }));
      }
      return realFetch(input, init);
    };
  }
}

WebApp.ready();
WebApp.expand();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
