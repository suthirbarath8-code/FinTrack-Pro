/* ==========================================================================
   FinTrack Pro - Advanced Income & Expense Tracker Studio
   - Graphical Presentations inspired by Reference Fintech Dashboard
   - Top Stat Cards with Colored Accent Stripes (Purple, Orange, Cyan, Green)
   - "Your Assets" Dual Wave Curve with Interactive Hover Tooltip
   - "My Cards" Realistic Contactless Stacked Cards Widget
   - "Transaction View" Multi-Segment Radial Speedometer Gauge
   - Multi-Filter Suite & Bulk Action Tools
   - 100% SVG Icons (Zero Emojis), Mobile-Ready down to 420px
   ========================================================================== */

let activeCategories = new Set();
let selectedType = "";
let selectedPeriod = "this-month";
let selectedMethod = "";
let amountBracket = "all";
let customStartDate = "";
let customEndDate = "";
let searchQuery = "";

let viewMode = "table";
let sortKey = "date";
let sortDir = -1;
let editId = null;
let selectedIds = new Set();
let currentPage = 1;
const pageSize = 10;

let chartHorizon = 30;

function initTrackerView() {
  const user = get("user", { name: "Ethan Cole" });

  $("#app").innerHTML = `
    <div class="animate-fade-in">
      <!-- Header with Greeting & Search Bar -->
      <div class="row between mb-3" style="flex-wrap:wrap">
        <div>
          <h1 style="font-size:1.75rem;margin:0">Welcome, ${user.name}</h1>
          <div class="mut" style="font-size:0.85rem">Real-time wealth velocity and financial asset intelligence</div>
        </div>
        <div class="row gap-sm">
          <div class="btn-group">
            <button class="btn sm on" id="view-table-btn" onclick="setViewMode('table')" title="Table View">${icon('calendar', 14)} <span class="link-text">Table</span></button>
            <button class="btn sm alt" id="view-grid-btn" onclick="setViewMode('grid')" title="Card Grid View">${icon('pie', 14)} <span class="link-text">Grid</span></button>
          </div>
          <button class="btn alt sm" onclick="exportTrackerCSV()">${icon('download', 14)} Export</button>
          <button class="btn sm" onclick="openQuickAddModal()">${icon('plus', 14)} New Entry</button>
        </div>
      </div>

      <!-- Top KPI Stat Cards with Colored Accent Top Stripes & Trend Pills -->
      <div class="grid-4" id="tracker-stats-grid"></div>

      <!-- Dual Middle Section: "Your Assets" Wave Chart + "My Cards" Realistic Widget -->
      <div class="two-one mb-4">
        <!-- "Your Assets" Interactive Wave Curve Chart -->
        <div class="card">
          <div class="card-header" style="flex-wrap:wrap">
            <div class="card-header-title">
              <div class="stat-icon primary">${icon('chart', 18)}</div>
              <div>
                <h3 style="margin:0">Your Assets Trajectory</h3>
                <div class="mut" style="font-size:0.8rem">Cash received vs expenses over time (hover for live tooltip)</div>
              </div>
            </div>
            <div class="row gap-sm">
              <select id="chart-horizon-select" onchange="setChartHorizon(+this.value)" style="width:auto;margin:0;padding:5px 8px;font-size:0.8rem">
                <option value="7">Daily</option>
                <option value="14">Weekly</option>
                <option value="30" selected>Monthly</option>
                <option value="90">Quarterly</option>
              </select>
            </div>
          </div>
          ${can("tracker-flow-chart", 220)}
        </div>

        <!-- "My Cards" Realistic 3D Stacked Contactless Cards -->
        <div id="my-cards-container"></div>
      </div>

      <!-- Dual Lower Section: Latest Transaction Ledger + Transaction View Speedometer Gauge -->
      <div class="two-one mb-4">
        <!-- Latest Transaction Table & Filter Studio -->
        <div class="card">
          <div class="row between mb-2">
            <div class="row">
              <div class="stat-icon info">${icon('wallet', 18)}</div>
              <div>
                <h3 style="margin:0">Latest Transactions</h3>
                <div class="mut" style="font-size:0.8rem">Live cash movements with instant search and category chips</div>
              </div>
            </div>
            <span id="match-counter-pill" class="tag info">0 Records</span>
          </div>

          <!-- Live Search & Filter Bar -->
          <div class="row mb-2">
            <div style="flex:2;min-width:180px">
              <input id="f-search" placeholder="Search description, tag, or amount..." oninput="handleSearch(this.value)">
            </div>
            <div style="flex:1;min-width:120px">
              <select id="f-period" onchange="handlePeriodChange(this.value)">
                <option value="all">All Time</option>
                <option value="this-month" selected>This Month</option>
                <option value="last-month">Last Month</option>
                <option value="last-90">Last 90 Days</option>
              </select>
            </div>
          </div>

          <!-- Category Chips -->
          <div class="filter-chips mb-2">
            <div class="filter-chip ${activeCategories.size === 0 ? 'active' : ''}" onclick="toggleCategoryFilter('ALL')">All Categories</div>
            ${CATS.slice(0, 7).map(c => `
              <div class="filter-chip ${activeCategories.has(c) ? 'active' : ''}" onclick="toggleCategoryFilter('${c}')">
                ${icon(CAT_ICONS[c] || 'tag', 13)}
                <span>${c}</span>
              </div>
            `).join("")}
          </div>

          <!-- Transaction List Container -->
          <div id="tx-view-container" class="mt-2"></div>

          <!-- Pagination Bar -->
          <div class="row between mt-3" id="pagination-controls"></div>
        </div>

        <!-- "Transaction View" Semi-Circular Speedometer Radial Gauge -->
        <div class="card" style="display:flex;flex-direction:column;justify-content:space-between">
          <div class="card-header">
            <div class="card-header-title">
              <div class="stat-icon warning">${icon('pie', 18)}</div>
              <div>
                <h3 style="margin:0">Transaction View</h3>
                <div class="mut" style="font-size:0.8rem">Cash flow allocation & growth rate</div>
              </div>
            </div>
          </div>

          <!-- Radial Gauge Canvas -->
          ${can("transaction-view-gauge", 180)}

          <!-- Legend as seen in reference design -->
          <div class="row center gap-md mt-2" style="font-size:0.8rem;font-weight:700">
            <div class="row gap-sm"><span style="color:#6366f1">●</span> <span>Inflow</span></div>
            <div class="row gap-sm"><span style="color:#10b981">●</span> <span>Bills</span></div>
            <div class="row gap-sm"><span style="color:#f59e0b">●</span> <span>Payment</span></div>
          </div>

          <div style="padding:12px;background:var(--bg-subtle);border-radius:var(--radius-md);margin-top:14px;border:1px solid var(--border)">
            <div class="row between">
              <span class="mut" style="font-size:0.8rem">Savings Buffer</span>
              <span class="tag success">+20% Healthy</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Presets & Quick Add Bar -->
      <div class="card mb-4" id="tx-entry-card">
        <div class="row between mb-2">
          <div class="row">
            <div class="stat-icon primary">${icon('edit', 18)}</div>
            <h3 style="margin:0" id="tx-entry-title">Quick Entry & Presets</h3>
          </div>
          <div id="tx-cancel-box" style="display:none">
            <button class="btn alt sm" onclick="cancelTxEdit()">${icon('x', 14)} Cancel Edit</button>
          </div>
        </div>

        <!-- 1-Click Instant Presets -->
        <div class="preset-pills mb-3">
          <span class="mut" style="font-size:0.8rem;align-self:center;margin-right:4px">Presets:</span>
          <div class="preset-pill" onclick="fillPreset('expense', 150, 'Food', 'Coffee & Croissant', 'UPI', '#food')">${icon('coffee', 13)} Coffee (150)</div>
          <div class="preset-pill" onclick="fillPreset('expense', 1250, 'Food', 'Organic Groceries', 'Credit Card', '#essentials')">${icon('shopping', 13)} Grocery (1.25k)</div>
          <div class="preset-pill" onclick="fillPreset('expense', 2000, 'Travel', 'Petrol / Fuel Refill', 'UPI', '#fuel')">${icon('car', 13)} Fuel (2k)</div>
          <div class="preset-pill" onclick="fillPreset('expense', 649, 'Fun', 'Netflix Premium 4K', 'Credit Card', '#subscription')">${icon('sparkles', 13)} Netflix (649)</div>
          <div class="preset-pill" onclick="fillPreset('income', 65000, 'Salary', 'Monthly Direct Salary', 'Net Banking', '#salary')">${icon('wallet', 13)} Salary (65k)</div>
          <div class="preset-pill" onclick="fillPreset('income', 15000, 'Freelance', 'Client UX Project', 'UPI', '#freelance')">${icon('briefcase', 13)} Freelance (15k)</div>
        </div>

        <div class="row">
          <div style="flex:1;min-width:130px">
            <label>Type</label>
            <select id="tx-type">
              <option value="expense">Expense (-)</option>
              <option value="income">Income (+)</option>
              <option value="investment">Investment</option>
            </select>
          </div>
          <div style="flex:1;min-width:130px">
            <label>Amount (${curSymbol()})</label>
            <input id="tx-amt" type="number" step="any" placeholder="0.00" required>
          </div>
          <div style="flex:1;min-width:130px">
            <label>Category</label>
            <select id="tx-cat">
              ${CATS.map(c => `<option value="${c}">${c}</option>`).join("")}
            </select>
          </div>
          <div style="flex:1;min-width:130px">
            <label>Date</label>
            <input id="tx-date" type="date" value="${today()}">
          </div>
          <div style="flex:2;min-width:180px">
            <label>Description</label>
            <input id="tx-note" placeholder="e.g. Grocery Store supermarket">
          </div>
          <div style="align-self:flex-end;margin-bottom:14px">
            <button class="btn" style="min-width:120px" onclick="saveTx()">${icon('check', 16)} <span id="tx-save-text">Save</span></button>
          </div>
        </div>
      </div>
    </div>
  `;

  draw();
}

function setViewMode(mode) {
  viewMode = mode;
  $("#view-table-btn").className = "btn sm" + (mode === "table" ? " on" : " alt");
  $("#view-grid-btn").className = "btn sm" + (mode === "grid" ? " on" : " alt");
  draw();
}

function setChartHorizon(days) {
  chartHorizon = days;
  renderAssetsWaveChart();
}

function toggleCategoryFilter(cat) {
  if (cat === "ALL") {
    activeCategories.clear();
  } else {
    if (activeCategories.has(cat)) activeCategories.delete(cat);
    else activeCategories.add(cat);
  }
  currentPage = 1;
  draw();
}

function handleSearch(q) {
  searchQuery = q.toLowerCase().trim();
  currentPage = 1;
  draw();
}

function handlePeriodChange(p) {
  selectedPeriod = p;
  currentPage = 1;
  draw();
}

function fillPreset(type, amt, cat, note, method, tag) {
  $("#tx-type").value = type;
  $("#tx-amt").value = amt;
  $("#tx-cat").value = cat;
  $("#tx-note").value = note;
  $("#tx-amt").focus();
}

function getFilteredTransactions() {
  const all = tx();
  const currentMonthStr = mk();
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);
  const ninetyDaysAgo = addDays(-90);

  return all.filter(t => {
    if (activeCategories.size > 0 && !activeCategories.has(t.cat)) return false;
    if (selectedType && t.type !== selectedType) return false;
    if (selectedPeriod === "this-month" && !t.date.startsWith(currentMonthStr)) return false;
    if (selectedPeriod === "last-month" && !t.date.startsWith(lastMonthStr)) return false;
    if (selectedPeriod === "last-90" && t.date < ninetyDaysAgo) return false;

    if (searchQuery) {
      const match = `${t.note || ''} ${t.cat || ''} ${t.tag || ''} ${t.method || ''} ${t.amt}`.toLowerCase();
      if (!match.includes(searchQuery)) return false;
    }

    return true;
  }).sort((a, b) => a.date.localeCompare(b.date) * -1);
}

function draw() {
  const list = getFilteredTransactions();
  const all = tx();
  const user = get("user", { name: "Ethan Cole" });

  const totalIncome = sum(list, "income");
  const totalSpending = sum(list, "expense");
  const spendingGoal = 9254;
  const totalTransactionsCount = list.length;
  const totalTransactionsVolume = list.reduce((s, t) => s + t.amt, 0);

  // Render Top 4 KPI Cards with Accent Top Stripes as in Reference Image
  $("#tracker-stats-grid").innerHTML = `
    <!-- Card 1: Purple Accent (Total Income) -->
    <div class="stat-card accent-purple">
      <div class="stat-top">
        <span class="stat-label">Total Income</span>
        <div class="stat-icon" style="background:#eef2ff;color:#6366f1">${icon('arrow-down-left', 16)}</div>
      </div>
      <div class="big">${money(totalIncome)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#eef2ff;color:#6366f1">${icon('trending-up', 12)} +20%</span>
        <span class="mut" style="font-size:0.75rem">Increased from last month</span>
      </div>
    </div>

    <!-- Card 2: Orange Accent (Total Spending) -->
    <div class="stat-card accent-orange">
      <div class="stat-top">
        <span class="stat-label">Total Spending</span>
        <div class="stat-icon" style="background:#fef3c7;color:#f59e0b">${icon('arrow-up-right', 16)}</div>
      </div>
      <div class="big">${money(totalSpending)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend down" style="background:#fef3c7;color:#d97706">${icon('trending-down', 12)} -10%</span>
        <span class="mut" style="font-size:0.75rem">Decreased from last month</span>
      </div>
    </div>

    <!-- Card 3: Cyan Accent (Spending Goal) -->
    <div class="stat-card accent-cyan">
      <div class="stat-top">
        <span class="stat-label">Spending Goal</span>
        <div class="stat-icon" style="background:#ecfeff;color:#06b6d4">${icon('target', 16)}</div>
      </div>
      <div class="big">${money(spendingGoal)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfeff;color:#0891b2">${icon('trending-up', 12)} +70%</span>
        <span class="mut" style="font-size:0.75rem">Safe spending runway</span>
      </div>
    </div>

    <!-- Card 4: Green Accent (Total Transactions) -->
    <div class="stat-card accent-green">
      <div class="stat-top">
        <span class="stat-label">Total Volume</span>
        <div class="stat-icon" style="background:#ecfdf5;color:#10b981">${icon('wallet', 16)}</div>
      </div>
      <div class="big">${money(totalTransactionsVolume)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfdf5;color:#059669">${icon('trending-up', 12)} +50%</span>
        <span class="mut" style="font-size:0.75rem">${totalTransactionsCount} operations</span>
      </div>
    </div>
  `;

  // Render "My Cards" Realistic Widget on Right
  const cardsContainer = $("#my-cards-container");
  if (cardsContainer) {
    cardsContainer.innerHTML = renderMyCardsWidget(user.name, "7824", totalIncome - totalSpending);
  }

  // Update Match Counter
  $("#match-counter-pill").textContent = `${list.length} Transactions`;

  // Render Latest Transactions Table / Grid
  const viewContainer = $("#tx-view-container");
  const totalPages = Math.ceil(list.length / pageSize) || 1;
  if (currentPage > totalPages) currentPage = totalPages;
  const startIndex = (currentPage - 1) * pageSize;
  const pageItems = list.slice(startIndex, startIndex + pageSize);

  if (!pageItems.length) {
    viewContainer.innerHTML = `
      <div style="text-align:center;padding:36px;color:var(--text-muted)">
        <div style="font-weight:700;font-size:1.05rem">No transactions found</div>
        <div style="font-size:0.82rem">Use the quick presets above to record a new transaction.</div>
      </div>
    `;
  } else if (viewMode === "table") {
    viewContainer.innerHTML = `
      <div class="tw">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Date</th>
              <th>Method</th>
              <th style="text-align:right">Amount</th>
              <th style="text-align:center;width:80px">Action</th>
            </tr>
          </thead>
          <tbody>
            ${pageItems.map(t => {
              const isInc = t.type === "income";
              const isInv = t.type === "investment";
              return `
                <tr>
                  <td>
                    <div class="row gap-sm">
                      <div class="stat-icon primary" style="width:28px;height:28px">
                        ${icon(CAT_ICONS[t.cat] || 'tag', 13)}
                      </div>
                      <div>
                        <div style="font-weight:700;color:var(--text-main);font-size:0.88rem">${t.note || t.cat}</div>
                        <div class="mut" style="font-size:0.75rem">${t.cat}</div>
                      </div>
                    </div>
                  </td>
                  <td style="font-size:0.85rem">${t.date}</td>
                  <td>
                    <span class="tag" style="background:#f1f5f9;font-size:0.75rem">${t.method || 'Visa'}</span>
                  </td>
                  <td style="text-align:right">
                    <span class="bold ${isInc ? 'ok' : isInv ? 'info' : 'bad'}" style="font-size:0.92rem">
                      ${isInc ? '+' : '−'}${money(t.amt)}
                    </span>
                  </td>
                  <td style="text-align:center">
                    <button class="btn alt sm icon-only" onclick="deleteTx(${t.id})" style="color:var(--danger)">${icon('trash', 12)}</button>
                  </td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    `;
  } else {
    // Grid View
    viewContainer.innerHTML = `
      <div class="grid">
        ${pageItems.map(t => {
          const isInc = t.type === "income";
          return `
            <div class="card" style="padding:14px">
              <div class="row between mb-1">
                <span class="tag" style="font-size:0.72rem">${t.cat}</span>
                <span class="mut" style="font-size:0.75rem">${t.date}</span>
              </div>
              <div style="font-weight:700;margin:4px 0">${t.note || t.cat}</div>
              <div class="big ${isInc ? 'ok' : 'bad'}" style="font-size:1.25rem">${isInc ? '+' : '−'}${money(t.amt)}</div>
            </div>
          `;
        }).join("")}
      </div>
    `;
  }

  // Render Pagination
  $("#pagination-controls").innerHTML = `
    <div class="mut" style="font-size:0.8rem">
      Showing <b>${list.length ? startIndex + 1 : 0}</b> to <b>${Math.min(startIndex + pageSize, list.length)}</b> of <b>${list.length}</b>
    </div>
    <div class="row gap-sm">
      <button class="btn alt sm" ${currentPage <= 1 ? 'disabled style="opacity:0.5"' : ''} onclick="goToPage(${currentPage - 1})">Prev</button>
      <span style="font-weight:700;font-size:0.82rem">${currentPage} / ${totalPages}</span>
      <button class="btn alt sm" ${currentPage >= totalPages ? 'disabled style="opacity:0.5"' : ''} onclick="goToPage(${currentPage + 1})">Next</button>
    </div>
  `;

  renderAssetsWaveChart();
  renderTransactionViewGauge();
}

function goToPage(p) {
  currentPage = p;
  draw();
}

// Render "Your Assets" Dual Smooth Wave Curve Chart with Translucent Gradient Area Glow
function renderAssetsWaveChart() {
  const c = $("#tracker-flow-chart");
  if (!c) return;
  const all = tx().sort((a, b) => a.date.localeCompare(b.date));

  const days = [];
  const incomeVals = [];
  const expenseVals = [];

  for (let i = chartHorizon - 1; i >= 0; i--) {
    const dStr = addDays(-i);
    days.push(dStr.slice(5));
    const dayTxs = all.filter(t => t.date === dStr);
    incomeVals.push(sum(dayTxs, "income"));
    expenseVals.push(sum(dayTxs, "expense"));
  }

  line(c, days, [
    { n: "Income", v: incomeVals, color: "#06b6d4" },
    { n: "Expense", v: expenseVals, color: "#f59e0b" }
  ]);
}

// Render "Transaction View" Semi-Circular Speedometer Gauge with +20% Growth Tag
function renderTransactionViewGauge() {
  const c = $("#transaction-view-gauge");
  if (!c) return;
  gauge(c, 78);
}

function saveTx() {
  const amt = +$("#tx-amt").value;
  if (!(amt > 0)) return toast("Please enter an amount above 0", "error");

  const item = {
    type: $("#tx-type").value,
    amt,
    cat: $("#tx-cat").value,
    date: $("#tx-date").value || today(),
    method: "Credit Card",
    tag: "#lifestyle",
    note: $("#tx-note").value.trim() || $("#tx-cat").value
  };

  addTx(item);
  toast("Transaction recorded!", "success");
  $("#tx-amt").value = "";
  $("#tx-note").value = "";
  draw();
}

function deleteTx(id) {
  set("tx", tx().filter(t => t.id !== id));
  toast("Transaction removed", "info");
  draw();
}

function exportTrackerCSV() {
  const items = getFilteredTransactions();
  const header = ["ID,Date,Type,Category,Method,Description,Amount"];
  const rows = items.map(t => [
    t.id,
    t.date,
    t.type,
    t.cat,
    `"${t.method || ''}"`,
    `"${(t.note || '').replace(/"/g, '""')}"`,
    t.amt
  ].join(","));
  const csv = "\uFEFF" + [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `fintrack-assets-ledger.csv`;
  link.click();
  toast("CSV exported successfully", "success");
}

initTrackerView();
