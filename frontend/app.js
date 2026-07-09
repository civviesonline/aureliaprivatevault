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
    newValue: '$721,380.000',
    notes: 'Combined household card activity settled overnight.',
  },
  {
    date: 'August 2026',
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

const authSessionEndpoint = window.AURELIA_AUTH_SESSION_ENDPOINT || 'http://localhost:8080/api/v1/auth/session';
const loginScreen = document.querySelector('#loginScreen');
const appShell = document.querySelector('#appShell');
const heroPanel = document.querySelector('#overview');
const relationshipManagerSpot = document.querySelector('#relationship-manager');
const loginForm = document.querySelector('#loginForm');
const vaultUnlock = document.querySelector('#vaultUnlock');
const activityList = document.querySelector('#activityList');
const goalList = document.querySelector('#goalList');
const recentTransactionList = document.querySelector('#recentTransactionList');
const balanceVisibilityToggle = document.querySelector('#balanceVisibilityToggle');
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
const connectionPill = document.querySelector('#connectionPill');
const screenEyebrow = document.querySelector('#screenEyebrow');
const screenTitle = document.querySelector('#screenTitle');
const appViews = document.querySelectorAll('[data-view]');
const transferHistoryTable = document.querySelector('#transferHistory');
const supportBadgeStorageKey = 'aurelia-support-unread-count';
const supportUnreadDefault = 3;
const supportBadgeElements = document.querySelectorAll('.nav-badge');
const balanceVisibilityStorageKey = 'aurelia-balance-hidden';
const balanceMaskText = '••••••';
const balanceTransitionMs = 260;
const advisorTypingDelayMs = 680;
const advisorFollowUpDelayMs = 1500;
const installDismissStorageKey = 'aurelia-install-banner-dismissed-at';
const installDismissDurationMs = 7 * 24 * 60 * 60 * 1000;
const displayModeQuery = window.matchMedia('(display-mode: standalone)');
const isIosDevice = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
let lastActionTrigger = null;
let deferredInstallPrompt = null;
let unlockTimer = null;
let relationshipManagerObserver = null;
let relationshipManagerScrollHandler = null;
let balanceHidden = window.localStorage.getItem(balanceVisibilityStorageKey) === 'true';
let balanceTransitionTimer = null;
let advisorAutoResponseTimer = null;
let advisorFollowUpTimer = null;
const unlockDurationMs = 820;
const greetingText = 'Welcome Back, Sean & Michelle.';

const screenCopy = {
  overview: {
    eyebrow: greetingText,
    title: 'Joint account',
  },
  vault: {
    eyebrow: greetingText,
    title: 'Vault',
  },
  cards: {
    eyebrow: greetingText,
    title: 'Cards',
  },
  transfers: {
    eyebrow: greetingText,
    title: 'Move money',
  },
  support: {
    eyebrow: greetingText,
    title: 'Concierge',
  },
};

activityList.innerHTML = activities
  .map(
    (item) => {
      const amountTone = item.amount.startsWith('+') ? 'positive' : 'negative';
      const statusName = item.status.toLowerCase();

      return `
      <article class="activity-item">
        <div class="activity-copy">
          <strong>${item.name}</strong>
          <span>${item.detail}</span>
        </div>
        <div class="activity-meta">
          <strong class="activity-amount ${amountTone}" data-balance-value>${item.amount}</strong>
          <span class="status-pill status-${statusName}">${item.status}</span>
        </div>
      </article>
    `;
    },
  )
  .join('');
renderBalanceVisibility(activityList);

goalList.innerHTML = goals
  .map(
    (goal) => `
      <article class="goal-item">
        <div>
          <strong>${goal.label}</strong>
          <span data-balance-value>${goal.balance}</span>
        </div>
        <div class="progress-track" aria-label="${goal.label} progress">
          <span style="width: ${goal.value}%"></span>
        </div>
      </article>
    `,
  )
  .join('');
renderBalanceVisibility(goalList);

renderTransactionHistory();
renderRecentTransactions();

function renderTransactionHistory() {
  if (!transferHistoryTable) {
    return;
  }

  transferHistoryTable.innerHTML = transferHistory
    .map((entry) => historyTableRow(entry))
    .join('');
  renderBalanceVisibility(transferHistoryTable);
}

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
          ${history.map((entry) => historyTableRow(entry)).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function historyTableRow(entry) {
  const amountTone = entry.amount.startsWith('+') ? 'positive' : 'negative';

  return `
    <tr>
      <td data-label="Date">${entry.date}</td>
      <td data-label="Asset">${entry.asset}</td>
      <td data-label="Transaction">${entry.transaction}</td>
      <td data-label="Amount"><span class="history-money ${amountTone}" data-balance-value>${entry.amount}</span></td>
      <td data-label="New Value"><span class="history-money" data-balance-value>${entry.newValue}</span></td>
      <td data-label="Notes">${entry.notes}</td>
    </tr>
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
            <strong class="${entry.amount.startsWith('-') ? 'amount-negative' : 'amount-positive'}" data-balance-value>${entry.amount}</strong>
          </div>
          <div class="transaction-card-meta">
            <span>${entry.date}</span>
            <span data-balance-value>${entry.newValue}</span>
          </div>
          <p>${entry.notes}</p>
        </article>
      `,
    )
    .join('');
  renderBalanceVisibility(recentTransactionList);
}

const modalContent = {
  'message-advisor': {
    eyebrow: 'Relationship Manager',
    title: 'Message Marin Hale',
    body: buildAdvisorConversationBody(),
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
          <option>Joint checking - $721,380.000</option>
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
        <strong data-balance-value>$78,800 to Home reserve</strong>
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
  'manage-security': {
    eyebrow: 'Security',
    title: 'Account protection',
    body: `
      <div class="queue-item">
        <strong>Dual approval is active</strong>
        <span>Transfers above $10,000 require confirmation from both owners.</span>
      </div>
      <div class="control-row">
        <span>Trusted device session</span>
        <label class="switch">
          <input type="checkbox" checked data-control="Trusted device session" />
          <span></span>
        </label>
      </div>
      <div class="control-row">
        <span>Large transfer alerts</span>
        <label class="switch">
          <input type="checkbox" checked data-control="Large transfer alerts" />
          <span></span>
        </label>
      </div>
      <button type="button" data-action="confirm-security">Save settings</button>
    `,
  },
};

const sessionActive = window.localStorage.getItem('aureliaJointSession') === 'active';

if (sessionActive) {
  showApp();
} else {
  restoreAuthSession();
}

updateConnectionState();

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

document.querySelectorAll('[data-nav-link], .brand').forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    const view = getViewFromHref(link.getAttribute('href'));
    showView(view);

    if (view === 'support') {
      markSupportReviewed();
    }
  });
});

document.addEventListener('click', (event) => {
  const routeElement = event.target.closest('[data-route]');
  const actionElement = event.target.closest('[data-action]');
  const buttonElement = event.target.closest('button');

  if (routeElement) {
    event.preventDefault();
    const route = routeElement.dataset.route;
    showView(route);

    if (route === 'support') {
      markSupportReviewed();
    }

    return;
  }

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

  if (action === 'toggle-balance-visibility') {
    setBalanceHidden(!balanceHidden);
    return;
  }

  if (action === 'advisor-chat-send') {
    event.preventDefault();
    handleAdvisorChatAction('message');
    return;
  }

  if (action === 'advisor-chat-call') {
    event.preventDefault();
    handleAdvisorChatAction('call');
    return;
  }

  if (action === 'advisor-chat-suggestion') {
    const prompt = actionElement.dataset.prompt || '';
    event.preventDefault();
    handleAdvisorChatAction(/call|phone/i.test(prompt) ? 'call' : 'message', prompt);
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
    closeModal({ restoreFocus: false });
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
    'submit-transfer': 'Transfer sent for joint approval.',
    'create-vault': 'New vault created.',
    'approve-queue': 'Queued transfer approved by this owner.',
    'hold-queue': 'Queued transfer placed on hold.',
    'mark-brief-read': 'Brief marked reviewed.',
    'confirm-security': 'Security settings saved.',
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
  clearAdvisorAutoResponseTimer();
  modalEyebrow.textContent = content.eyebrow;
  modalTitle.textContent = content.title;
  modalBody.innerHTML = content.body;
  makeButtonsClickable(modalBody);
  renderBalanceVisibility(modalBody);
  bindControlToasts(modalBody);
  bindAdvisorChatInteractions();
  modalBackdrop.hidden = false;
  document.body.classList.add('modal-open');
  const focusTarget =
    modalBody.querySelector('input, select, textarea, button:not([data-action="close-modal"])') ||
    modalBackdrop.querySelector('button[data-action="close-modal"]');

  focusTarget?.focus();
}

function closeModal(options = {}) {
  const { restoreFocus = true } = options;
  clearAdvisorAutoResponseTimer();
  modalBackdrop.hidden = true;
  document.body.classList.remove('modal-open');
  if (restoreFocus) {
    lastActionTrigger?.focus();
  }
  lastActionTrigger = null;
}

function showApp() {
  resetUnlockState();
  loginScreen.hidden = true;
  appShell.hidden = false;
  relationshipManagerSpot?.classList.remove('is-compact');
  renderBalanceVisibility(appShell);
  renderConnectionBanner();
  updateConnectionState();
  showView(getInitialView(), { updateHash: false });
}

async function restoreAuthSession() {
  try {
    const response = await fetch(authSessionEndpoint, {
      credentials: 'include',
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      return;
    }

    window.localStorage.setItem('aureliaJointSession', 'active');
    showApp();
    showToast('Secure session restored. Vault unlocked.');
  } catch {
    // The vault can still use its local demo login if the auth service is offline.
  }
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

function showView(viewName, options = {}) {
  if (!modalBackdrop.hidden) {
    closeModal({ restoreFocus: false });
  }

  const view = screenCopy[viewName] ? viewName : 'overview';
  const href = `#${view}`;

  appViews.forEach((section) => {
    const active = section.dataset.view === view;
    section.hidden = !active;
    section.classList.toggle('active', active);
  });

  document.querySelectorAll('[data-nav-link]').forEach((item) => {
    item.classList.toggle('active', item.getAttribute('href') === href);
  });

  screenEyebrow.textContent = screenCopy[view].eyebrow;
  screenTitle.textContent = screenCopy[view].title;

  if (options.updateHash !== false) {
    window.history.replaceState(null, '', href);
  }

  mainScrollTop();
}

function getInitialView() {
  return getViewFromHref(window.location.hash) || 'overview';
}

function getViewFromHref(href) {
  return String(href || '')
    .replace('#', '')
    .trim();
}

function mainScrollTop() {
  document.querySelector('main')?.scrollTo({ top: 0, behavior: 'auto' });
  window.scrollTo({ top: 0, behavior: 'auto' });
}

function updateConnectionState() {
  if (!connectionPill) {
    return;
  }

  const offline = !navigator.onLine;
  connectionPill.textContent = offline ? 'Offline ready' : 'Protected';
  connectionPill.classList.toggle('offline', offline);
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

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function renderAdvisorReceipt(state = 'sent') {
  const isRead = state === 'read';
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      ${isRead ? '<path d="M4.5 12.5 8.5 16.5 19.5 5.5" /><path d="M2.5 12.5 6.5 16.5 10 13" />' : '<path d="M7 12.5 10.4 16 17 8.5" />'}
    </svg>
  `;
}

function setAdvisorReceiptState(messageElement, state = 'read') {
  const receipt = messageElement?.querySelector('[data-advisor-receipt]');
  if (!receipt) {
    return;
  }

  receipt.classList.toggle('is-read', state === 'read');
  receipt.classList.toggle('is-sent', state !== 'read');
  receipt.setAttribute('aria-label', state === 'read' ? 'Read' : 'Sent');
  receipt.innerHTML = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      ${state === 'read' ? '<path d="M4.5 12.5 8.5 16.5 19.5 5.5" /><path d="M2.5 12.5 6.5 16.5 10 13" />' : '<path d="M7 12.5 10.4 16 17 8.5" />'}
    </svg>
  `;
}

function buildAdvisorConversationBody() {
  return `
    <div class="advisor-thread" data-advisor-thread>
      <div class="advisor-status-card" data-advisor-status>
        <strong>Marin Hale online</strong>
        <span>Text your relationship manager directly or request a scheduled call.</span>
      </div>
      <div class="advisor-transcript" data-advisor-transcript aria-live="polite" aria-relevant="additions text">
        ${renderAdvisorMessageCard('human', 'Marin Hale', 'Hi Sean and Michelle. Send me a note here, or use Schedule call and I will confirm a time.', 'is-open')}
      </div>
      <div class="advisor-typing" data-advisor-typing hidden>
        <span></span><span></span><span></span>
      </div>
      <div class="advisor-suggestions" data-advisor-suggestions>
        <button type="button" data-action="advisor-chat-suggestion" data-prompt="Review card approvals">Review card approvals</button>
        <button type="button" data-action="advisor-chat-suggestion" data-prompt="Talk about the home reserve">Talk about the home reserve</button>
        <button type="button" data-action="advisor-chat-suggestion" data-prompt="Schedule a call with Marin Hale">Schedule a call</button>
      </div>
      <form class="advisor-composer" data-advisor-form>
        <label>
          Message Marin Hale
          <input
            type="text"
            data-advisor-input
            autocomplete="off"
            placeholder="Text Marin about approvals, transfers, or a call"
          />
        </label>
        <div class="modal-actions">
          <button type="button" data-action="advisor-chat-call">Schedule call</button>
          <button type="submit" data-action="advisor-chat-send">Send message</button>
        </div>
      </form>
      <div class="advisor-follow-up" data-advisor-follow-up>
        <strong>Marin Hale</strong>
        <span>Direct relationship-manager thread is ready.</span>
      </div>
    </div>
  `;
}

function renderAdvisorMessageCard(role, title, message, extraClass = '') {
  const roleClass = role === 'bot' ? 'is-bot' : role === 'human' ? 'is-human' : 'is-user';
  const label = role === 'bot' ? 'Aurelia Concierge' : role === 'human' ? 'Marin Hale' : 'You';
  const receiptState = role === 'user' ? 'sent' : 'read';
  const receiptLabel = receiptState === 'read' ? 'Read' : 'Sent';

  return `
    <article class="advisor-message ${roleClass} ${extraClass}" data-advisor-message>
      <span class="advisor-message-label">${label}</span>
      <strong>${escapeHtml(title)}</strong>
      <p>${escapeHtml(message)}</p>
      <div class="advisor-message-meta">
        <span class="advisor-message-receipt is-${receiptState}" data-advisor-receipt role="img" aria-label="${receiptLabel}">
          ${renderAdvisorReceipt(receiptState)}
        </span>
      </div>
    </article>
  `;
}

function getAdvisorReply(message, mode) {
  const normalizedMessage = message.toLowerCase();

  if (mode === 'call' || normalizedMessage.includes('call') || normalizedMessage.includes('phone')) {
    return {
      title: 'Call request received',
      message:
        'I received your call request. I will check my availability and confirm the next private banking call window in this thread.',
      followUp: 'Marin Hale is confirming a call time for you.',
    };
  }

  if (
    normalizedMessage.includes('approval') ||
    normalizedMessage.includes('card') ||
    normalizedMessage.includes('limit') ||
    normalizedMessage.includes('freeze')
  ) {
    return {
      title: 'Controls reviewed',
      message:
        'I can help with card controls and approval settings. Tell me what limit or permission you want reviewed and I will prepare the next step.',
      followUp: 'Marin Hale is reviewing your control request.',
    };
  }

  if (
    normalizedMessage.includes('transfer') ||
    normalizedMessage.includes('move money') ||
    normalizedMessage.includes('home reserve')
  ) {
    return {
      title: 'Transfer note logged',
      message:
        'I see the transfer context. Send me the amount, destination, and timing you want, and I will help review the approval path.',
      followUp: 'Marin Hale is reviewing your transfer note.',
    };
  }

  if (normalizedMessage.includes('savings') || normalizedMessage.includes('interest') || normalizedMessage.includes('yield')) {
    return {
      title: 'Savings guidance queued',
      message:
        'I can review your savings goals and current reserve structure. Tell me which vault you want to discuss first.',
      followUp: 'Marin Hale is reviewing your savings question.',
    };
  }

  return {
    title: 'Message received',
    message:
      'I received your message. Add any timing or account details you want me to consider and I will keep the thread moving.',
    followUp: 'Marin Hale is reviewing your message.',
  };
}

function bindAdvisorChatInteractions() {
  if (modalBody.dataset.advisorChatBound === 'true') {
    return;
  }

  modalBody.dataset.advisorChatBound = 'true';
  modalBody.addEventListener('submit', (event) => {
    if (!event.target.matches('[data-advisor-form]')) {
      return;
    }

    event.preventDefault();
    handleAdvisorChatAction('message');
  });
}

function handleAdvisorChatAction(mode, prompt = '') {
  const transcript = modalBody.querySelector('[data-advisor-transcript]');
  const input = modalBody.querySelector('[data-advisor-input]');
  const typing = modalBody.querySelector('[data-advisor-typing]');
  const followUp = modalBody.querySelector('[data-advisor-follow-up]');

  if (!transcript || !typing || !followUp) {
    return;
  }

  clearAdvisorAutoResponseTimer();

  const userMessage =
    (prompt || input?.value || '').trim() || (mode === 'call' ? 'Please schedule a call with Marin Hale.' : 'Please review my note.');
  const userTitle = mode === 'call' ? 'Call request' : 'You';

  if (input) {
    input.value = '';
  }

  transcript.insertAdjacentHTML('beforeend', renderAdvisorMessageCard('user', userTitle, userMessage));
  const sentMessageCard = transcript.lastElementChild;
  typing.hidden = false;
  followUp.classList.add('is-pending');
  followUp.innerHTML = `
    <strong>Marin Hale</strong>
    <span>${mode === 'call' ? 'Your call request has been received. Marin Hale will confirm the next available time.' : 'Your message has been sent directly to Marin Hale.'}</span>
  `;
  transcript.scrollTop = transcript.scrollHeight;

  showToast(mode === 'call' ? 'Call request sent to Marin Hale.' : 'Message sent to Marin Hale.');

  advisorAutoResponseTimer = window.setTimeout(() => {
    const reply = getAdvisorReply(userMessage, mode);
    typing.hidden = true;
    transcript.insertAdjacentHTML('beforeend', renderAdvisorMessageCard('human', reply.title, reply.message, 'is-reply'));
    setAdvisorReceiptState(sentMessageCard, 'read');
    followUp.classList.remove('is-pending');
    followUp.innerHTML = `
      <strong>Marin Hale</strong>
      <span>${escapeHtml(reply.followUp)}</span>
    `;
    transcript.scrollTop = transcript.scrollHeight;

    window.clearTimeout(advisorFollowUpTimer);
    advisorFollowUpTimer = window.setTimeout(() => {
      followUp.innerHTML = `
        <strong>Marin Hale</strong>
        <span>Direct relationship-manager thread is ready.</span>
      `;
      const humanMessages = [...transcript.querySelectorAll('.advisor-message.is-human')];
      const latestHumanMessage = humanMessages[humanMessages.length - 1];
      setAdvisorReceiptState(latestHumanMessage, 'read');
    }, advisorFollowUpDelayMs);
  }, advisorTypingDelayMs);
}

function clearAdvisorAutoResponseTimer() {
  window.clearTimeout(advisorAutoResponseTimer);
  advisorAutoResponseTimer = null;
  window.clearTimeout(advisorFollowUpTimer);
  advisorFollowUpTimer = null;
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

function renderBalanceVisibility(scope = document) {
  const balanceNodes = scope.querySelectorAll('[data-balance-value]');

  balanceNodes.forEach((node) => {
    if (!node.dataset.balanceOriginal) {
      node.dataset.balanceOriginal = node.textContent.trim();
    }

    node.textContent = balanceHidden ? balanceMaskText : node.dataset.balanceOriginal;

    if (balanceHidden) {
      node.setAttribute('aria-label', 'Balance hidden');
    } else {
      node.removeAttribute('aria-label');
    }
  });

  if (balanceVisibilityToggle) {
    balanceVisibilityToggle.classList.toggle('is-hidden', balanceHidden);
    balanceVisibilityToggle.setAttribute('aria-pressed', String(balanceHidden));
    balanceVisibilityToggle.setAttribute('aria-label', balanceHidden ? 'Show balances' : 'Hide balances');

    const toggleLabel = balanceVisibilityToggle.querySelector('[data-balance-toggle-label]');

    if (toggleLabel) {
      toggleLabel.textContent = balanceHidden ? 'Show' : 'Hide';
    }
  }
}

function setBalanceHidden(nextHidden) {
  if (balanceHidden === nextHidden) {
    return;
  }

  balanceHidden = nextHidden;
  window.localStorage.setItem(balanceVisibilityStorageKey, String(balanceHidden));
  const root = document.documentElement;

  window.clearTimeout(balanceTransitionTimer);
  root.classList.remove('balance-hiding', 'balance-revealing', 'balance-transitioning');
  root.classList.add('balance-transitioning', nextHidden ? 'balance-hiding' : 'balance-revealing');

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(() => {
      renderBalanceVisibility();
      balanceTransitionTimer = window.setTimeout(() => {
        root.classList.remove('balance-hiding', 'balance-revealing', 'balance-transitioning');
        balanceTransitionTimer = null;
      }, balanceTransitionMs);
    });
  });
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
bindControlToasts();
renderSupportBadge();
renderConnectionBanner();
updateConnectionState();
setupInstallExperience();
renderBalanceVisibility();

function bindControlToasts(scope = document) {
  scope.querySelectorAll('[data-control]').forEach((control) => {
    if (control.dataset.bound === 'true') {
      return;
    }

    control.dataset.bound = 'true';
    control.addEventListener('change', () => {
      const state = control.checked ? 'enabled' : 'disabled';
      showToast(`${control.dataset.control} ${state}.`);
    });
  });
}

window.addEventListener('hashchange', () => {
  if (!appShell.hidden) {
    showView(getInitialView(), { updateHash: false });
  }
});

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
  updateConnectionState();
  showToast('Connection restored.');
});

window.addEventListener('offline', () => {
  renderConnectionBanner();
  updateConnectionState();
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
      'Add Aurelia to your home screen for one-tap access, offline-ready banking, and a cleaner full-screen feel.';
    installBannerHint.textContent = 'Android and desktop browsers can install directly from this banner.';
    installButton.textContent = 'Install now';
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
    'This dashboard installs as a Progressive Web App for faster repeat access and offline-ready navigation.';
  installBannerHint.textContent = 'If your browser does not show a prompt, use the browser menu and choose Install Aurelia.';
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
