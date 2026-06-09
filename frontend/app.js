const activities = [
  {
    name: 'Sean & Michelle Combs stock earnings',
    detail: 'Direct deposit',
    amount: '+$7,418.27',
    status: 'Posted',
  },
  {
    name: 'Sean & Michelle Combs card',
    detail: 'Home design studio',
    amount: '-$6,840.33',
    status: 'Pending',
  },
  {
    name: 'Home reserve transfer',
    detail: 'Automated allocation',
    amount: '-$78,800.00',
    status: 'Queued',
  },
  {
    name: 'Shared brokerage sweep',
    detail: 'Monthly transfer in',
    amount: '+$4,500.00',
    status: 'Posted',
  },
];

const goals = [
  { label: 'Home reserve', value: 72, balance: '$78,800' },
  { label: 'Education fund', value: 64, balance: '$38,800' },
  { label: 'Travel fund', value: 41, balance: '$21,600' },
  { label: 'Emergency fund', value: 88, balance: '$26,000' },
];

const transferHistory = [
  {
    date: 'Jan 2026',
    asset: 'Joint checking',
    transaction: 'Opening balance',
    amount: '+$118,500.00',
    newValue: '$118,500.00',
    notes: 'Sean & Michelle Combs added as equal account owners.',
  },
  {
    date: 'Jan 2026',
    asset: 'Emergency fund',
    transaction: 'Vault allocation',
    amount: '-$24,000.00',
    newValue: '$24,000.00',
    notes: 'Both owners confirmed standing savings rule.',
  },
  {
    date: 'Feb 2026',
    asset: 'Home reserve',
    transaction: 'Incoming wire',
    amount: '+$42,000.00',
    newValue: '$62,400.00',
    notes: 'Escrow reserve established with dual approval threshold.',
  },
  {
    date: 'Mar 2026',
    asset: 'Joint checking',
    transaction: 'Mortgage payment',
    amount: '-$6,850.00',
    newValue: '$97,918.44',
    notes: 'Recurring household bill paid from shared checking.',
  },
  {
    date: 'Apr 2026',
    asset: 'Education fund',
    transaction: 'Scheduled deposit',
    amount: '+$8,800.00',
    newValue: '$38,800.00',
    notes: 'Monthly contribution completed from both direct deposits.',
  },
  {
    date: 'May 2026',
    asset: 'Joint checking',
    transaction: 'Card settlement',
    amount: '-$3,518.18',
    newValue: '$642,450.00',
    notes: 'Combined household card activity settled overnight.',
  },
  {
    date: 'May 2026',
    asset: 'Home reserve',
    transaction: 'Pending transfer',
    amount: '+$78,800.00',
    newValue: '$78,800.00',
    notes: 'Queued for Sean & Michelle Combs approval under shared controls.',
  },
];

const validCredentials = {
  userId: 'smcombs.vault',
  password: 'fh8c@Pfv0gB2',
};

const loginScreen = document.querySelector('#loginScreen');
const appShell = document.querySelector('#appShell');
const heroPanel = document.querySelector('#overview');
const relationshipManagerSpot = document.querySelector('#relationship-manager');
const loginForm = document.querySelector('#loginForm');
const vaultUnlock = document.querySelector('#vaultUnlock');
const activityList = document.querySelector('#activityList');
const goalList = document.querySelector('#goalList');
const recentTransactionList = document.querySelector('#recentTransactionList');
const modalBackdrop = document.querySelector('#modalBackdrop');
const modalEyebrow = document.querySelector('#modalEyebrow');
const modalTitle = document.querySelector('#modalTitle');
const modalBody = document.querySelector('#modalBody');
const toast = document.querySelector('#toast');
const connectionBanner = document.querySelector('#connectionBanner');
const installBanner = document.querySelector('#installBanner');
const installBannerDescription = document.querySelector('#installBannerDescription');
const installBannerHint = document.querySelector('#installBannerHint');
const installButton = document.querySelector('#installButton');
const supportBadgeStorageKey = 'aurelia-support-unread-count';
const supportUnreadDefault = 3;
const supportBadgeElements = document.querySelectorAll('.nav-badge');
const installDismissStorageKey = 'aurelia-install-banner-dismissed-at';
const installDismissDurationMs = 7 * 24 * 60 * 60 * 1000;
const displayModeQuery = window.matchMedia('(display-mode: standalone)');
const isIosDevice = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
let lastActionTrigger = null;
let deferredInstallPrompt = null;
let unlockTimer = null;
let relationshipManagerObserver = null;
let relationshipManagerScrollHandler = null;
const unlockDurationMs = 820;

activityList.innerHTML = activities
  .map(
    (item) => `
      <article class="activity-item">
        <div>
          <strong>${item.name}</strong>
          <span>${item.detail}</span>
        </div>
        <div>
          <strong>${item.amount}</strong>
          <span>${item.status}</span>
        </div>
      </article>
    `,
  )
  .join('');

goalList.innerHTML = goals
  .map(
    (goal) => `
      <article class="goal-item">
        <div>
          <strong>${goal.label}</strong>
          <span>${goal.balance}</span>
        </div>
        <div class="progress-track" aria-label="${goal.label} progress">
          <span style="width: ${goal.value}%"></span>
        </div>
      </article>
    `,
  )
  .join('');

renderRecentTransactions();

function buildHistoryTable(history) {
  return `
    <div class="history-table-wrap">
      <table class="history-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Asset</th>
            <th>Transaction</th>
            <th>Amount</th>
            <th>Value</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          ${history
            .map(
              (entry) => `
                <tr>
                  <td data-label="Date">${entry.date}</td>
                  <td data-label="Asset">${entry.asset}</td>
                  <td data-label="Transaction">${entry.transaction}</td>
                  <td data-label="Amount">${entry.amount}</td>
                  <td data-label="New Value">${entry.newValue}</td>
                  <td data-label="Notes">${entry.notes}</td>
                </tr>
              `,
            )
            .join('')}
        </tbody>
      </table>
    </div>
  `;
}

function renderRecentTransactions() {
  if (!recentTransactionList) {
    return;
  }

  const recentHistory = transferHistory.slice(-3).reverse();

  recentTransactionList.innerHTML = recentHistory
    .map(
      (entry) => `
        <article class="transaction-card">
          <div class="transaction-card-top">
            <div>
              <strong>${entry.transaction}</strong>
              <span>${entry.asset}</span>
            </div>
            <strong class="${entry.amount.startsWith('-') ? 'amount-negative' : 'amount-positive'}">${entry.amount}</strong>
          </div>
          <div class="transaction-card-meta">
            <span>${entry.date}</span>
            <span>${entry.newValue}</span>
          </div>
          <p>${entry.notes}</p>
        </article>
      `,
    )
    .join('');
}

const modalContent = {
  'message-advisor': {
    eyebrow: 'Relationship Manager',
    title: 'Message Marin Hale',
    body: `
      <div class="contact-card">
        <strong>Marin Hale</strong>
        <span>Relationship Manager</span>
      </div>
      <label>
        Subject
        <input type="text" value="Joint account review" />
      </label>
      <label>
        Message
        <textarea rows="5">Please prepare an updated note on the Sean & Michelle Combs joint account, approval settings, and near-term household cash flow.</textarea>
      </label>
      <div class="modal-actions">
        <button type="button" data-action="send-message">Send message</button>
        <button type="button" data-action="schedule-advisor-call">Schedule call</button>
      </div>
    `,
  },
  search: {
    eyebrow: 'Search',
    title: 'Find records',
    body: `
      <label>
        Search dashboard
        <input type="search" id="dashboardSearch" placeholder="Try mortgage, checking, education, home" />
      </label>
      <div class="search-results" id="searchResults"></div>
    `,
  },
  'move-money': {
    eyebrow: 'Transfers',
    title: 'Transfer money',
    body: `
      <label>
        From
        <select>
          <option>Joint checking - $642,450.00</option>
          <option>Home reserve - $78,800.00</option>
          <option>Emergency fund - $26,000.00</option>
        </select>
      </label>
      <label>
        Amount
        <input type="text" value="$78,800" />
      </label>
      <label>
        Destination
        <select>
          <option>Home reserve</option>
          <option>Education fund</option>
          <option>External savings</option>
        </select>
      </label>
      <button type="button" data-action="submit-transfer">Schedule transfer</button>
    `,
  },
  'new-vault': {
    eyebrow: 'Vault',
    title: 'Create vault',
    body: `
      <label>
        Vault name
        <input type="text" value="Renovation fund" />
      </label>
      <label>
        Target
        <input type="text" value="$35,000" />
      </label>
      <button type="button" data-action="create-vault">Create vault</button>
    `,
  },
  'review-queue': {
    eyebrow: 'Transfers',
    title: 'Scheduled movement',
    body: `
      <div class="queue-item">
        <strong>$78,800 to Home reserve</strong>
        <span>Scheduled for July 19. Status: awaiting Sean & Michelle Combs approval.</span>
      </div>
      <div class="modal-actions">
        <button type="button" data-action="approve-queue">Approve</button>
        <button type="button" data-action="hold-queue">Place hold</button>
      </div>
    `,
  },
  'open-brief': {
    eyebrow: 'Concierge',
    title: 'Monthly account brief',
    body: `
      <p>Advisor note prepared for Sean & Michelle Combs: household liquidity is stable, with the next large movement awaiting dual approval.</p>
      <p>Recommended next step: review May 2026 savings goals and confirm card limits for both account owners.</p>
      <button type="button" data-action="mark-brief-read">Mark reviewed</button>
    `,
  },
  'aurelia-services': {
    eyebrow: 'Home',
    title: 'Do more with Aurelia',
    body: `
      <div class="feature-grid modal-feature-grid">
        <article class="launchpad-card">
          <p class="eyebrow">Aurelia services</p>
          <h3>All your banking tools in one premium app</h3>
          <p>Send money, manage approvals, message your advisor, and keep your household finances organized from a single mobile home screen.</p>
        </article>
        <article class="launchpad-card">
          <p class="eyebrow">Fast actions</p>
          <ul class="launchpad-list">
            <li>Tap into vaults and savings</li>
            <li>Review recent activity at a glance</li>
            <li>Install once, use instantly offline</li>
          </ul>
        </article>
      </div>
    `,
  },
  'view-all-history': {
    eyebrow: 'Transaction history',
    title: 'All ledger entries',
    body: `
      <p class="panel-note">Full account history for the Sean &amp; Michelle Combs joint account.</p>
      ${buildHistoryTable(transferHistory)}
    `,
  },
  'marketing-toolkit': {
    eyebrow: 'Marketers toolkit',
    title: 'Premium campaign tools',
    body: `
      <div class="feature-grid modal-feature-grid">
        <article class="launchpad-card">
          <p class="eyebrow">Toolkit features</p>
          <h3>Build polished offers and track engagement</h3>
          <ul class="launchpad-list">
            <li>Branded payment links for fast sharing</li>
            <li>Lead capture forms with a premium look</li>
            <li>Campaign-ready messaging and follow-up workflows</li>
          </ul>
        </article>
        <article class="launchpad-card">
          <p class="eyebrow">Campaign workflow</p>
          <p>Create one-off promotions, save reusable templates, and keep client-facing materials aligned to the Aurelia brand.</p>
        </article>
      </div>
    `,
  },
};

const sessionActive = window.localStorage.getItem('aureliaJointSession') === 'active';

if (sessionActive) {
  showApp();
}

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (unlockTimer !== null) {
    return;
  }

  const formData = new FormData(loginForm);
  const userId = String(formData.get('userId') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (userId !== validCredentials.userId || password !== validCredentials.password) {
    showToast('User ID or password is incorrect.');
    return;
  }

  if (document.querySelector('#rememberDevice').checked) {
    window.localStorage.setItem('aureliaJointSession', 'active');
  }

  beginUnlockSequence();
});

document.querySelectorAll('.nav-list a, .mobile-nav a, .brand').forEach((link) => {
  link.addEventListener('click', () => {
    const href = link.getAttribute('href');
    document.querySelectorAll('.nav-list a, .mobile-nav a').forEach((item) => item.classList.remove('active'));
    const matchingNav = document.querySelector(`.nav-list a[href="${href}"], .mobile-nav a[href="${href}"]`);
    matchingNav?.classList.add('active');

    if (href === '#support') {
      markSupportReviewed();
    }
  });
});

document.addEventListener('click', (event) => {
  const actionElement = event.target.closest('[data-action]');
  const buttonElement = event.target.closest('button');

  if (!actionElement) {
    if (buttonElement) {
      if (buttonElement.type === 'submit') {
        return;
      }
      event.preventDefault();
      const label = buttonElement.textContent.trim() || buttonElement.getAttribute('aria-label') || 'Button';
      showToast(`${label} clicked.`);
    }
    return;
  }

  event.preventDefault();
  const action = actionElement.dataset.action;

  if (action === 'install-app') {
    promptInstall();
    return;
  }

  if (action === 'dismiss-install') {
    dismissInstallBanner();
    return;
  }

  if (modalContent[action]) {
    if (action === 'message-advisor' || action === 'open-brief') {
      markSupportReviewed();
    }
    lastActionTrigger = actionElement;
    openModal(modalContent[action]);
    if (action === 'search') {
      setupSearch();
    }
    return;
  }

  if (action === 'close-modal') {
    closeModal();
    return;
  }

  if (action === 'logout') {
    window.localStorage.removeItem('aureliaJointSession');
    resetUnlockState();
    appShell.hidden = true;
    loginScreen.hidden = false;
    closeModal();
    showToast('Signed out.');
    return;
  }

  if (action === 'forgot-password') {
    showToast('Password reset is available.');
    return;
  }

  if (action === 'export-activity') {
    downloadCsv('recent-activity.csv', activities);
    showToast('Recent activity exported.');
    return;
  }

  if (action === 'download-history') {
    downloadCsv('sean-michelle-combs-joint-account-ledger.csv', transferHistory);
    showToast('Joint account ledger CSV downloaded.');
    return;
  }

  const completionMessages = {
    'send-message': 'Message sent to Marin Hale.',
    'schedule-advisor-call': 'Call request sent to Marin Hale.',
    'submit-transfer': 'Transfer sent for joint approval.',
    'create-vault': 'New vault created.',
    'approve-queue': 'Queued transfer approved by this owner.',
    'hold-queue': 'Queued transfer placed on hold.',
    'mark-brief-read': 'Brief marked reviewed.',
  };

  if (completionMessages[action]) {
    if (action === 'mark-brief-read') {
      markSupportReviewed();
    }
    closeModal();
    showToast(completionMessages[action]);
    return;
  }

  showToast('Action ready.');
});

document.querySelectorAll('[data-control]').forEach((control) => {
  control.addEventListener('change', () => {
    const state = control.checked ? 'enabled' : 'disabled';
    showToast(`${control.dataset.control} ${state}.`);
  });
});

modalBackdrop.addEventListener('click', (event) => {
  if (event.target === modalBackdrop) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modalBackdrop.hidden) {
    closeModal();
  }
});

function openModal(content) {
  modalEyebrow.textContent = content.eyebrow;
  modalTitle.textContent = content.title;
  modalBody.innerHTML = content.body;
  makeButtonsClickable(modalBody);
  modalBackdrop.hidden = false;
  document.body.classList.add('modal-open');
  modalBackdrop.querySelector('input, select, textarea, button')?.focus();
}

function closeModal() {
  modalBackdrop.hidden = true;
  document.body.classList.remove('modal-open');
  lastActionTrigger?.focus();
  lastActionTrigger = null;
}

function showApp() {
  resetUnlockState();
  loginScreen.hidden = true;
  appShell.hidden = false;
  setupRelationshipManagerCollapse();
}

function beginUnlockSequence() {
  const submitButton = loginForm.querySelector('.login-submit');
  const inputs = loginForm.querySelectorAll('input, button');

  loginScreen.classList.add('unlocking');
  vaultUnlock.hidden = false;
  submitButton.textContent = 'Unlocking...';
  inputs.forEach((element) => {
    element.disabled = true;
  });

  window.clearTimeout(unlockTimer);
  unlockTimer = window.setTimeout(() => {
    showApp();
    showToast('Vault unlocked. Signed in to Sean & Michelle Combs joint account.');
    unlockTimer = null;
  }, unlockDurationMs);
}

function resetUnlockState() {
  window.clearTimeout(unlockTimer);
  unlockTimer = null;
  loginScreen.classList.remove('unlocking');
  vaultUnlock.hidden = true;

  const submitButton = loginForm.querySelector('.login-submit');
  const inputs = loginForm.querySelectorAll('input, button');
  submitButton.textContent = 'Unlock Vault';
  inputs.forEach((element) => {
    element.disabled = false;
  });
}

function setupSearch() {
  const searchInput = document.querySelector('#dashboardSearch');
  const results = document.querySelector('#searchResults');

  function renderResults() {
    const query = searchInput.value.trim().toLowerCase();
    const matches = transferHistory.filter((entry) =>
      Object.values(entry).some((value) => value.toLowerCase().includes(query)),
    );

    if (!query) {
      results.innerHTML = '<span>Search the ledger by asset, transaction, amount, or note.</span>';
      return;
    }

    results.innerHTML = matches.length
      ? matches
          .slice(0, 5)
          .map(
            (entry) => `
              <article>
                <strong>${entry.date} - ${entry.asset}</strong>
                <span>${entry.transaction}: ${entry.amount}</span>
              </article>
            `,
          )
          .join('')
      : '<span>No matching records found.</span>';
  }

  searchInput.addEventListener('input', renderResults);
  renderResults();
}

function downloadCsv(filename, rows) {
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(','),
    ...rows.map((row) => headers.map((header) => csvCell(row[header])).join(',')),
  ].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');

  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function csvCell(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.hidden = true;
  }, 2600);
}

function getSupportUnreadCount() {
  const storedValue = window.localStorage.getItem(supportBadgeStorageKey);
  if (storedValue === null) {
    return supportUnreadDefault;
  }

  const parsedValue = Number(storedValue);
  if (!Number.isFinite(parsedValue)) {
    return supportUnreadDefault;
  }

  return Math.max(0, Math.min(parsedValue, 99));
}

function setSupportUnreadCount(count) {
  const nextCount = Math.max(0, Math.min(count, 99));
  window.localStorage.setItem(supportBadgeStorageKey, String(nextCount));
  renderSupportBadge();
}

function markSupportReviewed() {
  setSupportUnreadCount(0);
}

function renderSupportBadge() {
  const unreadCount = getSupportUnreadCount();

  supportBadgeElements.forEach((badge) => {
    if (unreadCount <= 0) {
      badge.hidden = true;
      return;
    }

    badge.hidden = false;
    badge.textContent = unreadCount > 9 ? '9+' : String(unreadCount);
  });
}

function renderConnectionBanner() {
  if (!connectionBanner) {
    return;
  }

  const isOffline = window.navigator.onLine === false;
  connectionBanner.hidden = !isOffline;
}

function setupRelationshipManagerCollapse() {
  if (!heroPanel || !relationshipManagerSpot) {
    return;
  }

  if (relationshipManagerObserver || relationshipManagerScrollHandler) {
    updateRelationshipManagerCompaction();
    return;
  }

  if ('IntersectionObserver' in window) {
    relationshipManagerObserver = new IntersectionObserver(
      ([entry]) => {
        relationshipManagerSpot.classList.toggle('is-compact', !entry.isIntersecting);
      },
      { threshold: 0 },
    );
    relationshipManagerObserver.observe(heroPanel);
    updateRelationshipManagerCompaction();
    return;
  }

  relationshipManagerScrollHandler = () => updateRelationshipManagerCompaction();
  window.addEventListener('scroll', relationshipManagerScrollHandler, { passive: true });
  window.addEventListener('resize', relationshipManagerScrollHandler);
  updateRelationshipManagerCompaction();
}

function updateRelationshipManagerCompaction() {
  if (!heroPanel || !relationshipManagerSpot) {
    return;
  }

  const heroRect = heroPanel.getBoundingClientRect();
  relationshipManagerSpot.classList.toggle('is-compact', heroRect.bottom <= 0);
}

function makeButtonsClickable(scope = document) {
  scope.querySelectorAll('button:not([data-action])').forEach((button) => {
    if (button.type === 'submit') {
      return;
    }
    button.dataset.action = 'button-action';
    if (!button.type) {
      button.type = 'button';
    }
  });
}

makeButtonsClickable();
renderSupportBadge();
renderConnectionBanner();
setupInstallExperience();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('./sw.js', { scope: './' })
      .then((registration) => {
        if (registration.waiting) {
          activateWaitingWorker(registration);
        }

        registration.addEventListener('updatefound', () => {
          registration.installing?.addEventListener('statechange', () => {
            if (registration.waiting && navigator.serviceWorker.controller) {
              activateWaitingWorker(registration);
            }
          });
        });

        navigator.serviceWorker.addEventListener(
          'controllerchange',
          () => {
            if (!window.__aureliaReloading) {
              window.__aureliaReloading = true;
              window.location.reload();
            }
          },
          { once: true },
        );
      })
      .catch(() => {
        showToast('Offline mode could not start.');
      });
  });
}

window.addEventListener('online', () => {
  renderConnectionBanner();
  showToast('Connection restored.');
});

window.addEventListener('offline', () => {
  renderConnectionBanner();
  showToast('You are offline. Cached banking tools remain available.');
});

function activateWaitingWorker(registration) {
  registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
  showToast('A fresh banking shell is ready.');
}

function setupInstallExperience() {
  if (!installBanner) {
    return;
  }

  displayModeQuery.addEventListener?.('change', renderInstallBanner);

  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    renderInstallBanner();
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    dismissInstallBanner({ persist: true, silent: true });
    showToast('Aurelia is installed and ready from your home screen.');
  });

  renderInstallBanner();
}

async function promptInstall() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();

    try {
      const choice = await deferredInstallPrompt.userChoice;
      if (choice?.outcome === 'accepted') {
        dismissInstallBanner({ persist: true, silent: true });
      } else {
        showToast('Install dismissed. You can reopen it whenever you are ready.');
      }
    } catch {
      showToast('Install prompt could not be completed.');
    } finally {
      deferredInstallPrompt = null;
      renderInstallBanner();
    }

    return;
  }

  if (isIosDevice) {
    showToast('On iPhone or iPad, tap Share and choose Add to Home Screen.');
    return;
  }

  showToast('Use your browser menu and choose Install app.');
}

function renderInstallBanner() {
  if (!installBanner) {
    return;
  }

  if (isStandaloneMode() || isInstallBannerDismissed()) {
    installBanner.hidden = true;
    return;
  }

  installBanner.hidden = false;

  if (deferredInstallPrompt) {
    installBannerDescription.textContent =
      'Install the dashboard for faster launch, a cleaner full-screen layout, and offline access to the shared banking shell.';
    installBannerHint.textContent = 'Android and desktop browsers can install directly from this banner.';
    installButton.textContent = 'Install app';
    installButton.disabled = false;
    return;
  }

  if (isIosDevice) {
    installBannerDescription.textContent =
      'Aurelia works well on iPhone and iPad as a home-screen app with a full-screen launch experience.';
    installBannerHint.textContent = 'On iPhone or iPad, tap Share, then choose Add to Home Screen.';
    installButton.textContent = 'Show iPhone steps';
    installButton.disabled = false;
    return;
  }

  installBannerDescription.textContent =
    'This dashboard is installable as a Progressive Web App for smoother repeat visits and offline-ready navigation.';
  installBannerHint.textContent = 'If your browser does not show a prompt, use the browser menu and choose Install app.';
  installButton.textContent = 'How to install';
  installButton.disabled = false;
}

function dismissInstallBanner({ persist = true, silent = false } = {}) {
  if (persist) {
    window.localStorage.setItem(installDismissStorageKey, String(Date.now()));
  }

  installBanner.hidden = true;

  if (!silent) {
    showToast('Install banner hidden.');
  }
}

function isInstallBannerDismissed() {
  const dismissedAt = Number(window.localStorage.getItem(installDismissStorageKey) || 0);
  if (!dismissedAt) {
    return false;
  }

  if (Date.now() - dismissedAt > installDismissDurationMs) {
    window.localStorage.removeItem(installDismissStorageKey);
    return false;
  }

  return true;
}

function isStandaloneMode() {
  return displayModeQuery.matches || window.navigator.standalone === true;
}
