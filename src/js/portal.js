/**
 * ============================================================
 * ELMUAZ TECHNOLOGIES LTD
 * Internal Company Management System (EIMS) — Client Controller
 * Reactive state management, RBAC enforcement, and 8-stage task workflow
 * ============================================================
 */

// State Store
const state = {
  isAuthenticated: false,
  currentUser: null,
  currentRole: 'ceo', // 'ceo' | 'department_head' | 'employee' | 'accountant'
  currentTab: 'dashboard',
  
  users: [
    { id: 'usr-1', email: 'ceo@elmuaztech.com.ng', password: 'password123', name: "Alhaji Mu'azu", role: 'ceo', department: 'Executive Management', avatar: 'AM', title: 'Founder & CEO', salary: 1200000, status: 'active', auth_provider: 'google', date_of_joining: '2024-01-01' },
    { id: 'usr-2', email: 'lead.eng@elmuaztech.com.ng', password: 'password123', name: 'Fatima Aliyu', role: 'department_head', department: 'Software Engineering', avatar: 'FA', title: 'Engineering Director', salary: 650000, status: 'active', auth_provider: 'email', date_of_joining: '2024-03-15' },
    { id: 'usr-3', email: 'usman@elmuaztech.com.ng', password: 'password123', name: 'Usman Bello', role: 'employee', department: 'Software Engineering', avatar: 'UB', title: 'Senior Software Engineer', salary: 450000, status: 'active', auth_provider: 'google', date_of_joining: '2024-05-10' },
    { id: 'usr-4', email: 'finance@elmuaztech.com.ng', password: 'password123', name: 'Aisha Ibrahim', role: 'accountant', department: 'Finance & Accounts', avatar: 'AI', title: 'Chief Financial Officer', salary: 550000, status: 'active', auth_provider: 'email', date_of_joining: '2024-02-01' },
    { id: 'usr-5', email: 'mustapha@elmuaztech.com.ng', password: 'password123', name: 'Mustapha Garba', role: 'employee', department: 'DevOps & QA', avatar: 'MG', title: 'DevOps & QA Engineer', salary: 380000, status: 'active', auth_provider: 'email', date_of_joining: '2024-08-20' },
    
  ],

  tasks: [],

  meetings: [
    {
      id: 'mtg-1',
      title: 'Weekly Leadership & Sprint Alignment',
      type: 'General',
      time: 'Today • 3:00 PM – 4:00 PM',
      link: 'https://meet.google.com/elm-lead-eims',
      host: "Alhaji Mu'azu",
      participants: ['Alhaji Mu\'azu', 'Fatima Aliyu', 'Aisha Ibrahim', 'Usman Bello'],
      agenda: '1. Review Q4 deliverable milestones\n2. Paystack transaction reconciliation\n3. Client launch dates',
      notes: 'Team agreed to freeze v1 features by Friday for security penetration review.',
      attended: true
    },
    {
      id: 'mtg-2',
      title: 'Engineering Architecture & RLS Review',
      type: 'Engineering Dept',
      time: 'Tomorrow • 10:00 AM – 11:00 AM',
      link: 'https://meet.google.com/elm-tech-deep',
      host: 'Fatima Aliyu',
      participants: ['Fatima Aliyu', 'Usman Bello', 'Mustapha Garba'],
      agenda: 'Verify Supabase Row Level Security policies and multi-tenant table constraints.',
      notes: '',
      attended: false
    }
  ],

  payments: [
    {
      id: 'pay-001',
      ref: 'PSTK-94810284',
      recipient: 'Usman Bello',
      type: 'Salary',
      amount: 450000,
      channel: 'Bank Transfer (NIBSS)',
      status: 'successful',
      timestamp: '2026-10-01 09:14'
    },
    {
      id: 'pay-002',
      ref: 'PSTK-94810285',
      recipient: 'Fatima Aliyu',
      type: 'Salary',
      amount: 600000,
      channel: 'Bank Transfer (NIBSS)',
      status: 'successful',
      timestamp: '2026-10-01 09:15'
    },
    {
      id: 'pay-003',
      ref: 'PSTK-94810286',
      recipient: 'Cloudflare Enterprise Infrastructure',
      type: 'Cloud Hosting Expense',
      amount: 120000,
      channel: 'Corporate Card',
      status: 'successful',
      timestamp: '2026-10-03 14:22'
    },
    {
      id: 'pay-004',
      ref: 'PSTK-94810287',
      recipient: 'Apex Logistics Milestone 2',
      type: 'Client Invoice Payment',
      amount: 1500000,
      channel: 'Paystack Direct Debit',
      status: 'successful',
      timestamp: '2026-10-05 16:40'
    }
  ],

  announcements: [
    {
      id: 'anc-1',
      title: 'MANDATORY DIRECTIVE: Data Privacy & Password Rotation Policy (Q4 2026)',
      author: "Alhaji Mu'azu (CEO)",
      date: 'October 5, 2026',
      requires_acknowledgment: true,
      acknowledged_by: ['Usman Bello', 'Fatima Aliyu'],
      content: `Effective immediately, all staff must enforce two-factor authentication (2FA) across corporate email and database management tools. Sharing API keys or client production database credentials via unencrypted channels is strictly prohibited. Every employee must digitally sign their acknowledgment below.`
    },
    {
      id: 'anc-2',
      title: 'Elmuaz Technologies Welcomes New Enterprise Clients',
      author: 'Fatima Aliyu (Engineering Director)',
      date: 'October 2, 2026',
      requires_acknowledgment: false,
      content: `We have officially onboarded two new corporate clients for our custom ERP platform and AI automation suite. Congratulations to the development and devops teams on the successful discovery workshops!`
    }
  ],

  notifications: [
    { id: 'nt-1', title: 'Task Submitted for Review', desc: 'Usman Bello submitted Paystack Webhook Handler', time: '10m ago', read: false },
    { id: 'nt-2', title: 'Meeting Scheduled', desc: 'Leadership Alignment today at 3:00 PM', time: '1h ago', read: false },
    { id: 'nt-3', title: 'Salary Disbursed', desc: 'October salary confirmed via Paystack transfer', time: '2d ago', read: true }
  ],

  auditLogs: [
    { action: 'auth.login_success', user: "Alhaji Mu'azu", entity: 'portal_session', meta: 'IP: 102.89.42.18 (Lagos, NG)', time: 'Just now' },
    { action: 'payment.disbursed', user: 'Aisha Ibrahim', entity: 'PSTK-94810286', meta: '₦120,000 paid to Cloudflare', time: '3 days ago' },
    { action: 'role.delegation', user: "Alhaji Mu'azu", entity: 'Fatima Aliyu', meta: 'Promoted to Engineering Reviewer', time: '5 days ago' }
  ]
};

// ============================================================
// CONTROLLER INITIALIZATION
// ============================================================

function formatStatus(status) {
  const map = {
    pending: 'Assigned',
    draft: 'Draft',
    assigned: 'Assigned',
    in_progress: 'In Progress',
    review_ready: 'Ready for Review',
    submitted: 'Under Review',
    under_review: 'Under Review',
    needs_correction: 'Needs Revision',
    approved: 'Approved',
    closed: 'Closed',
    completed: 'Completed'
  };
  return map[status] || status.replace('_', ' ');
}

document.addEventListener('DOMContentLoaded', () => {
  initAuthSession();
  renderNotifications();
  setupEventListeners();
});

async function initAuthSession() {
  showLoginGateway();
  if (!window.supabaseClient) {
    console.error('[AUTH] Supabase client is unavailable.');
    return;
  }
  try {
    const { data: { session }, error } = await window.supabaseClient.auth.getSession();
    if (error) {
      console.error('[AUTH] Failed to restore Supabase session:', error);
      return;
    }
    if (!session?.access_token) {
      return;
    }
    const profile = await fetchCurrentProfile(session);
    if (!profile) {
      return;
    }
    if (window.authSession) {
      window.authSession.setSession({
        token: session.access_token,
        refreshToken: session.refresh_token,
        user: profile
      }, true);
    }
    if (profile.status === 'pending_approval') {
      showPendingApprovalScreen(profile);
      return;
    }
    if (profile.status !== 'active') {
      showInactiveAccountMessage(profile);
      return;
    }
    loginAsUser(profile, false);
  } catch (error) {
    console.error('[AUTH] Session restoration failed:', error);
    showLoginGateway();
  }
}

function showLoginGateway() {
  state.isAuthenticated = false;
  state.currentUser = null;
  const authGateway = document.getElementById('authGatewayScreen');
  const portalNav = document.getElementById('portalNav');
  const portalMain = document.getElementById('portalMain');
  const portalFooter = document.getElementById('portalFooter');
  
  if (authGateway) authGateway.style.display = 'flex';
  if (portalNav) portalNav.style.display = 'none';
  if (portalMain) portalMain.style.display = 'none';
  if (portalFooter) portalFooter.style.display = 'none';
}

function selectRolePreset(role) {
  const presets = {
    ceo: { email: 'ceo@elmuaztech.com.ng', role: 'ceo' },
    department_head: { email: 'lead.eng@elmuaztech.com.ng', role: 'department_head' },
    employee: { email: 'usman@elmuaztech.com.ng', role: 'employee' },
    accountant: { email: 'finance@elmuaztech.com.ng', role: 'accountant' }
  };
  
  document.querySelectorAll('.role-preset-card').forEach(c => c.classList.remove('active'));
  document.getElementById(`preset-${role}`)?.classList.add('active');
  
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  if (emailInput && presets[role]) emailInput.value = presets[role].email;
  if (passInput) passInput.value = 'password123';
}

// Switch between Sign In, Sign Up, and Pending Approval views
function switchAuthMode(mode) {
  const loginGroup = document.getElementById('loginFormGroup');
  const signupGroup = document.getElementById('signupFormGroup');
  const pendingGroup = document.getElementById('pendingApprovalGroup');
  const tabSignIn = document.getElementById('tabModeSignIn');
  const tabSignUp = document.getElementById('tabModeSignUp');
  const errorBanner = document.getElementById('authErrorBanner');
  if (errorBanner) errorBanner.style.display = 'none';

  if (mode === 'signup') {
    if (loginGroup) loginGroup.style.display = 'none';
    if (signupGroup) signupGroup.style.display = 'block';
    if (pendingGroup) pendingGroup.style.display = 'none';
    if (tabSignIn) tabSignIn.classList.remove('active');
    if (tabSignUp) tabSignUp.classList.add('active');
  } else if (mode === 'pending') {
    if (loginGroup) loginGroup.style.display = 'none';
    if (signupGroup) signupGroup.style.display = 'none';
    if (pendingGroup) pendingGroup.style.display = 'block';
  } else {
    // login mode
    if (loginGroup) loginGroup.style.display = 'block';
    if (signupGroup) signupGroup.style.display = 'none';
    if (pendingGroup) pendingGroup.style.display = 'none';
    if (tabSignIn) tabSignIn.classList.add('active');
    if (tabSignUp) tabSignUp.classList.remove('active');
  }
}

function showPendingApprovalScreen(user) {
  switchAuthMode('pending');
  const emailEl = document.getElementById('pendingUserEmail');
  if (emailEl) emailEl.textContent = user.email;
  const nameEl = document.getElementById('pendingUserName');
  if (nameEl) nameEl.textContent = user.name;
  const deptEl = document.getElementById('pendingUserDept');
  if (deptEl) deptEl.textContent = `${user.title} (${user.department})`;
}

function checkApprovalStatus() {
  const emailEl = document.getElementById('pendingUserEmail');
  const email = emailEl ? emailEl.textContent.trim().toLowerCase() : '';
  const user = state.users.find(u => u.email.toLowerCase() === email);
  if (user && user.status === 'active') {
    showToast('🎉 Your account has been approved by the CEO! Access granted.');
    loginAsUser(user, true);
  } else {
    showToast('⏳ Still awaiting CEO executive review. Please check back shortly.');
  }
}

async function handleLoginSubmit(e) {
  e.preventDefault();
  const emailInput = document.getElementById('loginEmail');
  const passInput = document.getElementById('loginPassword');
  const email = emailInput ? emailInput.value.trim().toLowerCase() : '';
  const password = passInput ? passInput.value : '';
  const errorBanner = document.getElementById('authErrorBanner');
  const submitBtn = document.getElementById('loginSubmitBtn');
  if (errorBanner) errorBanner.style.display = 'none';
  if (!email || !password) {
    if (errorBanner) {
      errorBanner.style.display = 'block';
      errorBanner.textContent = 'Please enter your email address and password.';
    }
    return;
  }
  if (!window.supabaseClient) {
    if (errorBanner) {
      errorBanner.style.display = 'block';
      errorBanner.textContent = 'Authentication service is unavailable. Please try again later.';
    }
    return;
  }
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
  }
  try {
    const { data, error } = await window.supabaseClient.auth.signInWithPassword({
      email,
      password
    });
    if (error || !data?.session?.access_token) {
      if (errorBanner) {
        errorBanner.style.display = 'block';
        errorBanner.textContent = getAuthErrorMessage(error);
      }
      return;
    }
    const session = data.session;
    const profile = await fetchCurrentProfile(session);
    if (!profile) {
      await window.supabaseClient.auth.signOut();
      return;
    }
    const rememberMe = document.getElementById('rememberMe')?.checked ?? true;
    if (window.authSession) {
      window.authSession.setSession({
        token: session.access_token,
        refreshToken: session.refresh_token,
        user: profile
      }, rememberMe);
    }
    if (profile.status === 'pending_approval') {
      showPendingApprovalScreen(profile);
      return;
    }
    if (profile.status !== 'active') {
      showInactiveAccountMessage(profile);
      return;
    }
    loginAsUser(profile, true);
  } catch (error) {
    console.error('[AUTH] Login failed:', error);
    if (errorBanner) {
      errorBanner.style.display = 'block';
      errorBanner.textContent = 'Unable to sign in right now. Please try again.';
    }
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enter Workspace ?';
    }
  }
}
async function fetchCurrentProfile(session) {
  const token = session?.access_token;
  if (!token) {
    throw new Error('No Supabase access token available.');
  }
  const baseUrl = window.EIMS_CONFIG?.API?.BASE_URL;
  if (!baseUrl) {
    throw new Error('API base URL is not configured.');
  }
  const response = await fetch(`${baseUrl}/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  let payload = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }
  if (!response.ok) {
    if (response.status === 404) {
      showAuthError('Your Supabase account does not have a portal profile yet.');
      return null;
    }
    if (response.status === 401) {
      showAuthError('Your authentication session is invalid. Please sign in again.');
      return null;
    }
    if (response.status === 403) {
      showAuthError('Your account is not currently permitted to access the portal.');
      return null;
    }
    showAuthError(payload?.message || 'Unable to load your portal profile.');
    return null;
  }
  if (!payload?.success || !payload?.profile) {
    showAuthError('Your portal profile could not be loaded.');
    return null;
  }
  return mapBackendProfileToPortalUser(payload.profile);
}
function mapBackendProfileToPortalUser(profile) {
  const fullName = profile.full_name || profile.email?.split('@')[0] || 'Portal User';
  const initials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'ST';
  return {
    id: profile.id,
    email: profile.email || '',
    name: fullName,
    role: profile.role,
    department: profile.department_id || 'Department not assigned',
    department_id: profile.department_id || null,
    avatar: initials,
    avatar_url: profile.avatar_url || null,
    title: profile.job_title || 'Team Member',
    status: profile.status,
    auth_provider: profile.auth_provider || 'email',
    phone: profile.phone || '',
    approved_by: profile.approved_by || null,
    approved_at: profile.approved_at || null,
    created_at: profile.created_at || null,
    updated_at: profile.updated_at || null
  };
}
function getAuthErrorMessage(error) {
  const message = String(error?.message || '').toLowerCase();
  if (message.includes('invalid login credentials')) {
    return 'Incorrect email or password.';
  }
  if (message.includes('email not confirmed')) {
    return 'Your email address has not been confirmed yet.';
  }
  if (message.includes('too many requests')) {
    return 'Too many sign-in attempts. Please wait a moment and try again.';
  }
  return 'Unable to sign in with those credentials.';
}
function showAuthError(message) {
  const errorBanner = document.getElementById('authErrorBanner');
  if (errorBanner) {
    errorBanner.style.display = 'block';
    errorBanner.textContent = message;
  }
}
function showInactiveAccountMessage(user) {
  const messages = {
    suspended: 'Your account is currently suspended. Please contact the CEO or administrator.',
    inactive: 'Your account is inactive. Please contact the CEO or administrator.',
    terminated: 'Your portal access has been terminated.',
    on_leave: 'Your account is currently on leave and portal access is unavailable.',
    probation: 'Your account is currently restricted while under probation.',
    rejected: 'Your registration request was declined by executive management.'
  };
  showAuthError(messages[user.status] || 'Your account is not currently active.');
  if (window.supabaseClient) {
    window.supabaseClient.auth.signOut().catch(() => {});
  }
  if (window.authSession) {
    window.authSession.clearSession();
  }
  showLoginGateway();
}
function handleSignupSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const dept = document.getElementById('signupDept').value;
  const title = document.getElementById('signupTitle').value.trim();
  const pass = document.getElementById('signupPassword').value;
  const errorBanner = document.getElementById('authErrorBanner');

  if (state.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    if (errorBanner) {
      errorBanner.style.display = 'block';
      errorBanner.textContent = 'An account with this email address already exists. Please sign in.';
    }
    return;
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const newUser = {
    id: 'usr-' + Date.now(),
    email: email,
    password: pass || 'password123',
    name: name,
    role: 'employee',
    department: dept,
    avatar: initials || 'ST',
    title: title || 'Team Member',
    status: 'pending_approval',
    auth_provider: 'email',
    created_at: 'Just now',
    date_of_joining: 'Today'
  };

  state.users.push(newUser);
  state.notifications.unshift({
    id: 'nt-' + Date.now(),
    title: 'Staff Registration Awaiting CEO Approval',
    desc: `${name} (${title}) requested portal access.`,
    time: 'Just now',
    read: false
  });
  renderNotifications();
  logAuditAction('auth.signup_submitted', `${name} registered for EIMS portal (pending CEO approval)`, { email, department: dept });

  showToast('Registration submitted! Awaiting CEO executive approval.');
  showPendingApprovalScreen(newUser);
}

// Google OAuth Simulation
function openGooglePickerModal() {
  const modal = document.getElementById('googleAccountPickerModal');
  if (modal) modal.style.display = 'flex';
}

function closeGooglePickerModal() {
  const modal = document.getElementById('googleAccountPickerModal');
  if (modal) modal.style.display = 'none';
}

function selectGoogleAccount(email) {
  closeGooglePickerModal();
  let user = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    if (user.status === 'pending_approval') {
      showPendingApprovalScreen(user);
    } else if (user.status === 'active') {
      loginAsUser(user, true);
      showToast(`✓ Google Workspace authenticated as ${user.name}`);
    } else {
      showToast('Account registration was declined by management.');
    }
  } else {
    // New Google Workspace user
    const promptName = prompt('Enter your full name for Google Workspace registration:', 'Google Staff Member');
    if (!promptName) return;
    const initials = promptName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const newGoogleUser = {
      id: 'usr-' + Date.now(),
      email: email,
      password: 'password123',
      name: promptName,
      role: 'employee',
      department: 'Engineering',
      avatar: initials || 'GW',
      title: 'Associate Engineer',
      status: 'pending_approval',
      auth_provider: 'google',
      created_at: 'Just now',
      date_of_joining: 'Today'
    };
    state.users.push(newGoogleUser);
    state.notifications.unshift({
      id: 'nt-' + Date.now(),
      title: 'Google Account Awaiting CEO Clearance',
      desc: `${promptName} (${email}) requested clearance via Google Workspace.`,
      time: 'Just now',
      read: false
    });
    renderNotifications();
    logAuditAction('auth.google_signup', `${promptName} registered via Google Workspace OAuth`, { email });
    showPendingApprovalScreen(newGoogleUser);
  }
}

function handleCustomGoogleLogin() {
  const inputEmail = prompt('Enter your Google Workspace email address:', 'staff@elmuaztech.com.ng');
  if (inputEmail && inputEmail.includes('@')) {
    selectGoogleAccount(inputEmail.trim());
  }
}

async function loadBackendTasks() {
    if (!window.TaskService) {
        throw new Error('Task service is unavailable.');
    }

    try {
        const response = await window.TaskService.getTasks();

        if (!response?.success || !Array.isArray(response.tasks)) {
            throw new Error(response?.message || 'Unexpected task list response.');
        }

        state.tasks = response.tasks.map(task => ({
            ...task,
            status: task.stage || task.status,
            instructions: task.description || '',
            deadline: task.due_date || '',
            deliverable: task.deliverable_url || '',
            progress: getTaskProgress(task.stage)
        }));

        renderKanbanBoard();
        renderDashboard();

        console.info(`[TASKS] Loaded ${state.tasks.length} backend task(s).`);
    } catch (error) {
        console.error('[TASKS] Failed to load backend tasks:', error);
        state.tasks = [];
        renderKanbanBoard();
        renderDashboard();
        showToast(`Could not load tasks from the server. ${error.message || 'Please try again.'}`);
    }
}

function getTaskProgress(stage) {
    const progressMap = {
        draft: 0,
        assigned: 10,
        in_progress: 40,
        review_ready: 70,
        under_review: 80,
        needs_correction: 60,
        approved: 100,
        closed: 100
    };

    return typeof stage === 'number' ? Math.round((stage / 8) * 100) : (progressMap[stage] ?? 0);
}
function getTaskStageNumber(stage) {
  if (typeof stage === 'number') return stage;
  return ({ draft: 1, assigned: 2, in_progress: 3, review_ready: 4, under_review: 5, needs_correction: 7, approved: 7, closed: 8 })[stage] || 1;
}
function loginAsUser(user, showWelcome = true) {
  state.isAuthenticated = true;
  state.currentUser = user;
  state.currentRole = user.role;
  const authGateway = document.getElementById('authGatewayScreen');
  const portalNav = document.getElementById('portalNav');
  const portalMain = document.getElementById('portalMain');
  const portalFooter = document.getElementById('portalFooter');
  if (authGateway) authGateway.style.display = 'none';
  if (portalNav) portalNav.style.display = 'block';
  if (portalMain) portalMain.style.display = 'block';
  if (portalFooter) portalFooter.style.display = 'block';
  applyRoleLayout(user);
    loadBackendTasks();
  navigateTo('dashboard');
  if (showWelcome) {
    showToast(`? Welcome, ${user.name} (${user.title})`);
    logAuditAction(
      'auth.login_success',
      `${user.name} authenticated via ${user.auth_provider === 'google' ? 'Google Workspace' : 'email'}`,
      { role: user.role }
    );
  }
}
async function handleLogout() {
  const currentUser = state.currentUser;
  try {
    if (window.supabaseClient) {
      await window.supabaseClient.auth.signOut();
    }
  } catch (error) {
    console.warn('[AUTH] Supabase sign-out failed:', error);
  } finally {
    if (window.authSession) {
      window.authSession.clearSession();
    } else {
      localStorage.removeItem('eims_session_role');
      localStorage.removeItem('eims_session_email');
    }
    state.isAuthenticated = false;
    state.currentUser = null;
    state.currentRole = null;
    showToast('Logged out of private workspace.');
    if (currentUser) {
      logAuditAction('auth.logout', `${currentUser.name} signed out`);
    }
    showLoginGateway();
  }
}
function applyRoleLayout(user) {
  const role = user.role;

  // Header identity
  const userAvatar = document.getElementById('userAvatar');
  const userDisplayName = document.getElementById('userDisplayName');
  const userDisplayRole = document.getElementById('userDisplayRole');
  const navRoleBadge = document.getElementById('navRoleBadge');

  if (userAvatar) userAvatar.textContent = user.avatar;
  if (userDisplayName) userDisplayName.textContent = user.name;
  if (userDisplayRole) userDisplayRole.textContent = user.title;
  
  const roleBadgeMap = {
    ceo: '👑 Executive Suite',
    department_head: '💼 Dept Head',
    employee: '👨‍💻 Employee',
    accountant: '💰 Treasury & Finance'
  };
  if (navRoleBadge) navRoleBadge.textContent = roleBadgeMap[role] || 'Internal Portal';

  // Partition Navigation Tabs strictly by role
  const tabProjects = document.getElementById('tabBtn-projects');
  const tabFinance = document.getElementById('tabBtn-finance');
  const tabAudit = document.getElementById('tabBtn-audit');
  const tabTasks = document.getElementById('tabBtn-tasks');

  const labelTasks = document.getElementById('labelTab-tasks');
  if (labelTasks) {
    if (role === 'employee') labelTasks.textContent = 'My Tasks';
    else if (role === 'department_head') labelTasks.textContent = 'Dept Review';
    else labelTasks.textContent = 'Tasks & Review';
  }

  if (tabProjects) tabProjects.style.display = (role === 'employee') ? 'none' : 'flex';
  if (tabFinance) tabFinance.style.display = (role === 'ceo' || role === 'accountant') ? 'flex' : 'none';
  if (tabAudit) tabAudit.style.display = (role === 'ceo') ? 'flex' : 'none';
  if (tabTasks) tabTasks.style.display = (role === 'accountant') ? 'none' : 'flex';

  // Dashboard texts
  const roleBadgeEl = document.getElementById('roleBadge');
  if (roleBadgeEl) roleBadgeEl.textContent = `${user.title} Workspace`;

  const welcomeHeading = document.getElementById('welcomeHeading');
  if (welcomeHeading) welcomeHeading.textContent = `Welcome back, ${user.name}`;

  const welcomeSubtext = document.getElementById('welcomeSubtext');
  if (welcomeSubtext) {
    if (role === 'employee') {
      welcomeSubtext.textContent = 'Your assigned tasks, deliverable submissions, and meeting calendar.';
    } else if (role === 'department_head') {
      welcomeSubtext.textContent = 'Engineering team tasks, sprint deliverables, and submissions awaiting review.';
    } else if (role === 'accountant') {
      welcomeSubtext.textContent = 'Corporate treasury balances, Paystack disbursements, and payroll reconciliation.';
    } else {
      welcomeSubtext.textContent = 'Executive oversight across company operations, team deliverables, finances, and security audit.';
    }
  }

  const quickPayBtn = document.getElementById('quickPayBtn');
  if (quickPayBtn) quickPayBtn.style.display = (role === 'ceo' || role === 'accountant') ? 'inline-flex' : 'none';

  // CEO Specific Staff Controls
  const ceoApprovalsWidget = document.getElementById('ceoApprovalsWidget');
  const btnOnboardEmployee = document.getElementById('btnOnboardEmployee');
  const btnOnboardInProjects = document.getElementById('btnOnboardInProjects');

  if (ceoApprovalsWidget) ceoApprovalsWidget.style.display = (role === 'ceo') ? 'block' : 'none';
  if (btnOnboardEmployee) btnOnboardEmployee.style.display = (role === 'ceo') ? 'inline-flex' : 'none';
  if (btnOnboardInProjects) btnOnboardInProjects.style.display = (role === 'ceo') ? 'inline-flex' : 'none';

  if (role === 'ceo') {
    loadBackendPendingApprovals();
  }
}

function setupEventListeners() {
  // Close modals on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTaskModal();
      closeCreateTaskModal();
      closePaymentModal();
      closeScheduleMeetingModal();
      closeGooglePickerModal();
      closeAddEmployeeModal();
      closeEditEmployeeModal();
      toggleNotifDrawer(false);
    }
  });
}

// ============================================================
// NAVIGATION & VIEW SWITCHING
// ============================================================

function navigateTo(tabName) {
  state.currentTab = tabName;
  
  // Update nav buttons
  document.querySelectorAll('.portal-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Update views
  document.querySelectorAll('.portal-view').forEach(view => {
    view.style.display = 'none';
  });

  const targetView = document.getElementById(`view-${tabName}`);
  if (targetView) {
    targetView.style.display = 'block';
  }

  // Render content according to tab
  switch (tabName) {
    case 'dashboard':
      renderDashboard();
      break;
    case 'tasks':
      renderKanbanBoard();
      break;
    case 'projects':
      renderTeamDirectory();
      break;
    case 'meetings':
      renderMeetings();
      break;
    case 'finance':
      renderFinanceLedger();
      break;
    case 'announcements':
      renderAnnouncements();
      break;
    case 'audit':
      renderAuditLogs();
      break;
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// 1. DASHBOARD VIEW RENDERER
// ============================================================

function renderDashboard() {
  const role = state.currentRole;
  const user = state.currentUser || state.users[0];

  // Role-specific stats
  const statTitles = document.querySelectorAll('.stat-title');
  if (role === 'employee') {
    const myTasks = state.tasks.filter(t => t.assigned_to === user.id || t.assigned_to === user.name);
    const myActive = myTasks.filter(t => !['approved', 'closed'].includes(t.status)).length;

    document.getElementById('statTeam').textContent = user.department || 'Engineering';
    document.getElementById('statTasks').textContent = myActive;
    document.getElementById('statFinance').textContent = '₦' + (user.salary ? user.salary.toLocaleString() : '450,000');
    document.getElementById('statMeetings').textContent = '1';

    if (statTitles.length >= 4) {
      statTitles[0].textContent = 'My Department';
      statTitles[1].textContent = 'My Active Tasks';
      statTitles[2].textContent = 'Monthly Salary';
      statTitles[3].textContent = 'My Next Meeting';
    }
  } else if (role === 'accountant') {
    document.getElementById('statTeam').textContent = '18 Staff';
    document.getElementById('statTasks').textContent = '2';
    document.getElementById('statFinance').textContent = '₦4,850,000';
    document.getElementById('statMeetings').textContent = '1';

    if (statTitles.length >= 4) {
      statTitles[0].textContent = 'Payroll Enrolled';
      statTitles[1].textContent = 'Pending Vouchers';
      statTitles[2].textContent = 'Available Capital';
      statTitles[3].textContent = 'Scheduled Briefings';
    }
  } else {
    const activeStaffCount = state.users.filter(u => u.status === 'active').length;
    document.getElementById('statTeam').textContent = activeStaffCount;
    document.getElementById('statTasks').textContent = state.tasks.filter(t => !['approved', 'closed'].includes(t.status)).length;
    document.getElementById('statFinance').textContent = '₦4,850,000';
    document.getElementById('statMeetings').textContent = state.meetings.length;

    if (role === 'ceo') {
      renderPendingApprovals();
    }

    if (statTitles.length >= 4) {
      statTitles[0].textContent = 'Active Team';
      statTitles[1].textContent = 'Pending Tasks';
      statTitles[2].textContent = 'Available Capital';
      statTitles[3].textContent = 'Upcoming Meetings';
    }
  }
  
  // Priority Tasks snippet (filtered by role)
  const taskListEl = document.getElementById('dashboardTaskList');
  taskListEl.innerHTML = '';
  
  // The backend scopes this list to the authenticated user. Do not apply
  // additional name/project filters to backend-authorized task records.
  const relevantTasks = state.tasks;

  const priorityTasks = relevantTasks.slice(0, 3);
  if (priorityTasks.length === 0) {
    taskListEl.innerHTML = '<div style="padding: 14px; color: var(--text-color-secondary); font-size: 13px;">No active tasks assigned to you right now.</div>';
  } else {
    priorityTasks.forEach(task => {
      const item = document.createElement('div');
      item.className = 'glass-thin row-between';
      item.style.padding = 'var(--spacing-sm)';
      item.style.borderRadius = '14px';
      item.style.cursor = 'pointer';
      item.onclick = () => openTaskModal(task.id);

      item.innerHTML = `
        <div>
          <div style="font-weight: var(--weight-semibold); font-size: var(--text-sm);">${task.title}</div>
          <div style="font-size: var(--text-xs); color: var(--text-color-secondary); margin-top: 2px;">
            Assignee: <strong>${task.assigned_to || ''}</strong> • Due: ${task.deadline || ''}
          </div>
        </div>
        <div class="row" style="gap: 8px;">
          <span class="task-priority-badge priority-${task.priority}">${task.priority}</span>
          <span class="badge ${['approved', 'closed'].includes(task.status) ? 'badge-success' : 'badge-brand'}">${formatStatus(task.status)}</span>
        </div>
      `;
      taskListEl.appendChild(item);
    });
  }

  // Scheduled Meetings snippet
  const meetingListEl = document.getElementById('dashboardMeetingList');
  meetingListEl.innerHTML = '';
  
  state.meetings.forEach(mtg => {
    const item = document.createElement('div');
    item.className = 'glass-thin row-between';
    item.style.padding = 'var(--spacing-sm)';
    item.style.borderRadius = '14px';

    item.innerHTML = `
      <div>
        <div style="font-weight: var(--weight-semibold); font-size: var(--text-sm);">${mtg.title}</div>
        <div style="font-size: var(--text-xs); color: var(--text-color-secondary); margin-top: 2px;">
          ${mtg.time} • Host: ${mtg.host}
        </div>
      </div>
      <a href="${mtg.link}" target="_blank" class="btn btn-brand btn-sm btn-pill" style="text-decoration: none;">
        Join Meet ↗
      </a>
    `;
    meetingListEl.appendChild(item);
  });
}

// ============================================================
// 2. KANBAN & 8-STAGE TASK WORKFLOW
// ============================================================

let currentFilter = 'all';

function filterTasks(filter, btn) {
  currentFilter = filter;
  btn.parentElement.querySelectorAll('.btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderKanbanBoard();
}

function renderKanbanBoard() {
  const colPending = document.getElementById('colPending');
  const colInProgress = document.getElementById('colInProgress');
  const colReview = document.getElementById('colReview');
  const colCompleted = document.getElementById('colCompleted');

  colPending.innerHTML = '';
  colInProgress.innerHTML = '';
  colReview.innerHTML = '';
  colCompleted.innerHTML = '';

  let pending = 0, inProg = 0, review = 0, comp = 0;
  const role = state.currentRole;
  const user = state.currentUser || state.users[0];

  // Role separation for tasks
  // GET /tasks is already scoped by backend authorization.
  const tasksPool = state.tasks;

  tasksPool.forEach(task => {
    // Filter logic
    if (currentFilter !== 'all') {
      if (currentFilter === 'assigned' && task.status !== 'assigned' && task.status !== 'draft') return;
      if (currentFilter === 'in_progress' && task.status !== 'in_progress') return;
      if (currentFilter === 'submitted' && !['review_ready', 'under_review', 'needs_correction'].includes(task.status)) return;
      if (currentFilter === 'completed' && !['approved', 'closed'].includes(task.status)) return;
    }

    const card = createTaskCard(task);

    if (task.status === 'draft' || task.status === 'assigned') {
      colPending.appendChild(card);
      pending++;
    } else if (task.status === 'in_progress') {
      colInProgress.appendChild(card);
      inProg++;
    } else if (task.status === 'review_ready' || task.status === 'under_review' || task.status === 'needs_correction') {
      colReview.appendChild(card);
      review++;
    } else if (task.status === 'closed' || task.status === 'approved') {
      colCompleted.appendChild(card);
      comp++;
    }
  });

  document.getElementById('countPending').textContent = pending;
  document.getElementById('countInProgress').textContent = inProg;
  document.getElementById('countReview').textContent = review;
  document.getElementById('countCompleted').textContent = comp;
}

function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-item-card';
  card.onclick = () => openTaskModal(task.id);

  card.innerHTML = `
    <div class="row-between" style="margin-bottom: 8px;">
      <span class="task-priority-badge priority-${task.priority}">${task.priority}</span>
      <span style="font-size: 11px; color: var(--text-color-secondary);">Stage ${getTaskStageNumber(task.stage)}/8</span>
    </div>
    <div style="font-weight: var(--weight-semibold); font-size: var(--text-sm); margin-bottom: 8px; line-height: 1.35;">
      ${task.title}
    </div>
    <div style="height: 4px; background: rgba(0,0,0,0.06); border-radius: 2px; overflow: hidden; margin-bottom: 10px;">
      <div style="width: ${task.progress}%; height: 100%; background: var(--color-brand-orange);"></div>
    </div>
    <div class="row-between" style="font-size: var(--text-xs); color: var(--text-color-secondary);">
      <span>👤 ${String(task.assigned_to || '').split(' ')[0]}</span>
      <span>📅 ${String(task.deadline || '').slice(5)}</span>
    </div>
  `;
  return card;
}

// Task Detail Modal (The 8-Stage Lifecycle Engine)
let activeModalTaskId = null;

function openTaskModal(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  activeModalTaskId = taskId;
  document.getElementById('modalTaskTitle').textContent = task.title;
  document.getElementById('modalTaskInstructions').textContent = task.instructions;
  document.getElementById('modalTaskAssignee').textContent = task.assigned_to;
  document.getElementById('modalTaskDeadline').textContent = task.deadline;
  
  const priorityEl = document.getElementById('modalTaskPriority');
  priorityEl.textContent = `${task.priority.toUpperCase()} PRIORITY`;
  priorityEl.className = `badge task-priority-badge priority-${task.priority}`;

  // Update Stepper
  const steps = ['create', 'assign', 'work', 'submit', 'review', 'decision', 'correction', 'close'];
  steps.forEach((stepName, idx) => {
    const el = document.getElementById(`step-${stepName}`);
    if (!el) return;
    el.classList.remove('completed', 'active');
    if (idx + 1 < task.stage) {
      el.classList.add('completed');
    } else if (idx + 1 === task.stage) {
      el.classList.add('active');
    }
  });

  // Render Deliverable
  const delivEl = document.getElementById('modalDeliverables');
  if (task.deliverable) {
    delivEl.innerHTML = `
      <div class="row-between">
        <div>
          <span style="font-size: 11px; color: var(--text-color-secondary);">Work Deliverable URL / Pull Request:</span>
          <div style="font-weight: 600; font-size: var(--text-sm);"><a href="${task.deliverable}" target="_blank" style="color: var(--color-brand-orange);">${task.deliverable}</a></div>
        </div>
        <span class="badge badge-success">Submitted</span>
      </div>
    `;
  } else {
    delivEl.innerHTML = `<span style="font-size: var(--text-xs); color: var(--text-color-secondary);">No deliverables submitted yet for this stage.</span>`;
  }

  // Render Action Zone based on role and stage
  renderTaskActionZone(task);

  document.getElementById('taskModal').style.display = 'flex';
}

function renderTaskActionZone(task) {
  const zone = document.getElementById('taskActionZone');
  zone.innerHTML = '';
  const role = state.currentRole;
  const isAssignee = task.assigned_to === state.currentUser?.id || task.assigned_to === state.currentUser?.name;
  const isReviewer = role === 'ceo' || role === 'department_head';

  if ((task.status === 'draft' || task.status === 'assigned') && isAssignee) {
    zone.innerHTML = `
      <div class="row-between">
        <span style="font-size: var(--text-xs); color: var(--text-color-secondary);">Task ready to be started:</span>
        <button class="btn btn-brand btn-sm" onclick="advanceTaskStage('${task.id}', 'in_progress')">Start Working →</button>
      </div>
    `;
  } else if ((task.status === 'in_progress' || task.status === 'needs_correction') && isAssignee) {
    zone.innerHTML = `
      <div class="stack stack-xs">
        <label class="label" for="workContentInput" style="font-size: 11px;">Work description</label>
        <textarea id="workContentInput" class="textarea" rows="3" maxlength="10000" placeholder="Describe the work you completed..."></textarea>
        <label class="label" for="deliverableInput" style="font-size: 11px;">Submission URL (optional)</label>
        <input type="url" id="deliverableInput" class="input input-sm" maxlength="2048" placeholder="Paste a GitHub PR, Figma, or document URL..." value="${task.deliverable || ''}">
        <button class="btn btn-brand btn-sm" onclick="submitTaskWork('${task.id}')">Submit for Review</button>
      </div>
    `;
  } else if (task.status === 'review_ready' || task.status === 'under_review') {
    if (isReviewer) {
      zone.innerHTML = `
        <div class="stack stack-xs">
          <div style="font-weight: var(--weight-semibold); font-size: var(--text-xs); color: var(--color-brand-orange);">
            Reviewer Decision Protocol (Stages 5–8)
          </div>
          <div class="row" style="gap: var(--spacing-sm);">
            <button class="btn btn-brand btn-sm" onclick="decideTask('${task.id}', 'approved')">✓ Approve</button>
            <button class="btn btn-secondary btn-sm" onclick="decideTask('${task.id}', 'needs_correction')">↺ Return for Correction</button>
          </div>
        </div>
      `;
    } else {
      zone.innerHTML = `
        <div style="font-size: var(--text-xs); color: var(--color-brand-orange);">
          ⏳ Work submitted. Currently under review by ${task.reviewer || 'Management'}.
        </div>
      `;
    }
  } else if (task.status === 'approved' && isReviewer) {
    zone.innerHTML = `<button class="btn btn-brand btn-sm" onclick="advanceTaskStage('${task.id}', 'closed')">Close Task</button>`;
  } else if (task.status === 'closed') {
    zone.innerHTML = `
      <div class="row-between">
        <span style="color: var(--color-brand-emerald); font-weight: 600; font-size: var(--text-sm);">✓ Task Approved & Closed</span>
        <span style="font-size: 11px; color: var(--text-color-secondary);">Retained in company audit trail</span>
      </div>
    `;
  }
}

async function submitTaskWork(taskId) {
  const input = document.getElementById('deliverableInput');
  const link = input ? input.value.trim() : '';
  const contentInput = document.getElementById('workContentInput');
  const content = contentInput ? contentInput.value.trim() : '';
  const task = state.tasks.find(t => t.id === taskId);
  if (!task || (!content && !link)) {
    showToast('Enter a work description or submission URL before submitting.');
    return;
  }
  try {
    await window.TaskService.submitDeliverable(task.id, content || null, link || null);
    await loadBackendTasks();
    logAuditAction('task.submission', `Work deliverable submitted for ${task.title}`, { taskId });
    showToast('✓ Work submitted for management review!');
    if (state.tasks.some(item => item.id === taskId)) openTaskModal(taskId);
  } catch (error) {
    console.error('[TASKS] Failed to submit task work:', error);
    showToast(`Could not submit task work. ${error.message || 'Please try again.'}`);
    await loadBackendTasks();
  }
}

const taskReviewRequestsInProgress = new Set();

async function decideTask(taskId, decision) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task || !['approved', 'needs_correction'].includes(decision)) return;
  if (taskReviewRequestsInProgress.has(taskId)) return;
  taskReviewRequestsInProgress.add(taskId);

  try {
    if (task.status === 'review_ready') {
      try {
        await window.TaskService.advanceStage(task.id, 'under_review');
      } catch (error) {
        console.error('[TASKS] Failed to move task into review:', error);
        showToast(`Could not move task into review. ${error.message || 'Please refresh and try again.'}`);
        await loadBackendTasks();
        return;
      }
    } else if (task.status !== 'under_review') {
      showToast('This task is no longer ready for review. Refresh the task and try again.');
      await loadBackendTasks();
      return;
    }

    await window.TaskService.reviewTask(task.id, decision, '');
    await loadBackendTasks();
    logAuditAction(decision === 'approved' ? 'task.approved' : 'task.correction_requested', `Task review recorded: ${task.title}`, { taskId });
    showToast(decision === 'approved' ? '✓ Task approved.' : '↺ Task returned for correction.');
    if (state.tasks.some(item => item.id === taskId)) openTaskModal(taskId);
  } catch (error) {
    console.error('[TASKS] Failed to review task:', error);
    showToast(`Could not review task. ${error.message || 'Please try again.'}`);
    await loadBackendTasks();
  } finally {
    taskReviewRequestsInProgress.delete(taskId);
  }
}

async function advanceTaskStage(taskId, stage) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;
  try {
    await window.TaskService.advanceStage(task.id, stage);
    await loadBackendTasks();
    showToast(`Task moved to ${stage.replace('_', ' ')}.`);
    if (state.tasks.some(item => item.id === taskId)) openTaskModal(taskId);
  } catch (error) {
    console.error('[TASKS] Failed to update task stage:', error);
    showToast(`Could not update task stage. ${error.message || 'Please try again.'}`);
    await loadBackendTasks();
  }
}

function closeTaskModal() {
  document.getElementById('taskModal').style.display = 'none';
}

// Create Task Modal
async function openCreateTaskModal() {
  document.getElementById('createTaskModal').style.display = 'flex';
  const assigneeSelect = document.getElementById('newTaskAssignee');
  assigneeSelect.disabled = true;
  assigneeSelect.innerHTML = '<option value="">Loading employees…</option>';

  try {
    const response = await window.apiClient.get('/profiles');
    const profiles = response?.profiles || response?.staff || response?.employees || [];
    const employees = profiles.filter(profile =>
      profile?.status === 'active' &&
      profile?.id &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(profile.id)
    );

    assigneeSelect.replaceChildren();
    employees.forEach(profile => {
      const name = profile.full_name || profile.name || profile.email || 'Employee';
      const option = document.createElement('option');
      option.value = profile.id;
      option.textContent = `${name}${profile.job_title ? ` (${profile.job_title})` : ''}`;
      assigneeSelect.appendChild(option);
    });

    if (!employees.length) {
      throw new Error('No employees with valid profile IDs were returned.');
    }
    assigneeSelect.disabled = false;
  } catch (error) {
    console.error('[TASKS] Failed to load task assignees:', error);
    assigneeSelect.innerHTML = '<option value="">Could not load employees</option>';
    showToast(`Could not load employees. ${error.message || 'Please try again.'}`);
  }
}

function closeCreateTaskModal() {
  document.getElementById('createTaskModal').style.display = 'none';
}

async function handleCreateTask(e) {
  e.preventDefault();
  const title = document.getElementById('newTaskTitle').value;
  const priority = document.getElementById('newTaskPriority').value;
  const assignee = document.getElementById('newTaskAssignee').value;
  const deadline = document.getElementById('newTaskDeadline').value;
  const instructions = document.getElementById('newTaskInstructions').value;

  const taskData = {
    title,
    description: instructions,
    priority,
    assigned_to: assignee,
    due_date: deadline ? new Date(`${deadline}T23:59:59+01:00`).toISOString() : null
  };
  try {
    if (!assignee || !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(assignee)) {
      throw new Error('Select an employee with a valid profile ID.');
    }
    const response = await window.TaskService.createTask(taskData);
    if (!response?.success) {
      throw new Error(response?.message || 'The server did not confirm task creation.');
    }
    await loadBackendTasks();
    logAuditAction('task.created', `Created task: ${title}`, { assignee, priority });
    showToast('✓ New task assigned.');
    closeCreateTaskModal();
    navigateTo('tasks');
  } catch (error) {
    console.error('[TASKS] Failed to create task:', error);
    showToast(`Could not create task. ${error.message || 'Please try again.'}`);
  }
}

// ============================================================
// 3. LIVE MEETINGS & NOTES
// ============================================================

function renderMeetings() {
  const container = document.getElementById('meetingsContainer');
  container.innerHTML = '';

  state.meetings.forEach(mtg => {
    const card = document.createElement('div');
    card.className = 'glass-primary';
    card.style.padding = 'var(--spacing-lg)';
    card.style.borderRadius = 'var(--radius-card)';

    card.innerHTML = `
      <div class="row-between" style="margin-bottom: var(--spacing-sm);">
        <span class="badge" style="background: var(--color-brand-orange-soft); color: var(--color-brand-orange);">${mtg.type}</span>
        <span class="badge ${mtg.attended ? 'badge-success' : ''}">${mtg.attended ? '✓ Attended' : 'Scheduled'}</span>
      </div>
      <h3 style="font-family: var(--font-brand); margin-bottom: 6px;">${mtg.title}</h3>
      <div style="font-size: var(--text-xs); color: var(--text-color-secondary); margin-bottom: var(--spacing-sm);">
        🕒 ${mtg.time} • Host: <strong>${mtg.host}</strong>
      </div>
      <div class="glass-thin" style="padding: var(--spacing-sm); border-radius: 12px; margin-bottom: var(--spacing-md); font-size: var(--text-xs);">
        <strong style="color: var(--text-color-primary);">Agenda:</strong>
        <p style="white-space: pre-line; margin-top: 4px; color: var(--text-color-secondary);">${mtg.agenda}</p>
      </div>
      <div class="row-between">
        <a href="${mtg.link}" target="_blank" class="btn btn-brand btn-pill btn-sm" style="text-decoration: none;">
          📹 Join Google Meet Room
        </a>
        <button class="btn btn-secondary btn-sm btn-pill" onclick="showToast('Attendance recorded for this session')">
          Mark Attendance
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openScheduleMeetingModal() {
  document.getElementById('scheduleMeetingModal').style.display = 'flex';
}

function closeScheduleMeetingModal() {
  document.getElementById('scheduleMeetingModal').style.display = 'none';
}

function handleScheduleMeeting(e) {
  e.preventDefault();
  const topic = document.getElementById('meetingTopic').value;
  const type = document.getElementById('meetingType').value;
  const time = document.getElementById('meetingTime').value;
  const agenda = document.getElementById('meetingAgenda').value;

  const newMeeting = {
    id: `mtg-${Date.now()}`,
    title: topic,
    type: type.toUpperCase(),
    time: `Today • ${time}`,
    link: `https://meet.google.com/elm-${Math.random().toString(36).substring(2, 7)}`,
    host: state.currentRole === 'ceo' ? "Alhaji Mu'azu" : 'Fatima Aliyu',
    participants: ['Team'],
    agenda,
    notes: '',
    attended: false
  };

  state.meetings.unshift(newMeeting);
  logAuditAction('meeting.scheduled', `Scheduled session: ${topic}`, { time, link: newMeeting.link });
  showToast('✓ Meeting scheduled with Google Meet link generated!');
  closeScheduleMeetingModal();
  navigateTo('meetings');
}

// ============================================================
// 4. FINANCE & PAYSTACK INTEGRATION
// ============================================================

function renderFinanceLedger() {
  const tbody = document.getElementById('paymentLedgerBody');
  tbody.innerHTML = '';

  state.payments.forEach(pay => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-divider)';

    tr.innerHTML = `
      <td style="padding: 12px 10px; font-family: var(--font-mono); font-size: var(--text-xs); color: var(--color-brand-orange); font-weight: 600;">
        ${pay.ref}
      </td>
      <td style="padding: 12px 10px; font-size: var(--text-xs);">
        <strong>${pay.recipient}</strong>
        <div style="color: var(--text-color-secondary); font-size: 11px;">${pay.type}</div>
      </td>
      <td style="padding: 12px 10px; font-weight: var(--weight-bold); font-family: var(--font-brand); font-size: var(--text-sm);">
        ₦${pay.amount.toLocaleString()}
      </td>
      <td style="padding: 12px 10px; font-size: 11px; color: var(--text-color-secondary);">
        ${pay.channel}
      </td>
      <td style="padding: 12px 10px;">
        <span class="badge badge-success">✓ Successful</span>
      </td>
      <td style="padding: 12px 10px; font-size: 11px; color: var(--text-color-secondary);">
        ${pay.timestamp}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openPaymentModal() {
  document.getElementById('paymentModal').style.display = 'flex';
}

function closePaymentModal() {
  document.getElementById('paymentModal').style.display = 'none';
}

function handlePaystackDisbursement(e) {
  e.preventDefault();
  const recipient = document.getElementById('payRecipient').value;
  const amount = Number(document.getElementById('payAmount').value);
  const type = document.getElementById('payType').value;
  const memo = document.getElementById('payMemo').value;

  const submitBtn = document.getElementById('paySubmitBtn');
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing with Paystack Gateway...';

  setTimeout(() => {
    const newTxn = {
      id: `pay-${Date.now()}`,
      ref: `PSTK-${Math.floor(10000000 + Math.random() * 90000000)}`,
      recipient,
      type: memo || type,
      amount,
      channel: 'Paystack NIBSS Instant Transfer',
      status: 'successful',
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    state.payments.unshift(newTxn);
    logAuditAction('finance.paystack_disbursement', `Disbursed ₦${amount.toLocaleString()} to ${recipient}`, { ref: newTxn.ref });
    
    showToast(`✓ Paystack Verified: ₦${amount.toLocaleString()} paid to ${recipient}`);
    submitBtn.disabled = false;
    submitBtn.textContent = `Authorize & Disburse ₦${amount.toLocaleString()}`;
    closePaymentModal();
    renderFinanceLedger();
  }, 1200);
}

// ============================================================
// 5. ANNOUNCEMENTS & DIGITAL SIGNATURE ACKNOWLEDGMENT
// ============================================================

function renderAnnouncements() {
  const container = document.getElementById('announcementsList');
  container.innerHTML = '';
  const currentUserName = state.users.find(u => u.role === state.currentRole)?.name || 'User';

  state.announcements.forEach(anc => {
    const isAcked = anc.acknowledged_by && anc.acknowledged_by.includes(currentUserName);
    const card = document.createElement('div');
    card.className = 'glass-primary';
    card.style.padding = 'var(--spacing-lg)';
    card.style.borderRadius = 'var(--radius-card)';

    card.innerHTML = `
      <div class="row-between" style="margin-bottom: var(--spacing-xs);">
        <div class="row" style="gap: 8px;">
          <span style="font-size: 18px;">📢</span>
          <span class="badge" style="background: var(--color-brand-orange-soft); color: var(--color-brand-orange); font-weight: 600;">Executive Bulletin</span>
        </div>
        <span style="font-size: var(--text-xs); color: var(--text-color-secondary);">${anc.date}</span>
      </div>
      <h3 style="font-family: var(--font-brand); margin: 6px 0 var(--spacing-sm);">${anc.title}</h3>
      <div style="color: var(--text-color-secondary); line-height: 1.6; font-size: var(--text-sm); margin-bottom: var(--spacing-md); white-space: pre-line;">
        ${anc.content}
      </div>
      ${anc.requires_acknowledgment ? `
        <div class="glass-thin row-between" style="padding: var(--spacing-sm); border-radius: 14px; border: 1px solid rgba(249,115,22,0.3);">
          <div>
            <div style="font-weight: 600; font-size: var(--text-xs); color: var(--color-brand-orange);">Digital Acknowledgment Required</div>
            <div style="font-size: 11px; color: var(--text-color-secondary);">Compliance verification timestamp recorded in audit log.</div>
          </div>
          <button class="btn ${isAcked ? 'btn-secondary' : 'btn-brand'} btn-sm btn-pill" onclick="acknowledgeAnnouncement('${anc.id}')" ${isAcked ? 'disabled' : ''}>
            ${isAcked ? '✓ Acknowledged by You' : '✍ I Acknowledge & Understand'}
          </button>
        </div>
      ` : ''}
    `;
    container.appendChild(card);
  });
}

function acknowledgeAnnouncement(ancId) {
  const anc = state.announcements.find(a => a.id === ancId);
  const currentUserName = state.users.find(u => u.role === state.currentRole)?.name || 'User';
  if (!anc) return;

  if (!anc.acknowledged_by) anc.acknowledged_by = [];
  if (!anc.acknowledged_by.includes(currentUserName)) {
    anc.acknowledged_by.push(currentUserName);
  }

  logAuditAction('policy.acknowledged', `Signed acknowledgment for: ${anc.title}`, { user: currentUserName });
  showToast(`✓ Digital signature recorded for ${currentUserName}`);
  renderAnnouncements();
}

// ============================================================
// 6. ADMINISTRATIVE SECURITY AUDIT LOGS
// ============================================================

function renderAuditLogs() {
  const tbody = document.getElementById('auditLogsBody');
  tbody.innerHTML = '';

  state.auditLogs.forEach(log => {
    const tr = document.createElement('tr');
    tr.style.borderBottom = '1px solid var(--border-divider)';

    tr.innerHTML = `
      <td style="padding: 10px; font-family: var(--font-mono); font-size: 11px; font-weight: 600; color: var(--color-brand-navy);">
        ${log.action}
      </td>
      <td style="padding: 10px; font-size: var(--text-xs);">
        <strong>${log.user}</strong>
      </td>
      <td style="padding: 10px; font-size: var(--text-xs); color: var(--text-color-secondary);">
        ${log.entity}
      </td>
      <td style="padding: 10px; font-size: 11px; color: var(--text-color-secondary);">
        ${log.meta}
      </td>
      <td style="padding: 10px; font-size: 11px; color: var(--text-color-secondary);">
        ${log.time}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function logAuditAction(action, meta, extra = {}) {
  const currentUserName = state.users.find(u => u.role === state.currentRole)?.name || 'System';
  state.auditLogs.unshift({
    action,
    user: currentUserName,
    entity: extra.entity || 'portal_action',
    meta: typeof meta === 'string' ? meta : JSON.stringify(meta),
    time: 'Just now'
  });
}

// ============================================================
// NOTIFICATIONS & TOASTS
// ============================================================

function toggleNotifDrawer(forceState) {
  const drawer = document.getElementById('notifDrawer');
  const isShown = forceState !== undefined ? forceState : drawer.style.display !== 'none';
  drawer.style.display = isShown ? 'none' : 'flex';
}

function renderNotifications() {
  const list = document.getElementById('notifList');
  list.innerHTML = '';

  state.notifications.forEach(nt => {
    const item = document.createElement('div');
    item.className = `notif-item ${nt.read ? '' : 'unread'}`;
    item.onclick = () => { nt.read = true; renderNotifications(); };

    item.innerHTML = `
      <div style="font-size: 18px;">🔔</div>
      <div style="flex: 1;">
        <div style="font-weight: 600; font-size: var(--text-xs);">${nt.title}</div>
        <div style="font-size: 11px; color: var(--text-color-secondary); margin: 2px 0;">${nt.desc}</div>
        <div style="font-size: 10px; color: var(--text-color-tertiary);">${nt.time}</div>
      </div>
    `;
    list.appendChild(item);
  });

  const hasUnread = state.notifications.some(n => !n.read);
  document.getElementById('notifBadge').style.display = hasUnread ? 'block' : 'none';
}

function markAllNotifsRead() {
  state.notifications.forEach(n => n.read = true);
  renderNotifications();
  showToast('All notifications marked read');
}

function showToast(message) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'glass-primary toast';
  toast.style.pointerEvents = 'auto';
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = 'var(--radius-pill)';
  toast.style.fontSize = 'var(--text-xs)';
  toast.style.fontWeight = 'var(--weight-semibold)';
  toast.style.boxShadow = 'var(--shadow-glass-floating)';
  toast.style.border = '1px solid var(--glass-border-light)';
  toast.style.animation = 'modal-slide-in 0.25s cubic-bezier(0.25, 1, 0.33, 1)';
  toast.innerHTML = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

function toggleAuthModal(shouldExit) {
  if (shouldExit) {
    showToast('Secure session logged out.');
    setTimeout(() => {
      window.location.href = 'design-system-preview.html';
    }, 800);
  }
}

// ============================================================
// CEO APPROVALS & EMPLOYEE ONBOARDING ENGINE
// ============================================================

function renderPendingApprovals() {
  const listEl = document.getElementById('pendingApprovalsList');
  const badgeEl = document.getElementById('pendingApprovalsBadge');
  if (!listEl) return;

  const pendingUsers = state.users.filter(u => u.status === 'pending_approval');
  if (badgeEl) badgeEl.textContent = `${pendingUsers.length} Pending`;

  listEl.innerHTML = '';
  if (pendingUsers.length === 0) {
    listEl.innerHTML = `
      <div style="padding: 16px; text-align: center; color: var(--text-color-secondary); font-size: 13px;">
        ✓ All staff registrations have been reviewed. No pending approvals.
      </div>
    `;
    return;
  }

  pendingUsers.forEach(u => {
    const card = document.createElement('div');
    card.className = 'approval-candidate-card';
    card.innerHTML = `
      <div class="row" style="gap: 12px;">
        <div class="avatar avatar-md" style="background: var(--color-brand-orange-soft); color: var(--color-brand-orange); font-weight: 700;">
          ${u.avatar}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong style="font-size: var(--text-sm);">${u.name}</strong>
            <span class="badge ${u.auth_provider === 'google' ? 'badge-primary' : 'badge-warning'}" style="font-size: 10px;">
              ${u.auth_provider === 'google' ? '🌐 Google Workspace' : '🔑 Email Reg'}
            </span>
          </div>
          <div style="font-size: var(--text-xs); color: var(--text-color-secondary); margin-top: 2px;">
            ${u.email} • <strong>${u.title}</strong> (${u.department})
          </div>
          <div style="font-size: 10px; color: var(--text-color-secondary); margin-top: 2px;">
            Registered: ${u.created_at || 'Recently'}
          </div>
        </div>
      </div>
      <div class="approval-actions">
        <button type="button" class="btn btn-reject" onclick="rejectCandidate('${u.id}')">✕ Reject</button>
        <button type="button" class="btn btn-approve" onclick="approveCandidate('${u.id}')">✓ Approve & Activate</button>
      </div>
    `;
    listEl.appendChild(card);
  });
}

async function loadBackendPendingApprovals() {
  try {
    const response = await window.StaffService.getPendingApprovals();
    if (!response?.success || !Array.isArray(response.profiles)) {
      throw new Error(response?.message || 'Unexpected pending profile response.');
    }

    const pendingProfiles = response.profiles.map(mapBackendProfileToPortalUser);
    state.users = state.users.filter(user => user.status !== 'pending_approval');
    state.users.push(...pendingProfiles);
    renderPendingApprovals();
    renderDashboard();
  } catch (error) {
    console.error('[STAFF] Failed to load pending profiles:', error);
    showToast(`Could not load pending staff requests. ${error.message || 'Please try again.'}`);
  }
}

async function approveCandidate(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id)) {
    showToast('This request has no valid profile UUID. Reload pending requests and try again.');
    return;
  }

  try {
    const response = await window.StaffService.approveStaff(user.id);
    const profile = response?.profile;
    if (!response?.success || !profile) {
      throw new Error(response?.message || 'The server did not confirm this approval.');
    }

    Object.assign(user, mapBackendProfileToPortalUser(profile));
    logAuditAction('user.approved', `Alhaji Mu'azu (CEO) approved ${user.name} (${user.title}) into ${user.department}`, { userId, role: user.role });
    showToast(`✓ Approved: ${user.name} is now authorized to access the portal.`);
    await loadBackendPendingApprovals();
    if (state.currentTab === 'projects') renderTeamDirectory();
  } catch (error) {
    console.error('[STAFF] Failed to approve profile:', error);
    showToast(`Could not approve ${user.name}. ${error.message || 'Please try again.'}`);
  }
}

async function rejectCandidate(userId) {
  const user = state.users.find(u => u.id === userId);
  if (!user) return;
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(user.id)) {
    showToast('This request has no valid profile UUID. Reload pending requests and try again.');
    return;
  }

  try {
    const response = await window.StaffService.rejectStaff(user.id);
    const profile = response?.profile;
    if (!response?.success || !profile) {
      throw new Error(response?.message || 'The server did not confirm this rejection.');
    }

    showToast(`✓ Rejected: ${user.name}'s request has been declined.`);
    await loadBackendPendingApprovals();
  } catch (error) {
    console.error('[STAFF] Failed to reject profile:', error);
    showToast(`Could not reject ${user.name}. ${error.message || 'Please try again.'}`);
  }
}

function openAddEmployeeModal() {
  const modal = document.getElementById('addEmployeeModal');
  if (modal) modal.style.display = 'flex';
}

function closeAddEmployeeModal() {
  const modal = document.getElementById('addEmployeeModal');
  if (modal) modal.style.display = 'none';
}

function handleCreateEmployee(e) {
  e.preventDefault();
  const name = document.getElementById('newEmpName').value.trim();
  const email = document.getElementById('newEmpEmail').value.trim();
  const dept = document.getElementById('newEmpDept').value;
  const role = document.getElementById('newEmpRole').value;
  const title = document.getElementById('newEmpTitle').value.trim();
  const salary = document.getElementById('newEmpSalary').value;
  const pass = document.getElementById('newEmpPassword').value.trim() || 'password123';

  if (state.users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    showToast('A user with this email already exists.');
    return;
  }

  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const newStaff = {
    id: 'usr-' + Date.now(),
    email: email,
    password: pass,
    name: name,
    role: role,
    department: dept,
    avatar: initials || 'EM',
    title: title,
    status: 'active', // Direct CEO addition is immediately active
    approved_by: "Alhaji Mu'azu",
    approved_at: 'Just now',
    auth_provider: 'email',
    date_of_joining: new Date().toISOString().split('T')[0],
    salary: salary ? parseInt(salary, 10) : 350000
  };

  state.users.push(newStaff);
  logAuditAction('employee.onboarded', `CEO Alhaji Mu'azu onboarded new staff member: ${name} (${title} - ${dept})`, { email, role });
  showToast(`✓ Successfully onboarded ${name} as ${title}.`);

  closeAddEmployeeModal();
  renderDashboard();
  if (state.currentTab === 'projects') renderTeamDirectory();
}

function renderTeamDirectory() {
  const rosterEl = document.getElementById('teamRosterContainer');
  if (!rosterEl) return;

  rosterEl.innerHTML = '';
  const isCeo = (state.currentRole === 'ceo');
  const visibleStaff = isCeo 
    ? state.users.filter(u => u.status !== 'rejected')
    : state.users.filter(u => u.status === 'active');
  
  visibleStaff.forEach(staff => {
    const card = document.createElement('div');
    card.className = 'glass-secondary';
    card.style.padding = 'var(--spacing-sm)';
    card.style.borderRadius = '18px';
    card.style.display = 'flex';
    card.style.alignItems = 'center';
    card.style.justifyContent = 'space-between';
    card.style.gap = '12px';
    card.style.flexWrap = 'wrap';
    
    const salaryFormatted = staff.salary ? '₦' + staff.salary.toLocaleString() + ' /mo' : '₦350,000 /mo';
    
    let statusBadge = '<span class="badge badge-success">✓ Active Staff</span>';
    if (staff.status === 'pending_approval') {
      statusBadge = '<span class="badge badge-warning">⏳ Pending CEO Review</span>';
    } else if (staff.status === 'on_leave') {
      statusBadge = '<span class="badge" style="background: rgba(148, 163, 184, 0.2); color: #64748b;">🏖️ On Leave</span>';
    } else if (staff.status === 'probation') {
      statusBadge = '<span class="badge" style="background: rgba(245, 158, 11, 0.15); color: #d97706;">⏱️ Probation</span>';
    } else if (staff.status === 'suspended') {
      statusBadge = '<span class="badge" style="background: rgba(239, 68, 68, 0.15); color: #ef4444;">🚫 Suspended</span>';
    }

    const editBtnHtml = isCeo ? `
      <button type="button" class="btn btn-secondary btn-sm btn-pill" onclick="openEditEmployeeModal('${staff.id}')" title="Edit Staff Profile & Salary" style="padding: 4px 12px; font-size: 11px;">
        ✏️ Edit Staff
      </button>
    ` : '';

    card.innerHTML = `
      <div class="row" style="gap: 12px; flex: 1; min-width: 240px;">
        <div class="avatar avatar-md" style="background: var(--color-brand-orange-soft); color: var(--color-brand-orange); font-weight: 700;">
          ${staff.avatar}
        </div>
        <div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <strong style="font-size: 14px;">${staff.name}</strong>
            <span class="badge badge-brand" style="font-size: 10px;">${formatRoleLabel(staff.role)}</span>
          </div>
          <div style="font-size: 12px; color: var(--text-color-secondary); margin-top: 2px;">
            ${staff.title} • <strong>${staff.department}</strong>
          </div>
          <div style="font-size: 11px; color: var(--text-color-secondary); margin-top: 2px;">
            ${staff.email}
          </div>
        </div>
      </div>
      <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 6px;">
        <div class="row" style="gap: 8px;">
          <span style="font-size: 12px; font-weight: 700; color: var(--color-brand-emerald); background: rgba(16, 185, 129, 0.1); padding: 3px 8px; border-radius: 8px;">
            ${salaryFormatted}
          </span>
          ${statusBadge}
        </div>
        ${editBtnHtml}
      </div>
    `;
    rosterEl.appendChild(card);
  });
}

function formatRoleLabel(role) {
  const map = {
    ceo: 'Executive Suite',
    department_head: 'Dept Head',
    employee: 'Employee',
    accountant: 'Accountant'
  };
  return map[role] || role;
}

function openEditEmployeeModal(staffId) {
  const staff = state.users.find(u => u.id === staffId);
  if (!staff) return;

  document.getElementById('editStaffId').value = staff.id;
  document.getElementById('editStaffName').value = staff.name;
  document.getElementById('editStaffEmail').value = staff.email;
  document.getElementById('editStaffDept').value = staff.department;
  document.getElementById('editStaffRole').value = staff.role;
  document.getElementById('editStaffTitle').value = staff.title;
  document.getElementById('editStaffSalary').value = staff.salary || 350000;
  document.getElementById('editStaffStatus').value = staff.status || 'active';

  const modal = document.getElementById('editEmployeeModal');
  if (modal) modal.style.display = 'flex';
}

function closeEditEmployeeModal() {
  const modal = document.getElementById('editEmployeeModal');
  if (modal) modal.style.display = 'none';
}

function handleSaveEmployeeEdit(e) {
  e.preventDefault();
  const staffId = document.getElementById('editStaffId').value;
  const name = document.getElementById('editStaffName').value.trim();
  const email = document.getElementById('editStaffEmail').value.trim();
  const dept = document.getElementById('editStaffDept').value;
  const role = document.getElementById('editStaffRole').value;
  const title = document.getElementById('editStaffTitle').value.trim();
  const salary = parseInt(document.getElementById('editStaffSalary').value, 10);
  const status = document.getElementById('editStaffStatus').value;

  const user = state.users.find(u => u.id === staffId);
  if (!user) {
    showToast('Employee profile not found.');
    return;
  }

  // Audit trail note detailing specific changes
  const changeNotes = [];
  if (user.department !== dept) changeNotes.push(`Dept: ${user.department} → ${dept}`);
  if (user.salary !== salary) changeNotes.push(`Salary: ₦${(user.salary || 0).toLocaleString()} → ₦${salary.toLocaleString()}`);
  if (user.role !== role) changeNotes.push(`Role: ${user.role} → ${role}`);
  if (user.title !== title) changeNotes.push(`Title: ${user.title} → ${title}`);
  if (user.status !== status) changeNotes.push(`Status: ${user.status} → ${status}`);

  // Apply updates
  user.name = name;
  user.email = email;
  user.department = dept;
  user.role = role;
  user.title = title;
  user.salary = salary;
  user.status = status;

  // Update avatar initials if name changed
  user.avatar = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  // If currently active user was edited, update session identity
  if (state.currentUser && state.currentUser.id === user.id) {
    state.currentUser = user;
    state.currentRole = user.role;
    applyRoleLayout(user);
    loadBackendTasks();
  }

  const changeSummary = changeNotes.length > 0 ? changeNotes.join(', ') : 'Profile details updated';
  logAuditAction('employee.profile_updated', `CEO Alhaji Mu'azu modified profile for ${name}: ${changeSummary}`, { staffId, salary, department: dept });
  showToast(`✓ Profile updated for ${name} (${dept} • ₦${salary.toLocaleString()})`);

  closeEditEmployeeModal();
  renderTeamDirectory();
  renderDashboard();
}


