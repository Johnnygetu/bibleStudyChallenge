// The single source for the backend URL — every admin context imports this
// instead of declaring its own. Override per environment with VITE_API_URL
// (e.g. a tunnel URL); otherwise it points at the local Laravel server.
//
// This lives on its own rather than in AppProviders.jsx, which composes the
// providers. The contexts are what AppProviders imports, so exporting the URL
// from there put each context in an import cycle with the module that imports
// it. That works at runtime, but it also meant touching any one context
// invalidated AppProviders and every other context with it — and the dev
// server would occasionally hand the provider and a consumer two different
// copies of the same context, so useContext returned null.
export const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';
// export const apiUrl = import.meta.env.VITE_API_URL || 'https://bibleapi.pharmasoft-et.com/api';
