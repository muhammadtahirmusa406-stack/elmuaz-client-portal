/**
 * ============================================================
 * ELMUAZ TECHNOLOGIES LTD
 * Internal Company Management System (EIMS)
 * Centralized UI Feedback — Loading & Error States
 * ============================================================
 * 
 * Complies 100% with Liquid Glass design system.
 * Provides non-destructive floating loaders, button states,
 * and normalized error displays for backend API integration.
 * ============================================================
 */

class UiFeedbackManager {
  constructor() {
    this.activeLoaderCount = 0;
    this.loaderEl = null;
    this.toastContainer = null;
  }

  /**
   * Initialize DOM hooks for loaders and toasts
   */
  init() {
    if (typeof document === 'undefined') return;

    // Toast Container
    this.toastContainer = document.getElementById('toastContainer');
    if (!this.toastContainer) {
      this.toastContainer = document.createElement('div');
      this.toastContainer.id = 'toastContainer';
      this.toastContainer.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 8px;
        pointer-events: none;
      `;
      document.body.appendChild(this.toastContainer);
    }
  }

  /**
   * Display floating Liquid Glass global loader pill
   */
  showLoader(message = 'Processing request...') {
    this.init();
    this.activeLoaderCount++;

    if (!this.loaderEl) {
      this.loaderEl = document.createElement('div');
      this.loaderEl.id = 'globalGlassLoader';
      this.loaderEl.className = 'glass-loader-overlay';
      this.loaderEl.innerHTML = `
        <div class="glass-spinner"></div>
        <span id="globalGlassLoaderText">${message}</span>
      `;
      document.body.appendChild(this.loaderEl);
    } else {
      const textEl = document.getElementById('globalGlassLoaderText');
      if (textEl) textEl.textContent = message;
      this.loaderEl.style.display = 'flex';
      this.loaderEl.style.opacity = '1';
    }
  }

  /**
   * Hide floating global loader pill
   */
  hideLoader() {
    this.activeLoaderCount = Math.max(0, this.activeLoaderCount - 1);
    if (this.activeLoaderCount === 0 && this.loaderEl) {
      this.loaderEl.style.opacity = '0';
      setTimeout(() => {
        if (this.activeLoaderCount === 0 && this.loaderEl) {
          this.loaderEl.style.display = 'none';
        }
      }, 250);
    }
  }

  /**
   * Manage busy/loading state of any submit or action button
   * 
   * @param {HTMLElement|string} btn - Button element or selector
   * @param {boolean} isBusy - Toggle state
   * @param {string} [busyText='Please wait...'] - Display text while busy
   */
  setButtonBusy(btn, isBusy, busyText = 'Please wait...') {
    const el = typeof btn === 'string' ? document.querySelector(btn) : btn;
    if (!el) return;

    if (isBusy) {
      if (!el.dataset.origHtml) {
        el.dataset.origHtml = el.innerHTML;
      }
      el.disabled = true;
      el.innerHTML = `
        <span class="glass-spinner" style="width: 14px; height: 14px; border-width: 2px; margin-right: 6px;"></span>
        <span>${busyText}</span>
      `;
      el.style.opacity = '0.75';
      el.style.cursor = 'not-allowed';
    } else {
      if (el.dataset.origHtml) {
        el.innerHTML = el.dataset.origHtml;
        delete el.dataset.origHtml;
      }
      el.disabled = false;
      el.style.opacity = '1';
      el.style.cursor = 'pointer';
    }
  }

  /**
   * Extract user-friendly error string from any error object
   */
  formatErrorMessage(error) {
    if (!error) return 'An unexpected error occurred.';
    if (typeof error === 'string') return error;

    // ApiError with validation details
    if (error.details && typeof error.details === 'object') {
      const details = error.details;
      if (Array.isArray(details)) {
        return details.map(d => d.message || d).join(', ');
      }
      if (typeof details === 'object') {
        const messages = Object.values(details);
        if (messages.length > 0) return messages.flat().join('. ');
      }
    }

    return error.message || 'Server request failed. Please check network connectivity.';
  }

  /**
   * Display error notification (either into an inline banner or toast)
   */
  showError(error, targetBanner = null) {
    const message = this.formatErrorMessage(error);

    if (targetBanner) {
      const bannerEl = typeof targetBanner === 'string' ? document.querySelector(targetBanner) : targetBanner;
      if (bannerEl) {
        bannerEl.textContent = message;
        bannerEl.style.display = 'block';
        return;
      }
    }

    this.showToast(`✕ ${message}`, 'error');
  }

  /**
   * Display success toast
   */
  showSuccess(message) {
    this.showToast(`✓ ${message}`, 'success');
  }

  /**
   * Dispatch Liquid Glass floating toast message
   */
  showToast(message, type = 'info') {
    this.init();
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = 'glass-primary toast';
    toast.style.cssText = `
      pointer-events: auto;
      padding: 12px 18px;
      border-radius: var(--radius-pill, 50px);
      font-size: var(--text-xs, 12px);
      font-weight: var(--weight-semibold, 600);
      box-shadow: var(--shadow-glass-floating, 0 16px 40px rgba(0,0,0,0.12));
      border: 1px solid var(--glass-border-light, rgba(255,255,255,0.3));
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s cubic-bezier(0.25, 1, 0.33, 1);
    `;

    if (type === 'error') {
      toast.style.borderLeft = '4px solid #ef4444';
      toast.style.color = '#ef4444';
    } else if (type === 'success') {
      toast.style.borderLeft = '4px solid var(--color-brand-emerald, #10b981)';
      toast.style.color = '#047857';
    } else if (type === 'warning') {
      toast.style.borderLeft = '4px solid #f59e0b';
      toast.style.color = '#d97706';
    }

    toast.innerHTML = message;
    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Global Singleton Instance
const UiFeedback = new UiFeedbackManager();

if (typeof window !== 'undefined') {
  window.UiFeedback = UiFeedback;
  // Initialize hooks on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => UiFeedback.init());
  } else {
    UiFeedback.init();
  }
}
