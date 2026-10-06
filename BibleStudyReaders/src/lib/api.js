// Shared helpers for the reader app's API calls. Every fetching context goes
// through these, so response handling and error wording live in one place.

export async function readJsonResponse(response, resourceName) {
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.message || `${resourceName} request failed (HTTP ${response.status}).`);
  }
  return payload;
}

export function getApiErrorMessage(error, apiUrl) {
  if (!apiUrl) {
    return "The server address is not configured. Set VITE_API_URL to the public Laravel API base URL ending in /api, then rebuild the reader app.";
  }
  if (error instanceof TypeError) {
    return `Couldn't reach the Bible Challenge server at ${apiUrl}. Check that the API is running and VITE_API_URL is correct.`;
  }
  return error instanceof Error ? error.message : "The server request failed. Please try again.";
}
