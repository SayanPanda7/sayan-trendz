const TOKEN_KEY = 'sayan_trendz_access_token';

let accessToken = typeof window !== 'undefined' ? window.sessionStorage.getItem(TOKEN_KEY) || '' : '';

export function setAccessToken(token) {
  accessToken = token || '';

  if (typeof window !== 'undefined') {
    if (accessToken) {
      window.sessionStorage.setItem(TOKEN_KEY, accessToken);
    } else {
      window.sessionStorage.removeItem(TOKEN_KEY);
    }
  }
}

export function getAccessToken() {
  return accessToken;
}

export function clearAccessToken() {
  setAccessToken('');
}

export function getDevHeaders() {
  const email = import.meta.env.VITE_DEV_AUTH_EMAIL;

  if (!email) {
    return {};
  }

  return {
    'x-dev-user-email': email,
    'x-dev-user-role': import.meta.env.VITE_DEV_AUTH_ROLE || 'admin',
    'x-dev-user-name': 'Sayan Trendz Demo',
  };
}
