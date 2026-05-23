const TOKEN_KEY = "auth_token";
const REFRESH_TOKEN_KEY = "auth_refresh_token";
const USER_DATA_KEY = "auth_user";
const REMEMBER_KEY = "auth_remember_me";

function getStorage(): Storage {
  // If the user has chosen to be remembered, use localStorage; otherwise, use sessionStorage
  return localStorage.getItem(REMEMBER_KEY) === "true"
    ? localStorage
    : sessionStorage;
}

export function setTokens(
  token: string,
  refreshToken: string,
  rememberMe: boolean,
): void {
  // Always persist the remember me preference so reloads know which storage to use.
  localStorage.setItem(REMEMBER_KEY, String(rememberMe));

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getToken(): string {
  return getStorage().getItem(TOKEN_KEY) ?? "";
}

export function getRefreshToken(): string {
  return getStorage().getItem(REFRESH_TOKEN_KEY) ?? "";
}

// Persists user profile fields (everything except tokens) to storage.
export function setUserData(user: Record<string, unknown>): void {
  getStorage().setItem(USER_DATA_KEY, JSON.stringify(user));
}

// Returns the stored user profile, or null if not present.
export function getUserData<T>(): T | null {
  const raw = getStorage().getItem(USER_DATA_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

// Called after a successful token refresh — only updates the stored tokens.
export function updateStoredTokens(token: string, refreshToken: string): void {
  const storage = getStorage();
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem(REMEMBER_KEY);
}
