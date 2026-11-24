/**
 * ============================================================
 * ELMUAZ TECHNOLOGIES LTD
 * Internal Company Management System (EIMS)
 * Centralized Authentication & Session Management Layer
 * ============================================================
 * 
 * BACKEND DEVELOPER NOTE:
 * Handles JWT/Bearer token persistence, user profile caching,
 * cross-tab synchronization, and auto-logout on token expiration.
 * Plug your authentication payload into setSession().
 * ============================================================
 */

class AuthSessionManager {
  constructor(config = window.EIMS_CONFIG) {
    this.keys = config?.STORAGE || {
      AUTH_TOKEN: 'eims_auth_token',
      REFRESH_TOKEN: 'eims_refresh_token',
      SESSION_ROLE: 'eims_session_role',
      SESSION_EMAIL: 'eims_session_email',
      USER_PROFILE: 'eims_user_profile',
      REMEMBER_ME: 'eims_remember_session'
    };
    this.sessionListeners = [];
    this.initCrossTabSync();
  }

  /**
   * Connect with ApiClient singleton to inject tokens automatically
   */
  connectApiClient(client = window.apiClient) {
    if (client) {
      client.setTokenGetter(() => this.getToken());
      client.setUnauthorizedHandler((err) => this.handleUnauthorized(err));
    }
  }

  /**
   * Retrieve active authentication access token
   */
  getToken() {
    return localStorage.getItem(this.keys.AUTH_TOKEN) || 
           sessionStorage.getItem(this.keys.AUTH_TOKEN) || null;
  }

  /**
   * Retrieve refresh token (for background token rotation)
   */
  getRefreshToken() {
    return localStorage.getItem(this.keys.REFRESH_TOKEN) || 
           sessionStorage.getItem(this.keys.REFRESH_TOKEN) || null;
  }

  /**
   * Retrieve cached authenticated user profile
   */
  getUser() {
    const raw = localStorage.getItem(this.keys.USER_PROFILE) || 
                sessionStorage.getItem(this.keys.USER_PROFILE);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  /**
   * Retrieve current user role
   */
  getRole() {
    const user = this.getUser();
    if (user?.role) return user.role;
    return localStorage.getItem(this.keys.SESSION_ROLE) || 'employee';
  }

  /**
   * Check if a valid session exists
   */
  isAuthenticated() {
    return !!(this.getToken() || localStorage.getItem(this.keys.SESSION_ROLE));
  }

  /**
   * Store authentication session after successful login / token refresh
   * 
   * @param {Object} sessionData
   * @param {string} [sessionData.token] - Access token (JWT / Bearer)
   * @param {string} [sessionData.refreshToken] - Refresh token
   * @param {Object} [sessionData.user] - User profile object
   * @param {boolean} [rememberMe=true] - Persist in localStorage vs sessionStorage
   */
  setSession(sessionData, rememberMe = true) {
    const storage = rememberMe ? localStorage : sessionStorage;

    if (sessionData.token) {
      storage.setItem(this.keys.AUTH_TOKEN, sessionData.token);
    }

    if (sessionData.refreshToken) {
      storage.setItem(this.keys.REFRESH_TOKEN, sessionData.refreshToken);
    }

    if (sessionData.user) {
      storage.setItem(this.keys.USER_PROFILE, JSON.stringify(sessionData.user));
      if (sessionData.user.role) {
        localStorage.setItem(this.keys.SESSION_ROLE, sessionData.user.role);
      }
      if (sessionData.user.email) {
        localStorage.setItem(this.keys.SESSION_EMAIL, sessionData.user.email);
      }
    }

    localStorage.setItem(this.keys.REMEMBER_ME, rememberMe ? 'true' : 'false');
    this.notifyListeners('login', sessionData);
  }

  /**
   * Update cached user profile in place
   */
  updateUserProfile(updatedFields) {
    const current = this.getUser() || {};
    const merged = { ...current, ...updatedFields };
    const rememberMe = localStorage.getItem(this.keys.REMEMBER_ME) !== 'false';
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(this.keys.USER_PROFILE, JSON.stringify(merged));
    if (merged.role) localStorage.setItem(this.keys.SESSION_ROLE, merged.role);
    if (merged.email) localStorage.setItem(this.keys.SESSION_EMAIL, merged.email);

    this.notifyListeners('user_updated', merged);
    return merged;
  }

  /**
   * Terminate active session and clear storage
   */
  clearSession() {
    // Clear both localStorage and sessionStorage
    [localStorage, sessionStorage].forEach(store => {
      store.removeItem(this.keys.AUTH_TOKEN);
      store.removeItem(this.keys.REFRESH_TOKEN);
      store.removeItem(this.keys.USER_PROFILE);
      store.removeItem(this.keys.SESSION_ROLE);
      store.removeItem(this.keys.SESSION_EMAIL);
      store.removeItem(this.keys.REMEMBER_ME);
    });

    this.notifyListeners('logout', null);
  }

  /**
   * Triggered when backend returns 401 Unauthorized
   */
  handleUnauthorized(errorDetails) {
    console.warn('[AUTH SESSION] 401 Unauthorized encountered. Purging session.');
    this.clearSession();

    if (window.UiFeedback) {
      window.UiFeedback.showToast('Your session has expired. Please log in again.', 'warning');
    }

    // Return to auth gateway if not already there
    setTimeout(() => {
      if (typeof window.showLoginGateway === 'function') {
        window.showLoginGateway();
      } else if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
      }
    }, 600);
  }

  /**
   * Subscribe to session lifecycle events ('login', 'logout', 'user_updated')
   */
  onSessionChange(callback) {
    if (typeof callback === 'function') {
      this.sessionListeners.push(callback);
    }
  }

  notifyListeners(event, payload) {
    this.sessionListeners.forEach(listener => {
      try {
        listener(event, payload);
      } catch (err) {
        console.error('[AUTH SESSION LISTENER ERROR]', err);
      }
    });
  }

  /**
   * Listen for cross-tab storage changes (e.g. logging out in one tab logs out all tabs)
   */
  initCrossTabSync() {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', (e) => {
        if (e.key === this.keys.AUTH_TOKEN && !e.newValue) {
          // Token was cleared in another tab
          this.notifyListeners('logout', null);
          if (typeof window.showLoginGateway === 'function') {
            window.showLoginGateway();
          }
        }
      });
    }
  }
}

// Global Singleton Instance
const authSession = new AuthSessionManager();

// Automatically wire with ApiClient singleton
if (typeof window !== 'undefined') {
  window.AuthSessionManager = AuthSessionManager;
  window.authSession = authSession;
  
  if (window.apiClient) {
    authSession.connectApiClient(window.apiClient);
  }
}
