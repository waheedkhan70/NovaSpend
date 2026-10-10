/**
 * NovaSpend — Personal Expense Tracker Logic
 * Vanilla JavaScript (ES6+), Zero External Libraries
 */

'use strict';

// -----------------------------------------------------------------------------
// 1. Constants & Sample Data
// -----------------------------------------------------------------------------
const STORAGE_KEYS = {
  TRANSACTIONS: 'novaspend_transactions_v2',
  CURRENCY: 'novaspend_currency_v2'
};

const CATEGORY_ICONS = {
  'Food & Dining': '🍔',
  'Housing & Rent': '🏠',
  'Transportation': '🚗',
  'Utilities & Bills': '💡',
  'Entertainment': '🎬',
  'Health & Medical': '💊',
  'Shopping': '🛍️',
  'Personal Care': '✨',
  'Work & Education': '💼',
  'Other': '🏷️'
};

const CATEGORY_COLORS = {
  'Food & Dining': 'cat-color-food',
  'Housing & Rent': 'cat-color-housing',
  'Transportation': 'cat-color-transport',
  'Utilities & Bills': 'cat-color-utilities',
  'Entertainment': 'cat-color-entertainment',
  'Health & Medical': 'cat-color-health',
  'Shopping': 'cat-color-shopping',
  'Personal Care': 'cat-color-personal',
  'Work & Education': 'cat-color-work',
  'Other': 'cat-color-other'
};

// Realistic initial sample transactions for demonstration
const SAMPLE_TRANSACTIONS = [
  {
    id: 'tx_sample_1',
    name: 'Whole Foods Groceries',
    amount: 86.40,
    category: 'Food & Dining',
    date: getRelativeDate(-1),
    payment: 'Credit Card',
    createdAt: Date.now() - 86400000
  },
  {
    id: 'tx_sample_2',
    name: 'Monthly Fiber Internet',
    amount: 65.00,
    category: 'Utilities & Bills',
    date: getRelativeDate(-3),
    payment: 'Bank Transfer',
    createdAt: Date.now() - 259200000
  },
  {
    id: 'tx_sample_3',
    name: 'Metro Subway Transit Card',
    amount: 45.00,
    category: 'Transportation',
    date: getRelativeDate(-5),
    payment: 'Debit Card',
    createdAt: Date.now() - 432000000
  },
  {
    id: 'tx_sample_4',
    name: 'Acoustic Studio Headphones',
    amount: 149.99,
    category: 'Shopping',
    date: getRelativeDate(-10),
    payment: 'Credit Card',
    createdAt: Date.now() - 864000000
  },
  {
    id: 'tx_sample_5',
    name: 'Cinema Premiere & Snacks',
    amount: 32.50,
    category: 'Entertainment',
    date: getRelativeDate(-15),
    payment: 'Digital Wallet',
    createdAt: Date.now() - 1296000000
  },
  {
    id: 'tx_sample_6',
    name: 'Dental Checkup & Cleaning',
    amount: 120.00,
    category: 'Health & Medical',
    date: getRelativeDate(-25),
    payment: 'Credit Card',
    createdAt: Date.now() - 2160000000
  },
  {
    id: 'tx_sample_7',
    name: 'Apartment Maintenance Fee',
    amount: 210.00,
    category: 'Housing & Rent',
    date: getRelativeDate(-40),
    payment: 'Bank Transfer',
    createdAt: Date.now() - 3456000000
  }
];

// Helper to generate ISO date strings relative to today
function getRelativeDate(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0];
}

// -----------------------------------------------------------------------------
// 2. Application State
// -----------------------------------------------------------------------------
const state = {
  transactions: [],
  currency: '$',
  searchQuery: '',
  filterCategory: 'all',
  sortBy: 'date-desc',
  activeChartTab: 'monthly',
  pendingDeleteId: null,
  isClearAllAction: false
};

// -----------------------------------------------------------------------------
// 3. DOM Elements Cache
// -----------------------------------------------------------------------------
const DOM = {
  // Currency
  currencySelect: document.getElementById('currency-select'),
  formCurrencySymbol: document.getElementById('form-currency-symbol'),

  // Stats
  statTotalExpense: document.getElementById('stat-total-expense'),
  statTransactionCount: document.getElementById('stat-transaction-count'),
  statHighestExpense: document.getElementById('stat-highest-expense'),
  statHighestName: document.getElementById('stat-highest-name'),
  statAverageExpense: document.getElementById('stat-average-expense'),

  // Form & Inputs
  expenseForm: document.getElementById('expense-form'),
  nameInput: document.getElementById('expense-name'),
  amountInput: document.getElementById('expense-amount'),
  dateInput: document.getElementById('expense-date'),
  categorySelect: document.getElementById('expense-category'),
  paymentSelect: document.getElementById('expense-payment'),
  nameError: document.getElementById('name-error'),
  amountError: document.getElementById('amount-error'),
  dateError: document.getElementById('date-error'),
  categoryError: document.getElementById('category-error'),

  // Chart
  tabMonthly: document.getElementById('tab-monthly'),
  tabCategory: document.getElementById('tab-category'),
  viewMonthlyChart: document.getElementById('view-monthly-chart'),
  viewCategoryChart: document.getElementById('view-category-chart'),
  monthlyBarChart: document.getElementById('monthly-bar-chart'),
  chartScaleInfo: document.getElementById('chart-scale-info'),
  categoryBarsList: document.getElementById('category-bars-list'),

  // Filters & Search
  searchInput: document.getElementById('search-input'),
  btnClearSearch: document.getElementById('btn-clear-search'),
  filterCategory: document.getElementById('filter-category'),
  sortBy: document.getElementById('sort-by'),
  filteredCountText: document.getElementById('filtered-count-text'),
  filteredSubtotalText: document.getElementById('filtered-subtotal-text'),

  // Transactions list
  transactionList: document.getElementById('transaction-list'),
  emptyState: document.getElementById('empty-state'),
  emptyStateMessage: document.getElementById('empty-state-message'),
  btnEmptyDemo: document.getElementById('btn-empty-demo'),

  // Header and Bulk Buttons
  btnSampleData: document.getElementById('btn-sample-data'),
  btnExportCsv: document.getElementById('btn-export-csv'),
  btnClearAll: document.getElementById('btn-clear-all'),

  // Modals & Toasts
  confirmModal: document.getElementById('confirm-modal'),
  modalTitle: document.getElementById('modal-title'),
  modalDescription: document.getElementById('modal-description'),
  modalBtnCancel: document.getElementById('modal-btn-cancel'),
  modalBtnConfirm: document.getElementById('modal-btn-confirm'),
  toastContainer: document.getElementById('toast-container')
};

// -----------------------------------------------------------------------------
// 4. Persistence Layer (LocalStorage)
// -----------------------------------------------------------------------------
function loadPersistedData() {
  try {
    const savedCurrency = localStorage.getItem(STORAGE_KEYS.CURRENCY);
    if (savedCurrency) {
      state.currency = savedCurrency;
      if (DOM.currencySelect) DOM.currencySelect.value = savedCurrency;
      if (DOM.formCurrencySymbol) DOM.formCurrencySymbol.textContent = savedCurrency;
    }

    const savedTx = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    if (savedTx) {
      const parsed = JSON.parse(savedTx);
      if (Array.isArray(parsed) && parsed.length > 0) {
        state.transactions = parsed;
        return;
      }
    }
    // If no existing data found, populate sample demo data
    state.transactions = [...SAMPLE_TRANSACTIONS];
    saveTransactions();
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    state.transactions = [...SAMPLE_TRANSACTIONS];
  }
}

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(state.transactions));
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    showToast('Failed to save to local storage (quota exceeded or disabled).', 'error');
  }
}

function saveCurrency(currency) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  } catch (error) {
    console.error('Error saving currency to localStorage:', error);
  }
}

// -----------------------------------------------------------------------------
// 5. Utility & Formatting Functions
// -----------------------------------------------------------------------------
function formatCurrency(amount) {
  const num = typeof amount === 'number' ? amount : parseFloat(amount) || 0;
  return `${state.currency}${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function formatDateDisplay(dateString) {
  if (!dateString) return 'Unknown date';
  try {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(year, month, day);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
    return dateString;
  } catch (e) {
    return dateString;
  }
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .toString()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generateId() {
  return 'tx_' + Date.now().toString(36) + '_' + Math.random().toString(36).substr(2, 5);
}

// -----------------------------------------------------------------------------
// 6. Toast Notification System
// -----------------------------------------------------------------------------
function showToast(message, type = 'info', duration = 3000) {
  if (!DOM.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const iconMap = {
    success: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`,
    error: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    info: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  toast.innerHTML = `
    ${iconMap[type] || iconMap.info}
    <span>${escapeHTML(message)}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('toast-fadeout');
    toast.addEventListener('transitionend', () => toast.remove(), { once: true });
  }, duration);
}

// -----------------------------------------------------------------------------
// 7. Validation & Form Management
// -----------------------------------------------------------------------------
function clearErrors() {
  const formGroups = DOM.expenseForm.querySelectorAll('.form-group');
  formGroups.forEach(group => group.classList.remove('has-error'));

  DOM.nameError.textContent = '';
  DOM.amountError.textContent = '';
  DOM.dateError.textContent = '';
  DOM.categoryError.textContent = '';
}

function validateForm(data) {
  clearErrors();
  let isValid = true;

  // Name validation
  if (!data.name || data.name.trim().length === 0) {
    DOM.nameError.textContent = 'Please enter an expense description.';
    DOM.nameInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  } else if (data.name.trim().length > 60) {
    DOM.nameError.textContent = 'Description cannot exceed 60 characters.';
    DOM.nameInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  }

  // Amount validation
  const numAmount = parseFloat(data.amount);
  if (!data.amount || isNaN(numAmount) || numAmount <= 0) {
    DOM.amountError.textContent = 'Please enter a valid amount greater than 0.';
    DOM.amountInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  } else if (numAmount > 10000000) {
    DOM.amountError.textContent = 'Amount exceeds maximum allowable limit.';
    DOM.amountInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  }

  // Date validation
  if (!data.date || data.date.trim() === '') {
    DOM.dateError.textContent = 'Please choose a transaction date.';
    DOM.dateInput.closest('.form-group').classList.add('has-error');
    isValid = false;
  }

  // Category validation
  if (!data.category || data.category === '') {
    DOM.categoryError.textContent = 'Please select an expense category.';
    DOM.categorySelect.closest('.form-group').classList.add('has-error');
    isValid = false;
  }

  return isValid;
}

function handleAddExpense(e) {
  e.preventDefault();

  const formData = {
    name: DOM.nameInput.value,
    amount: DOM.amountInput.value,
    date: DOM.dateInput.value,
    category: DOM.categorySelect.value,
    payment: DOM.paymentSelect.value || 'Credit Card'
  };

  if (!validateForm(formData)) {
    return;
  }

  const newTransaction = {
    id: generateId(),
    name: formData.name.trim(),
    amount: parseFloat(parseFloat(formData.amount).toFixed(2)),
    category: formData.category,
    date: formData.date,
    payment: formData.payment,
    createdAt: Date.now()
  };

  // Prepend new transaction
  state.transactions.unshift(newTransaction);
  saveTransactions();

  // Reset inputs (preserve default date to today)
  DOM.nameInput.value = '';
  DOM.amountInput.value = '';
  DOM.categorySelect.selectedIndex = 0;
  clearErrors();
  DOM.nameInput.focus();

  updateApp();
  showToast(`Added "${newTransaction.name}" (${formatCurrency(newTransaction.amount)})`, 'success');
}

// -----------------------------------------------------------------------------
// 8. Calculations & Statistics
// -----------------------------------------------------------------------------
function calculateMetrics() {
  const total = state.transactions.reduce((acc, curr) => acc + curr.amount, 0);
  const count = state.transactions.length;

  let highest = { amount: 0, name: 'None' };
  if (count > 0) {
    highest = state.transactions.reduce((max, curr) => (curr.amount > max.amount ? curr : max), state.transactions[0]);
  }

  const average = count > 0 ? total / count : 0;

  return {
    total,
    count,
    highestAmount: highest.amount,
    highestName: highest.name,
    average
  };
}

function renderMetrics() {
  const metrics = calculateMetrics();

  DOM.statTotalExpense.textContent = formatCurrency(metrics.total);
  DOM.statTransactionCount.textContent = metrics.count.toLocaleString();
  DOM.statHighestExpense.textContent = formatCurrency(metrics.highestAmount);
  DOM.statHighestName.textContent = metrics.count > 0 ? metrics.highestName : 'No expenses';
  DOM.statAverageExpense.textContent = formatCurrency(metrics.average);
}

// -----------------------------------------------------------------------------
// 9. Filtering, Searching & Sorting
// -----------------------------------------------------------------------------
function getFilteredAndSortedTransactions() {
  let list = [...state.transactions];

  // 1. Search filter
  if (state.searchQuery.trim() !== '') {
    const q = state.searchQuery.toLowerCase().trim();
    list = list.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.payment && item.payment.toLowerCase().includes(q))
    );
  }

  // 2. Category filter
  if (state.filterCategory !== 'all') {
    list = list.filter(item => item.category === state.filterCategory);
  }

  // 3. Sorting
  list.sort((a, b) => {
    switch (state.sortBy) {
      case 'date-asc':
        return new Date(a.date) - new Date(b.date) || a.createdAt - b.createdAt;
      case 'date-desc':
      default:
        return new Date(b.date) - new Date(a.date) || b.createdAt - a.createdAt;
      case 'amount-desc':
        return b.amount - a.amount;
      case 'amount-asc':
        return a.amount - b.amount;
      case 'name-asc':
        return a.name.localeCompare(b.name);
    }
  });

  return list;
}

function renderTransactionList() {
  const filteredList = getFilteredAndSortedTransactions();
  const subtotal = filteredList.reduce((acc, curr) => acc + curr.amount, 0);

  // Update status summary text
  const totalCount = state.transactions.length;
  if (totalCount === 0) {
    DOM.filteredCountText.textContent = 'No transactions recorded';
  } else if (filteredList.length === totalCount) {
    DOM.filteredCountText.textContent = `Showing all ${totalCount} transactions`;
  } else {
    DOM.filteredCountText.textContent = `Showing ${filteredList.length} of ${totalCount} matching`;
  }
  DOM.filteredSubtotalText.textContent = `Subtotal: ${formatCurrency(subtotal)}`;

  // Handle Empty State
  if (filteredList.length === 0) {
    DOM.transactionList.innerHTML = '';
    DOM.emptyState.classList.remove('hidden');

    if (totalCount === 0) {
      DOM.emptyStateMessage.textContent = 'Record your first expense above or click below to populate sample demo data.';
      DOM.btnEmptyDemo.classList.remove('hidden');
    } else {
      DOM.emptyStateMessage.textContent = 'No expenses match your active search and filter criteria. Try clearing filters.';
      DOM.btnEmptyDemo.classList.add('hidden');
    }
    return;
  }

  DOM.emptyState.classList.add('hidden');

  // Build Transaction Items HTML
  const itemsHtml = filteredList.map(tx => {
    const icon = CATEGORY_ICONS[tx.category] || '🏷️';
    const dateFormatted = formatDateDisplay(tx.date);

    return `
      <li class="tx-item" data-id="${tx.id}">
        <div class="tx-left">
          <div class="tx-cat-badge" title="${escapeHTML(tx.category)}">
            ${icon}
          </div>
          <div class="tx-details">
            <span class="tx-name" title="${escapeHTML(tx.name)}">${escapeHTML(tx.name)}</span>
            <div class="tx-meta">
              <span class="tx-date">${dateFormatted}</span>
              <span>&bull;</span>
              <span class="tx-category-tag">${escapeHTML(tx.category)}</span>
              ${tx.payment ? `<span>&bull;</span> <span class="tx-payment">${escapeHTML(tx.payment)}</span>` : ''}
            </div>
          </div>
        </div>
        <div class="tx-right">
          <span class="tx-amount">-${formatCurrency(tx.amount)}</span>
          <button class="tx-delete-btn" data-delete-id="${tx.id}" title="Delete this transaction" aria-label="Delete transaction ${escapeHTML(tx.name)}">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/>
              <line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </li>
    `;
  }).join('');

  DOM.transactionList.innerHTML = itemsHtml;
}

// -----------------------------------------------------------------------------
// 10. Visualizations & Charts (Pure Vanilla JS / CSS)
// -----------------------------------------------------------------------------

/**
 * Monthly Expense Bar Chart Generator
 * Calculates monthly totals across recorded transactions and builds pure CSS bar columns
 */
function renderMonthlyChart() {
  if (!DOM.monthlyBarChart) return;

  if (state.transactions.length === 0) {
    DOM.monthlyBarChart.innerHTML = `
      <div style="margin: auto; color: var(--text-dim); font-size: 0.85rem; text-align: center;">
        No expense data to chart yet.
      </div>
    `;
    DOM.chartScaleInfo.textContent = '';
    return;
  }

  // 1. Group expenses by Year-Month (e.g. "2026-09", "2026-10")
  const monthMap = {};
  state.transactions.forEach(tx => {
    if (!tx.date) return;
    const key = tx.date.substring(0, 7); // "YYYY-MM"
    if (!monthMap[key]) {
      monthMap[key] = { total: 0, count: 0, dateKey: key };
    }
    monthMap[key].total += tx.amount;
    monthMap[key].count += 1;
  });

  // Sort keys chronologically
  const sortedMonths = Object.keys(monthMap).sort();

  // If there are more than 6 months, display the most recent 6 for optimal layout
  const displayMonths = sortedMonths.slice(-6);

  // Find maximum monthly total to calculate relative percentage height
  const maxTotal = Math.max(...displayMonths.map(k => monthMap[k].total), 1);
  DOM.chartScaleInfo.textContent = `Max: ${formatCurrency(maxTotal)}`;

  const barsHtml = displayMonths.map(key => {
    const data = monthMap[key];
    const percentage = Math.max(Math.round((data.total / maxTotal) * 100), 6); // Min 6% height for visibility

    // Human readable month label (e.g., "Oct 26")
    const [year, month] = key.split('-');
    const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, 1);
    const label = dateObj.toLocaleDateString('en-US', { month: 'short' });

    return `
      <div class="chart-bar-group" tabindex="0" aria-label="${label}: ${formatCurrency(data.total)}">
        <div class="chart-tooltip">
          <strong>${formatCurrency(data.total)}</strong>
          <span>${data.count} transaction${data.count > 1 ? 's' : ''}</span>
        </div>
        <div class="chart-bar-track">
          <div class="chart-bar-fill" style="height: ${percentage}%;"></div>
        </div>
        <span class="chart-bar-label">${label}</span>
      </div>
    `;
  }).join('');

  DOM.monthlyBarChart.innerHTML = barsHtml;
}

/**
 * Category Breakdown Generator
 * Calculates expenditure per category and renders stylish progress bars
 */
function renderCategoryBreakdown() {
  if (!DOM.categoryBarsList) return;

  const totalExpense = state.transactions.reduce((acc, curr) => acc + curr.amount, 0);

  if (totalExpense === 0) {
    DOM.categoryBarsList.innerHTML = `
      <div style="margin: auto; padding: 2rem 0; color: var(--text-dim); font-size: 0.85rem; text-align: center;">
        No categories to display.
      </div>
    `;
    return;
  }

  // Aggregate by category
  const categoryMap = {};
  state.transactions.forEach(tx => {
    const cat = tx.category || 'Other';
    if (!categoryMap[cat]) {
      categoryMap[cat] = 0;
    }
    categoryMap[cat] += tx.amount;
  });

  // Sort descending by amount
  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);

  const rowsHtml = sortedCategories.map(([category, amount]) => {
    const icon = CATEGORY_ICONS[category] || '🏷️';
    const percent = ((amount / totalExpense) * 100).toFixed(1);
    const colorClass = CATEGORY_COLORS[category] || 'cat-color-other';

    return `
      <div class="cat-row">
        <div class="cat-header">
          <span class="cat-name-icon">
            <span>${icon}</span>
            <span>${escapeHTML(category)}</span>
          </span>
          <div class="cat-amount-meta">
            <span class="cat-amount">${formatCurrency(amount)}</span>
            <span class="cat-percentage">${percent}%</span>
          </div>
        </div>
        <div class="cat-progress-track">
          <div class="cat-progress-fill ${colorClass}" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  }).join('');

  DOM.categoryBarsList.innerHTML = rowsHtml;
}

// -----------------------------------------------------------------------------
// 11. Modal Confirmation Handling
// -----------------------------------------------------------------------------
function openConfirmModal({ title, description, confirmText, onConfirm }) {
  DOM.modalTitle.textContent = title;
  DOM.modalDescription.textContent = description;
  DOM.modalBtnConfirm.textContent = confirmText || 'Confirm';
  DOM.confirmModal.classList.remove('hidden');

  // Remove previous listener to avoid stacking
  const confirmHandler = () => {
    DOM.confirmModal.classList.add('hidden');
    DOM.modalBtnConfirm.removeEventListener('click', confirmHandler);
    onConfirm();
  };

  DOM.modalBtnConfirm.onclick = confirmHandler;
}

function closeConfirmModal() {
  DOM.confirmModal.classList.add('hidden');
  DOM.modalBtnConfirm.onclick = null;
}

// -----------------------------------------------------------------------------
// 12. Transaction Actions (Delete, Clear All, Demo Data)
// -----------------------------------------------------------------------------
function confirmDeleteTransaction(id) {
  const tx = state.transactions.find(t => t.id === id);
  if (!tx) return;

  openConfirmModal({
    title: 'Delete Expense Entry?',
    description: `Are you sure you want to delete "${tx.name}" (${formatCurrency(tx.amount)})? This action cannot be undone.`,
    confirmText: 'Delete Entry',
    onConfirm: () => {
      state.transactions = state.transactions.filter(t => t.id !== id);
      saveTransactions();
      updateApp();
      showToast(`Removed "${tx.name}"`, 'info');
    }
  });
}

function confirmClearAll() {
  if (state.transactions.length === 0) {
    showToast('There are no transactions to clear.', 'info');
    return;
  }

  openConfirmModal({
    title: 'Clear All Transactions?',
    description: `This will permanently delete all ${state.transactions.length} recorded expense entries. Are you sure?`,
    confirmText: 'Clear All Data',
    onConfirm: () => {
      state.transactions = [];
      saveTransactions();
      updateApp();
      showToast('All transaction records have been erased.', 'info');
    }
  });
}

function loadDemoData() {
  state.transactions = [...SAMPLE_TRANSACTIONS];
  saveTransactions();
  updateApp();
  showToast('Restored sample expense data.', 'success');
}

// -----------------------------------------------------------------------------
// 13. CSV Data Export
// -----------------------------------------------------------------------------
function exportToCSV() {
  if (state.transactions.length === 0) {
    showToast('No transactions available to export.', 'info');
    return;
  }

  const headers = ['ID', 'Date', 'Description', 'Category', 'Payment Method', 'Amount', 'Currency'];
  const rows = state.transactions.map(tx => [
    `"${tx.id}"`,
    `"${tx.date}"`,
    `"${tx.name.replace(/"/g, '""')}"`,
    `"${tx.category}"`,
    `"${tx.payment || 'None'}"`,
    tx.amount.toFixed(2),
    `"${state.currency}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `NovaSpend_Expenses_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  showToast('Transactions exported to CSV successfully.', 'success');
}

// -----------------------------------------------------------------------------
// 14. Master Render / Update App
// -----------------------------------------------------------------------------
function updateApp() {
  renderMetrics();
  renderTransactionList();
  renderMonthlyChart();
  renderCategoryBreakdown();
}

// -----------------------------------------------------------------------------
// 15. Event Listeners Setup
// -----------------------------------------------------------------------------
function initEventListeners() {
  // Expense Form Submit
  DOM.expenseForm.addEventListener('submit', handleAddExpense);

  // Real-time error dismissal on typing
  DOM.nameInput.addEventListener('input', () => {
    DOM.nameInput.closest('.form-group').classList.remove('has-error');
    DOM.nameError.textContent = '';
  });
  DOM.amountInput.addEventListener('input', () => {
    DOM.amountInput.closest('.form-group').classList.remove('has-error');
    DOM.amountError.textContent = '';
  });
  DOM.dateInput.addEventListener('change', () => {
    DOM.dateInput.closest('.form-group').classList.remove('has-error');
    DOM.dateError.textContent = '';
  });
  DOM.categorySelect.addEventListener('change', () => {
    DOM.categorySelect.closest('.form-group').classList.remove('has-error');
    DOM.categoryError.textContent = '';
  });

  // Currency selector
  DOM.currencySelect.addEventListener('change', (e) => {
    state.currency = e.target.value;
    saveCurrency(state.currency);
    DOM.formCurrencySymbol.textContent = state.currency;
    updateApp();
    showToast(`Currency changed to ${state.currency}`, 'info');
  });

  // Search input
  DOM.searchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (state.searchQuery.length > 0) {
      DOM.btnClearSearch.classList.remove('hidden');
    } else {
      DOM.btnClearSearch.classList.add('hidden');
    }
    renderTransactionList();
  });

  DOM.btnClearSearch.addEventListener('click', () => {
    DOM.searchInput.value = '';
    state.searchQuery = '';
    DOM.btnClearSearch.classList.add('hidden');
    renderTransactionList();
    DOM.searchInput.focus();
  });

  // Filter category
  DOM.filterCategory.addEventListener('change', (e) => {
    state.filterCategory = e.target.value;
    renderTransactionList();
  });

  // Sort by
  DOM.sortBy.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderTransactionList();
  });

  // Transaction list delegation for delete
  DOM.transactionList.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('[data-delete-id]');
    if (deleteBtn) {
      const id = deleteBtn.getAttribute('data-delete-id');
      confirmDeleteTransaction(id);
    }
  });

  // Top header actions
  DOM.btnSampleData.addEventListener('click', loadDemoData);
  DOM.btnEmptyDemo.addEventListener('click', loadDemoData);
  DOM.btnExportCsv.addEventListener('click', exportToCSV);
  DOM.btnClearAll.addEventListener('click', confirmClearAll);

  // Tab View Switching
  DOM.tabMonthly.addEventListener('click', () => {
    DOM.tabMonthly.classList.add('active');
    DOM.tabMonthly.setAttribute('aria-selected', 'true');
    DOM.tabCategory.classList.remove('active');
    DOM.tabCategory.setAttribute('aria-selected', 'false');

    DOM.viewMonthlyChart.classList.remove('hidden');
    DOM.viewCategoryChart.classList.add('hidden');
    state.activeChartTab = 'monthly';
  });

  DOM.tabCategory.addEventListener('click', () => {
    DOM.tabCategory.classList.add('active');
    DOM.tabCategory.setAttribute('aria-selected', 'true');
    DOM.tabMonthly.classList.remove('active');
    DOM.tabMonthly.setAttribute('aria-selected', 'false');

    DOM.viewCategoryChart.classList.remove('hidden');
    DOM.viewMonthlyChart.classList.add('hidden');
    state.activeChartTab = 'category';
  });

  // Modal Cancel and Backdrop click
  DOM.modalBtnCancel.addEventListener('click', closeConfirmModal);
  DOM.confirmModal.addEventListener('click', (e) => {
    if (e.target === DOM.confirmModal) {
      closeConfirmModal();
    }
  });

  // Keyboard shortcut (Escape to close modal)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !DOM.confirmModal.classList.contains('hidden')) {
      closeConfirmModal();
    }
  });
}

// -----------------------------------------------------------------------------
// 16. App Initialization
// -----------------------------------------------------------------------------
function initApp() {
  // Set default date to today's ISO date string
  const today = new Date().toISOString().split('T')[0];
  if (DOM.dateInput) DOM.dateInput.value = today;

  loadPersistedData();
  initEventListeners();
  updateApp();
}

// Boot up once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
