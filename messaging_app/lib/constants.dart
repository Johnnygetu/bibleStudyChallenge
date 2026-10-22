// Shared constants for the messaging app.
//
// Their single source of truth — screens and future services import from
// here instead of declaring their own copies.

// The single source for the backend URL, like apiUrl.js in the admin app.
// Dev URL points at the local Laravel server.
const String apiUrl = 'http://127.0.0.1:8000/api';

// Prod URL — commented out while the messaging app is in development.
// Swap the two lines when it's time to point at the deployed API.
// const String apiUrl = 'https://bibleapi.pharmasoft-et.com/api';
