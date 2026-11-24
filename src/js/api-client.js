/**
 * ============================================================
 * ELMUAZ TECHNOLOGIES LTD
 * Internal Company Management System (EIMS)
 * Centralized API Service Layer & HTTP Client
 * ============================================================
 * 
 * BACKEND DEVELOPER NOTE:
 * This client standardizes all network requests, header injection,
 * token passing, timeout handling, and error normalization.
 * Wait for your API documentation before invoking real endpoints.
 * ============================================================
 */

class ApiError extends Error {
  constructor(message, status = 500, code = 'API_ERROR', details = null) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
  }
}

class ApiClient {
  constructor(config = window.EIMS_CONFIG?.API) {
    this.baseUrl = config?.BASE_URL || 'http://localhost:5000/api/v1';
    this.timeoutMs = config?.TIMEOUT_MS || 15000;
    this.defaultHeaders = config?.DEFAULT_HEADERS || {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    this.debug = config?.DEBUG_LOGGING ?? true;
    this.tokenGetter = null;
    this.unauthorizedHandler = null;
  }

  /**
   * Set callback to retrieve access token (JWT / Bearer token)
   */
  setTokenGetter(fn) {
    this.tokenGetter = fn;
  }

  /**
   * Set callback when a 401 Unauthorized response is received
   */
  setUnauthorizedHandler(fn) {
    this.unauthorizedHandler = fn;
  }

  /**
   * Construct absolute URL with optional query parameters
   */
  buildUrl(endpoint, params = null) {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    let fullUrl = `${this.baseUrl.replace(/\/+$/, '')}${cleanEndpoint}`;

    if (params && Object.keys(params).length > 0) {
      const searchParams = new URLSearchParams();
      for (const [key, val] of Object.entries(params)) {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, val);
        }
      }
      const qs = searchParams.toString();
      if (qs) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + qs;
      }
    }
    return fullUrl;
  }

  /**
   * Core request dispatcher with timeout and header injection
   */
  async request(endpoint, options = {}) {
    const {
      method = 'GET',
      params = null,
      body = null,
      headers = {},
      timeout = this.timeoutMs,
      skipAuth = false
    } = options;

    const url = this.buildUrl(endpoint, params);

    // Prepare headers
    const requestHeaders = {
      ...this.defaultHeaders,
      ...headers
    };

    // Inject Bearer token if available
    if (!skipAuth && this.tokenGetter) {
      const token = this.tokenGetter();
      if (token) {
        requestHeaders['Authorization'] = `Bearer ${token}`;
      }
    }

    // Prepare fetch options
    const fetchOptions = {
      method: method.toUpperCase(),
      headers: requestHeaders
    };

    // Attach body for mutating requests
    if (body !== null && body !== undefined && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(fetchOptions.method)) {
      if (body instanceof FormData || body instanceof Blob) {
        // Allow browser to set boundary header automatically
        delete requestHeaders['Content-Type'];
        fetchOptions.body = body;
      } else if (typeof body === 'object') {
        fetchOptions.body = JSON.stringify(body);
      } else {
        fetchOptions.body = body;
      }
    }

    // Attach AbortController timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    fetchOptions.signal = controller.signal;

    if (this.debug) {
      console.log(`[API REQUEST] ${fetchOptions.method} ${url}`, {
        headers: requestHeaders,
        body: body
      });
    }

    try {
      const response = await fetch(url, fetchOptions);
      clearTimeout(timeoutId);

      // Handle HTTP status codes
      return await this.handleResponse(response, endpoint, options);

    } catch (err) {
      clearTimeout(timeoutId);

      if (err.name === 'AbortError') {
        const timeoutError = new ApiError(
          `Request to ${endpoint} timed out after ${timeout}ms.`,
          408,
          'REQUEST_TIMEOUT'
        );
        if (this.debug) console.error('[API TIMEOUT]', timeoutError);
        throw timeoutError;
      }

      // Network or DNS failure
      const networkError = new ApiError(
        err.message || 'Unable to connect to backend server. Please check your network connection.',
        0,
        'NETWORK_ERROR',
        err
      );
      if (this.debug) console.error('[API NETWORK ERROR]', networkError);
      throw networkError;
    }
  }

  /**
   * Parse and validate HTTP response
   */
  async handleResponse(response, endpoint, options) {
    const contentType = response.headers.get('content-type') || '';
    let responseData = null;

    if (contentType.includes('application/json')) {
      try {
        responseData = await response.json();
      } catch (parseErr) {
        responseData = null;
      }
    } else {
      try {
        responseData = await response.text();
      } catch (e) {
        responseData = null;
      }
    }

    if (this.debug) {
      console.log(`[API RESPONSE] ${response.status} ${endpoint}`, responseData);
    }

    // 1. Success response (2xx)
    if (response.ok) {
      return responseData;
    }

    // 2. Unauthorized (401)
    if (response.status === 401) {
      if (this.unauthorizedHandler) {
        this.unauthorizedHandler(responseData);
      }
      throw new ApiError(
        responseData?.message || 'Session expired or unauthenticated. Please sign in again.',
        401,
        'UNAUTHORIZED',
        responseData
      );
    }

    // 3. Forbidden (403)
    if (response.status === 403) {
      throw new ApiError(
        responseData?.message || 'Access denied. You do not have permissions for this action.',
        403,
        'FORBIDDEN',
        responseData
      );
    }

    // 4. Not Found (404)
    if (response.status === 404) {
      throw new ApiError(
        responseData?.message || 'Requested resource could not be found.',
        404,
        'NOT_FOUND',
        responseData
      );
    }

    // 5. Validation Error (422 or 400)
    if (response.status === 422 || response.status === 400) {
      throw new ApiError(
        responseData?.message || 'Invalid input provided. Please verify the form fields.',
        response.status,
        'VALIDATION_ERROR',
        responseData?.errors || responseData?.details || responseData
      );
    }

    // 6. Generic Server Error (5xx)
    throw new ApiError(
      responseData?.message || `Backend server error (${response.status}). Please try again later.`,
      response.status,
      'SERVER_ERROR',
      responseData
    );
  }

  // Convenience HTTP Methods
  get(endpoint, params = null, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET', params });
  }

  post(endpoint, body = null, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body });
  }

  put(endpoint, body = null, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body });
  }

  patch(endpoint, body = null, options = {}) {
    return this.request(endpoint, { ...options, method: 'PATCH', body });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

// Global Singleton Instance
const apiClient = new ApiClient();

if (typeof window !== 'undefined') {
  window.ApiClient = ApiClient;
  window.ApiError = ApiError;
  window.apiClient = apiClient;
}
