/**
 * ============================================================
 * ELMUAZ TECHNOLOGIES LTD
 * Internal Company Management System (EIMS)
 * Centralized API Service Adapters (Feature Services)
 * ============================================================
 * 
 * BACKEND DEVELOPER NOTE:
 * This layer encapsulates all service-specific network calls.
 * 
 * Task operations use the backend task API directly. Other services may still
 * use their configured mock fallback behavior.
 * ============================================================
 */

// ============================================================
// 1. AUTHENTICATION & IDENTITY SERVICE
// ============================================================
const AuthService = {
  /**
   * Authenticate staff member with work email and passkey
   * Expected Backend Contract: POST /auth/login { email, password }
   * Returns: { token, refreshToken, user: { id, name, email, role, department, ... } }
   */
  async login(email, password) {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.AUTH.LOGIN;
      return await window.apiClient.post(endpoint, { email, password }, { skipAuth: true });
    }
    // [MOCK MODE]: Handled by portal.js local state
    return null;
  },

  /**
   * Submit new employee self-registration
   * Expected Backend Contract: POST /auth/signup { name, email, department, title, password }
   * Returns: { user: { id, status: 'pending_approval', ... } }
   */
  async signup(registrationData) {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.AUTH.SIGNUP;
      return await window.apiClient.post(endpoint, registrationData, { skipAuth: true });
    }
    // [MOCK MODE]: Handled by portal.js local state
    return null;
  },

  /**
   * Authenticate via Google Workspace OAuth token
   * Expected Backend Contract: POST /auth/google { idToken or authCode }
   * Returns: { token, user: { ... } }
   */
  async loginWithGoogle(googleAuthPayload) {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.AUTH.GOOGLE_AUTH;
      return await window.apiClient.post(endpoint, googleAuthPayload, { skipAuth: true });
    }
    // [MOCK MODE]: Handled by portal.js local state
    return null;
  },

  /**
   * Invalidate active session on the backend
   * Expected Backend Contract: POST /auth/logout
   */
  async logout() {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.AUTH.LOGOUT;
      try {
        await window.apiClient.post(endpoint);
      } catch (err) {
        console.warn('[AUTH SERVICE] Backend logout notification failed, clearing local session anyway.', err);
      }
    }
    window.authSession?.clearSession();
  },

  /**
   * Fetch latest profile for current authenticated session
   * Expected Backend Contract: GET /auth/me
   */
  async getCurrentUser() {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.AUTH.CURRENT_USER;
      return await window.apiClient.get(endpoint);
    }
    return window.authSession?.getUser();
  }
};


// ============================================================
// 2. STAFF & PERSONNEL ADMINISTRATION SERVICE
// ============================================================
const StaffService = {
  /**
   * Fetch company employee directory
   * Expected Backend Contract: GET /staff
   */
  async getStaffList(filters = {}) {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.STAFF.LIST;
      return await window.apiClient.get(endpoint, filters);
    }
    return null;
  },

  /**
   * Fetch registrations awaiting CEO authorization.
   * Backend contract: GET /profiles/pending -> { success, profiles }
   */
  async getPendingApprovals() {
    return await window.apiClient.get('/profiles/pending');
  },

  /** Approve a pending employee profile through the CEO protected backend route. */
  async approveStaff(staffId) {
    return await window.apiClient.patch(`/profiles/${encodeURIComponent(staffId)}/approve`, {});
  },

  /** Reject a pending employee profile through the CEO protected backend route. */
  async rejectStaff(staffId) {
    return await window.apiClient.patch(`/profiles/${encodeURIComponent(staffId)}/reject`, {});
  },

  /**
   * CEO directly provisions new employee (bypasses approval queue)
   * Expected Backend Contract: POST /staff/onboard { name, email, department, role, title, salary, password }
   */
  async onboardStaff(staffData) {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.STAFF.ONBOARD;
      return await window.apiClient.post(endpoint, staffData);
    }
    return null;
  },

  /**
   * CEO edits existing employee parameters (department, salary, role, status)
   * Expected Backend Contract: PUT /staff/:id { department, salary, role, title, status }
   */
  async updateStaffProfile(staffId, updatedData) {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.STAFF.UPDATE(staffId);
      return await window.apiClient.put(endpoint, updatedData);
    }
    return null;
  }
};


// ============================================================
// 3. TASKS & 8-STAGE WORKFLOW SERVICE
// ============================================================
const TaskService = {
  /**
   * Fetch task pipeline filtered by user role / department
   * Expected Backend Contract: GET /tasks
   */
  async getTasks(params = {}) {
    const endpoint = window.EIMS_CONFIG.ENDPOINTS.TASKS.LIST;
    return await window.apiClient.get(endpoint, params);
  },

  /**
   * Create a new operational task
   * Expected Backend Contract: POST /tasks
   */
  async createTask(taskData) {
    const endpoint = window.EIMS_CONFIG.ENDPOINTS.TASKS.CREATE;
    return await window.apiClient.post(endpoint, taskData);
  },

  /**
   * Advance task through a backend-supported workflow stage.
   * Contract: PATCH /tasks/:id/stage { stage }
   */
  async advanceStage(taskId, stage) {
    const endpoint = window.EIMS_CONFIG.ENDPOINTS.TASKS.UPDATE_STAGE(encodeURIComponent(taskId));
    return await window.apiClient.patch(endpoint, { stage });
  },

  /**
   * Employee submits a work description, deliverable URL, or both for review.
   * Contract: POST /tasks/:id/submissions { content, submission_url }
   */
  async submitDeliverable(taskId, content, deliverableUrl) {
    const endpoint = window.EIMS_CONFIG.ENDPOINTS.TASKS.SUBMIT_WORK(encodeURIComponent(taskId));
    return await window.apiClient.post(endpoint, { content, submission_url: deliverableUrl });
  },

  /**
   * Reviewer / CEO approves or requests corrections.
   * Contract: POST /tasks/:id/review { decision, review_comment }
   */
  async reviewTask(taskId, decision, notes = '') {
    const endpoint = window.EIMS_CONFIG.ENDPOINTS.TASKS.REVIEW(encodeURIComponent(taskId));
    return await window.apiClient.post(endpoint, { decision, review_comment: notes });
  }
};


// ============================================================
// 4. TREASURY & PAYSTACK DISBURSEMENTS SERVICE
// ============================================================
const FinanceService = {
  /**
   * Fetch company available capital & financial summaries
   * Expected Backend Contract: GET /finance/balances
   */
  async getBalances() {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.FINANCE.BALANCES;
      return await window.apiClient.get(endpoint);
    }
    return null;
  },

  /**
   * Fetch transaction ledger
   * Expected Backend Contract: GET /finance/transactions
   */
  async getTransactions() {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.FINANCE.TRANSACTIONS;
      return await window.apiClient.get(endpoint);
    }
    return null;
  },

  /**
   * Authorize and disburse fund via Paystack / NIBSS transfer
   * Expected Backend Contract: POST /finance/disburse { recipient, amount, type, memo }
   */
  async disbursePayment(paymentData) {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.FINANCE.DISBURSE_PAYSTACK;
      return await window.apiClient.post(endpoint, paymentData);
    }
    return null;
  }
};


// ============================================================
// 5. MEETINGS & BRIEFINGS SERVICE
// ============================================================
const MeetingService = {
  async getMeetings() {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.MEETINGS.LIST;
      return await window.apiClient.get(endpoint);
    }
    return null;
  },

  async scheduleMeeting(meetingData) {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.MEETINGS.CREATE;
      return await window.apiClient.post(endpoint, meetingData);
    }
    return null;
  }
};


// ============================================================
// 6. POLICY DIRECTIVES & ANNOUNCEMENTS SERVICE
// ============================================================
const AnnouncementService = {
  async getAnnouncements() {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.ANNOUNCEMENTS.LIST;
      return await window.apiClient.get(endpoint);
    }
    return null;
  },

  async acknowledgePolicy(announcementId) {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.ANNOUNCEMENTS.ACKNOWLEDGE(announcementId);
      return await window.apiClient.post(endpoint);
    }
    return null;
  }
};


// ============================================================
// 7. SECURITY AUDIT LOGS SERVICE
// ============================================================
const AuditService = {
  async getAuditLogs(params = {}) {
    if (!window.EIMS_CONFIG?.FEATURES?.USE_MOCK_FALLBACK) {
      const endpoint = window.EIMS_CONFIG.ENDPOINTS.AUDIT.LOGS;
      return await window.apiClient.get(endpoint, params);
    }
    return null;
  }
};


// Expose services globally
if (typeof window !== 'undefined') {
  window.AuthService = AuthService;
  window.StaffService = StaffService;
  window.TaskService = TaskService;
  window.FinanceService = FinanceService;
  window.MeetingService = MeetingService;
  window.AnnouncementService = AnnouncementService;
  window.AuditService = AuditService;
}



