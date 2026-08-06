/**
 * Thin fetch wrapper for the Omseva backend API.
 * - Always sends credentials (httpOnly cookie)
 * - On 401, emits a custom event so AuthContext can redirect to login
 */

import { notifyRateLimited } from '../../lib/rateLimit';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v2';
const ACCESS_TOKEN_KEY = 'omseva_admin_access_token';

async function request(path, options = {}) {
  const url = `${BASE_URL}${path}`;

  const isFormData = options.body instanceof FormData;
  const accessToken = sessionStorage.getItem(ACCESS_TOKEN_KEY);

  const config = {
    credentials: 'include',
    ...options,
    headers: {
      // Do NOT set Content-Type for FormData — browser sets it with boundary
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...options.headers,
    },
  };

  console.debug('[Admin API request]', {
    url,
    method: config.method,
    credentials: config.credentials,
    hasAccessToken: Boolean(accessToken),
    headers: {
      ...config.headers,
      ...(config.headers.Authorization ? { Authorization: 'Bearer [redacted]' } : {}),
    },
  });

  const response = await fetch(url, config);

  // If 401, fire event so AuthContext can react
  if (response.status === 401) {
    window.dispatchEvent(new CustomEvent('auth:unauthorized'));
  }

  const json = await response.json().catch(() => ({}));

  if (response.status === 429) {
    notifyRateLimited({
      message: json.message,
      retryAfter: response.headers.get('Retry-After'),
      data: json,
    });
  }

  if (!response.ok) {
    // Throw an error with the backend message for UI display
    const message =
      json.message || `Request failed with status ${response.status}`;
    const err = new Error(message);
    err.status = response.status;
    err.data = json;
    throw err;
  }

  return json;
}

export const api = {
  get: (path, options = {}) => request(path, { method: 'GET', ...options }),

  post: (path, body, options = {}) =>
    request(path, {
      method: 'POST',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  put: (path, body, options = {}) =>
    request(path, {
      method: 'PUT',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  patch: (path, body, options = {}) =>
    request(path, {
      method: 'PATCH',
      body: body instanceof FormData ? body : JSON.stringify(body),
      ...options,
    }),

  delete: (path, body, options = {}) =>
    request(path, {
      method: 'DELETE',
      ...(body ? { body: JSON.stringify(body) } : {}),
      ...options,
    }),
};
