window.EIMS_CONFIG = {
  API: {
    BASE_URL: 'http://localhost:5000/api',
    SUPABASE_URL: 'https://rtxmjyenehsjtsccnbxs.supabase.co',
    SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_sTClluOKC8gUpDj0FWoL-w_54uxPBuT'
  },
  ENDPOINTS: {
    TASKS: {
      LIST: '/tasks',
      CREATE: '/tasks',
      UPDATE_STAGE: (id) => `/tasks/${id}/stage`,
      SUBMIT_WORK: (id) => `/tasks/${id}/submissions`,
      REVIEW: (id) => `/tasks/${id}/review`
    }
  },
  STORAGE: {
    AUTH_TOKEN: 'eims_auth_token',
    REFRESH_TOKEN: 'eims_refresh_token',
    SESSION_ROLE: 'eims_session_role',
    SESSION_EMAIL: 'eims_session_email',
    USER_PROFILE: 'eims_user_profile',
    REMEMBER_ME: 'eims_remember_session'
  },
  FEATURES: {
    USE_MOCK_FALLBACK: true,
    TASKS_USE_MOCK_FALLBACK: false,
    DEBUG_LOGGING: true
  }
};







