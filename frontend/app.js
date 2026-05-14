const activities = [
  {
    name: 'BaaS settlement reserve',
    detail: 'Incoming ACH',
    amount: '+$18,400.00',
    status: 'Posted',
  },
  {
    name: 'Aureum Platinum card',
    detail: 'Private aviation hold',
    amount: '-$6,250.00',
    status: 'Pending',
  },
  {
    name: 'Treasury Vault transfer',
    detail: 'Automated allocation',
    amount: '-$12,000.00',
    status: 'Queued',
  },
  {
    name: 'Concierge reimbursement',
    detail: 'Travel adjustment',
    amount: '+$740.24',
    status: 'Posted',
  },
];

const goals = [
  { label: 'Tax reserve', value: 78, balance: '$156,000' },
  { label: 'Property closing', value: 56, balance: '$92,800' },
  { label: 'Opportunity fund', value: 34, balance: '$58,000' },
];

const transferHistory = [
  {
    date: 'Aug 2023',
    asset: 'Spirits, Ciroc, DeLeon',
    transaction: 'Valuation haircut',
    amount: '-$40,000,000',
    newValue: '$660,000,000',
    notes: 'Reduced growth assumptions; partnership risk priced in.',
  },
  {
    date: 'Nov 2023',
    asset: 'PearPop, Revolt TV',
    transaction: 'Partial secondary sale and restructure',
    amount: '$3,500,000 | -$10,000,000',
    newValue: '$5,000,000 | $40,000,000',
    notes: 'Small liquidity extraction; Revolt dilution ahead of exit.',
  },
  {
    date: 'Feb 2024',
    asset: 'Spirits, Ciroc, DeLeon',
    transaction: 'Distribution decline priced in',
    amount: '-$90,000,000',
    newValue: '$570,000,000',
    notes: 'Lower payout outlook.',
  },
  {
    date: 'May 2024',
    asset: 'Revolt TV, Miami Real Estate',
    transaction: 'Stake sold and appraisal adjustment',
    amount: '$18,000,000 | -$6,000,000',
    newValue: '$0 | $94,000,000',
    notes: 'Sold at discount; Miami market risk discount.',
  },
  {
    date: 'Aug 2024',
    asset: 'Spirits, Empower Global',
    transaction: 'Major correction and shutdown',
    amount: '-$120,000,000 | -$6,000,000',
    newValue: '$450,000,000 | $26,000,000',
    notes: 'Partnership uncertainty escalates; marketplace written off.',
  },
  {
    date: 'Nov 2024',
    asset: 'Catalog, Spotify exposure',
    transaction: 'Royalty advance and liquidation',
    amount: '$9,000,000 | $7,500,000',
    newValue: '$48,000,000 | $16,000,000',
    notes: 'Borrowed against royalties; sold stake for liquidity.',
  },
  {
    date: 'Feb 2025',
    asset: 'Spirits, Star Island Real Estate',
    transaction: 'Impairment and appraisal reduction',
    amount: '-$120,000,000 | -$15,000,000',
    newValue: '$330,000,000 | $79,000,000',
    notes: 'Lower rights value; forced-sale discount increases.',
  },
  {
    date: 'May 2025',
    asset: 'PearPop, PlayVS',
    transaction: 'Full exit and dilution',
    amount: '$2,200,000 | -$4,000,000',
    newValue: '$9,000,000 | $12,000,000',
    notes: 'Liquidated remaining position; valuation reset.',
  },
  {
    date: 'Aug 2025',
    asset: 'Spirits, Ciroc, DeLeon',
    transaction: 'Collapse to distressed pricing',
    amount: '-$130,000,000',
    newValue: '$200,000,000',
    notes: 'Analysts price near end of earnings rights.',
  },
  {
    date: 'Nov 2025',
    asset: 'Toluca Lake, Collectibles',
    transaction: 'Quiet sale and auction liquidation',
    amount: '$14,000,000 | $8,000,000',
    newValue: '$63,000,000 | $51,000,000',
    notes: 'Sold below peak; forced liquidity extraction.',
  },
  {
    date: 'Feb 2026',
    asset: 'Spirits, Catalog and IP',
    transaction: 'Final correction and rights collapse',
    amount: '-$50,000,000 | -$15,000,000',
    newValue: '$150,000,000 | $15,000,000',
    notes: 'Matches scenario target.',
  },
  {
    date: 'May 2026',
    asset: 'Cash, Private Investments, Mortgage Bond',
    transaction: 'Cash burn, remark, collateral debt',
    amount: '-$19,700,000 | $22,000,000 | $18,000,000',
    newValue: '$10,000,000 | $25,000,000 | $100,000,000',
    notes: 'Debt raised; net worth neutral, leverage increases.',
  },
];

const activityList = document.querySelector('#activityList');
const goalList = document.querySelector('#goalList');
const transferHistoryTable = document.querySelector('#transferHistory');
const modalBackdrop = document.querySelector('#modalBackdrop');
const modalEyebrow = document.querySelector('#modalEyebrow');
const modalTitle = document.querySelector('#modalTitle');
const modalBody = document.querySelector('#modalBody');
const toast = document.querySelector('#toast');
let lastActionTrigger = null;

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

transferHistoryTable.innerHTML = transferHistory
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
  .join('');

const modalContent = {
  'message-advisor': {
    eyebrow: 'Chief Financial Officer',
    title: 'Talk to Tony Abrahams',
    body: `
      <div class="contact-card">
        <strong>Tony Abrahams</strong>
        <span>Chief Financial Officer</span>
      </div>
      <label>
        Subject
        <input type="text" value="Portfolio liquidity review" />
      </label>
      <label>
        Message
        <textarea rows="5">Please prepare an updated note on the Sean John Combs asset ledger and near-term liquidity options.</textarea>
      </label>
      <div class="modal-actions">
        <button type="button" data-action="send-message">Send message</button>
        <button type="button" data-action="schedule-cfo-call">Schedule call</button>
      </div>
    `,
  },
  search: {
    eyebrow: 'Search',
    title: 'Find records',
    body: `
      <label>
        Search dashboard
        <input type="search" id="dashboardSearch" placeholder="Try spirits, mortgage, cash, Revolt" />
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
          <option>Operating cash - $82,410.18</option>
          <option>Treasury Vault - $156,000</option>
          <option>Opportunity fund - $58,000</option>
        </select>
      </label>
      <label>
        Amount
        <input type="text" value="$12,000" />
      </label>
      <label>
        Destination
        <select>
          <option>Treasury Vault</option>
          <option>External counsel escrow</option>
          <option>Tax reserve</option>
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
        <input type="text" value="Legal reserve" />
      </label>
      <label>
        Target
        <input type="text" value="$50,000" />
      </label>
      <button type="button" data-action="create-vault">Create vault</button>
    `,
  },
  'review-queue': {
    eyebrow: 'Transfers',
    title: 'Scheduled movement',
    body: `
      <div class="queue-item">
        <strong>$12,000 to Treasury Vault</strong>
        <span>Scheduled for May 12. Status: queued.</span>
      </div>
      <div class="modal-actions">
        <button type="button" data-action="approve-queue">Approve</button>
        <button type="button" data-action="hold-queue">Place hold</button>
      </div>
    `,
  },
  'open-brief': {
    eyebrow: 'Concierge',
    title: 'Weekly liquidity brief',
    body: `
      <p>Advisor note prepared for Sean John Combs: liquidity is concentrated in cash preservation, private investment remarking, and collateralized debt management.</p>
      <p>Recommended next step: review May 2026 leverage exposure and confirm any upcoming asset-sale constraints.</p>
      <button type="button" data-action="mark-brief-read">Mark reviewed</button>
    `,
  },
};

document.querySelectorAll('.nav-list a, .brand').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.nav-list a').forEach((item) => item.classList.remove('active'));
    const matchingNav = document.querySelector(`.nav-list a[href="${link.getAttribute('href')}"]`);
    matchingNav?.classList.add('active');
  });
});

document.addEventListener('click', (event) => {
  const actionElement = event.target.closest('[data-action]');
  const buttonElement = event.target.closest('button');

  if (!actionElement) {
    if (buttonElement) {
      event.preventDefault();
      const label = buttonElement.textContent.trim() || buttonElement.getAttribute('aria-label') || 'Button';
      showToast(`${label} clicked.`);
    }
    return;
  }

  event.preventDefault();
  const action = actionElement.dataset.action;

  if (modalContent[action]) {
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

  if (action === 'export-activity') {
    downloadCsv('recent-activity.csv', activities);
    showToast('Recent activity exported.');
    return;
  }

  if (action === 'download-history') {
    downloadCsv('sean-john-combs-transfer-history.csv', transferHistory);
    showToast('Transfer history CSV downloaded.');
    return;
  }

  const completionMessages = {
    'send-message': 'Message sent to Tony Abrahams.',
    'schedule-cfo-call': 'Call request sent to Tony Abrahams.',
    'submit-transfer': 'Transfer scheduled for review.',
    'create-vault': 'New vault created.',
    'approve-queue': 'Queued transfer approved.',
    'hold-queue': 'Queued transfer placed on hold.',
    'mark-brief-read': 'Brief marked reviewed.',
  };

  if (completionMessages[action]) {
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

function makeButtonsClickable(scope = document) {
  scope.querySelectorAll('button:not([data-action])').forEach((button) => {
    button.dataset.action = 'button-action';
    if (!button.type) {
      button.type = 'button';
    }
  });
}

makeButtonsClickable();

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
  showToast('Connection restored.');
});

window.addEventListener('offline', () => {
  showToast('You are offline. Cached banking tools remain available.');
});

function activateWaitingWorker(registration) {
  registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
  showToast('A fresh banking shell is ready.');
}
