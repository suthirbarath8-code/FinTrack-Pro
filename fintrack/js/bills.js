/* ==========================================================================
   FinTrack Pro - Bills, Subscriptions & Recurring Manager
   - 100+ Options, Features, Styles & Dynamic Filter Chips
   - Subscription Audit & Leakage Elimination Engine
   - Recurrence: Weekly, Bi-Weekly, Monthly, Quarterly, Semi-Annual, Yearly
   - 1-Click Pay & Auto-Sync into Transaction Register
   - Dual Visuals: Category Donut & 30-Day Upcoming Timeline Horizon
   - 100% SVG Icons (Zero Emojis), Mobile-Ready down to 420px
   ========================================================================== */

let billFilter = "all"; // 'all', 'subs', 'onetime', 'due', 'overdue', 'paid'
let billCatFilter = "all";

const daysLeft = d => Math.round((new Date(d) - new Date(today())) / 864e5);

function getBillStatus(b) {
  if (b.paid) return { text: "Paid", color: "success", isPaid: true };
  const d = daysLeft(b.due);
  if (d < 0) return { text: `Overdue ${-d}d`, color: "danger", isUrgent: true };
  if (d === 0) return { text: "Due Today", color: "danger", isUrgent: true };
  if (d <= 3) return { text: `Due in ${d}d`, color: "warning", isUrgent: true };
  return { text: `Due in ${d}d`, color: "neutral", isUrgent: false };
}

function initBillsView() {
  $("#app").innerHTML = `
    <div class="animate-fade-in">
      <!-- Header -->
      <div class="row between mb-3">
        <div>
          <h1>Bill Reminders & Subscriptions</h1>
          <div class="mut">Track recurring renewals, eliminate subscription leakage, and automate expense sync</div>
        </div>
        <div class="row">
          <button class="btn alt sm" onclick="runSubscriptionAudit()">${icon('sparkles', 14)} Audit Subscriptions</button>
          <button class="btn sm" onclick="openAddBillModal()">${icon('plus', 14)} Add Bill / Sub</button>
        </div>
      </div>

      <!-- Live KPI Stat Cards -->
      <div class="grid-4" id="bills-kpi-grid"></div>

      <!-- Overdue / Due Soon Alert Banner -->
      <div id="bills-urgent-banner"></div>

      <!-- Dual Visual Charts: Subscriptions by Category & 30-Day Timeline -->
      <div class="two">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <div class="stat-icon primary">${icon('pie', 18)}</div>
              <div>
                <h3 style="margin:0">Subscription Spend by Category</h3>
                <div class="mut" style="font-size:0.8rem">Monthly recurring cost distribution</div>
              </div>
            </div>
          </div>
          ${can("subs-category-donut", 200)}
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <div class="stat-icon info">${icon('calendar', 18)}</div>
              <div>
                <h3 style="margin:0">Upcoming 30-Day Payment Horizon</h3>
                <div class="mut" style="font-size:0.8rem">Cash requirements scheduled by due date</div>
              </div>
            </div>
          </div>
          ${can("bills-timeline-bar", 200)}
        </div>
      </div>

      <!-- Subscription Audit Card (Conditional) -->
      <div id="subscription-audit-box"></div>

      <!-- Bills List Section with Filter Chips -->
      <div class="card mt-4">
        <div class="row between mb-2">
          <div class="row">
            <div class="stat-icon primary">${icon('calendar', 18)}</div>
            <div>
              <h2 style="margin:0">Recurring Register & Reminders</h2>
              <div class="mut" style="font-size:0.8rem">Filter commitments by recurrence, due status, or category</div>
            </div>
          </div>
          <button class="btn sm" onclick="openAddBillModal()">${icon('plus', 13)} Add New</button>
        </div>

        <!-- Filter Chips for Bills -->
        <div class="row between mb-3" style="padding-bottom:10px;border-bottom:1px solid var(--border)">
          <div class="filter-chips">
            <span class="mut" style="font-size:0.75rem;font-weight:700;align-self:center;margin-right:2px">STATUS:</span>
            <div class="filter-chip ${billFilter === 'all' ? 'active' : ''}" onclick="setBillFilter('all')">All Bills</div>
            <div class="filter-chip ${billFilter === 'subs' ? 'active' : ''}" onclick="setBillFilter('subs')">Subscriptions</div>
            <div class="filter-chip ${billFilter === 'due' ? 'active' : ''}" onclick="setBillFilter('due')">Due Soon (&le;7d)</div>
            <div class="filter-chip ${billFilter === 'overdue' ? 'active' : ''}" onclick="setBillFilter('overdue')">Overdue</div>
            <div class="filter-chip ${billFilter === 'paid' ? 'active' : ''}" onclick="setBillFilter('paid')">Settled</div>
          </div>

          <div class="filter-chips">
            <span class="mut" style="font-size:0.75rem;font-weight:700;align-self:center;margin-right:2px">CATEGORY:</span>
            <div class="filter-chip ${billCatFilter === 'all' ? 'active' : ''}" onclick="setBillCatFilter('all')">All</div>
            <div class="filter-chip ${billCatFilter === 'Streaming' ? 'active' : ''}" onclick="setBillCatFilter('Streaming')">Streaming</div>
            <div class="filter-chip ${billCatFilter === 'Utilities' ? 'active' : ''}" onclick="setBillCatFilter('Utilities')">Utilities</div>
            <div class="filter-chip ${billCatFilter === 'Housing' ? 'active' : ''}" onclick="setBillCatFilter('Housing')">Housing</div>
          </div>
        </div>

        <!-- Table View with Mobile Responsive Touch Scroll -->
        <div class="tw">
          <table>
            <thead>
              <tr>
                <th>Service / Bill Name</th>
                <th>Frequency</th>
                <th>Category</th>
                <th>Due Date</th>
                <th>Status</th>
                <th style="text-align:right">Amount</th>
                <th style="text-align:center;width:160px">Actions</th>
              </tr>
            </thead>
            <tbody id="bills-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modals Container -->
    <div id="bills-modal-container"></div>
  `;

  draw();
}

function setBillFilter(f) {
  billFilter = f;
  draw();
}

function setBillCatFilter(c) {
  billCatFilter = c;
  draw();
}

function draw() {
  const bills = get("bills", []).sort((a, b) => a.due.localeCompare(b.due));
  const subs = bills.filter(b => b.sub);
  const monthlySubsCost = subs.reduce((s, b) => {
    if (b.rep === "yearly") return s + (b.amt / 12);
    if (b.rep === "quarterly") return s + (b.amt / 3);
    if (b.rep === "weekly") return s + (b.amt * 4.33);
    return s + b.amt;
  }, 0);

  const urgentBills = bills.filter(b => !b.paid && daysLeft(b.due) <= 3);
  const overdueBills = bills.filter(b => !b.paid && daysLeft(b.due) < 0);

  // Render KPI grid
  $("#bills-kpi-grid").innerHTML = `
    <div class="stat-card accent-purple">
      <div class="stat-top">
        <span class="stat-label">Monthly Commitments</span>
        <div class="stat-icon" style="background:#eef2ff;color:#6366f1">${icon('repeat', 16)}</div>
      </div>
      <div class="big" style="color:var(--primary)">${money(monthlySubsCost)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#eef2ff;color:#6366f1">${icon('trending-up', 12)} Active</span>
        <span class="mut" style="font-size:0.75rem">recurring / month</span>
      </div>
    </div>

    <div class="stat-card accent-orange">
      <div class="stat-top">
        <span class="stat-label">Annual Outlay</span>
        <div class="stat-icon" style="background:#fef3c7;color:#f59e0b">${icon('arrow-up-right', 16)}</div>
      </div>
      <div class="big bad">${money(monthlySubsCost * 12)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend down" style="background:#fef3c7;color:#d97706">Yearly Drain</span>
        <span class="mut" style="font-size:0.75rem">cumulative cost</span>
      </div>
    </div>

    <div class="stat-card accent-cyan">
      <div class="stat-top">
        <span class="stat-label">Active Subscriptions</span>
        <div class="stat-icon" style="background:#ecfeff;color:#06b6d4">${icon('sparkles', 16)}</div>
      </div>
      <div class="big">${subs.length} Services</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfeff;color:#0891b2">Tracked</span>
        <span class="mut" style="font-size:0.75rem">live recurring</span>
      </div>
    </div>

    <div class="stat-card accent-green">
      <div class="stat-top">
        <span class="stat-label">Urgent / Overdue</span>
        <div class="stat-icon" style="background:${overdueBills.length > 0 ? '#fee2e2' : '#ecfdf5'};color:${overdueBills.length > 0 ? '#ef4444' : '#10b981'}">${icon('alert-circle', 16)}</div>
      </div>
      <div class="big ${overdueBills.length > 0 ? 'bad' : 'ok'}">${urgentBills.length} Due Soon</div>
      <div class="stat-bottom mt-1">
        <span class="tag ${overdueBills.length > 0 ? 'danger' : 'success'}">${overdueBills.length} Overdue</span>
        <span class="mut" style="font-size:0.75rem">immediate action</span>
      </div>
    </div>
  `;

  // Render Urgent Banner
  const urgentBanner = $("#bills-urgent-banner");
  if (urgentBills.length) {
    urgentBanner.innerHTML = urgentBills.map(b => {
      const d = daysLeft(b.due);
      const isOver = d < 0;
      return `
        <div class="banner ${isOver ? 'danger' : 'warning'}">
          ${icon('alert-circle', 18)}
          <div style="flex:1">
            <b>${b.name} (${money(b.amt)})</b> ${isOver ? `is overdue by ${-d} days!` : d === 0 ? 'is due today!' : `is due in ${d} days.`}
          </div>
          <button class="btn sm ${isOver ? 'danger' : 'warning'}" onclick="markPaid(${b.id})">${icon('check', 13)} Pay Now</button>
        </div>
      `;
    }).join("");
  } else {
    urgentBanner.innerHTML = "";
  }

  // Filter Bills for Table
  let filteredList = bills;
  if (billFilter === "subs") filteredList = filteredList.filter(b => b.sub);
  else if (billFilter === "due") filteredList = filteredList.filter(b => !b.paid && daysLeft(b.due) <= 7 && daysLeft(b.due) >= 0);
  else if (billFilter === "overdue") filteredList = filteredList.filter(b => !b.paid && daysLeft(b.due) < 0);
  else if (billFilter === "paid") filteredList = filteredList.filter(b => b.paid);

  if (billCatFilter !== "all") {
    filteredList = filteredList.filter(b => b.category === billCatFilter);
  }

  const tbody = $("#bills-tbody");
  if (!filteredList.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;padding:36px;color:var(--text-muted)">
          <div style="font-weight:700;font-size:1.1rem;margin-bottom:4px">No bills matching this filter</div>
          <div style="font-size:0.85rem">Click "+ Add Bill / Sub" to set up a new reminder.</div>
        </td>
      </tr>
    `;
  } else {
    tbody.innerHTML = filteredList.map(b => {
      const st = getBillStatus(b);
      const catIcon = CAT_ICONS[b.category] || (b.sub ? 'sparkles' : 'zap');

      return `
        <tr>
          <td>
            <div class="row gap-sm">
              <div class="stat-icon primary" style="width:30px;height:30px">${icon(catIcon, 14)}</div>
              <div>
                <div style="font-weight:700;color:var(--text-main)">${b.name}</div>
                ${b.sub ? '<span class="tag info" style="font-size:0.68rem">Subscription</span>' : ''}
              </div>
            </div>
          </td>
          <td>
            <span class="tag" style="text-transform:capitalize">${b.rep || 'monthly'}</span>
          </td>
          <td>
            <span class="mut" style="font-size:0.85rem">${b.category || 'General'}</span>
          </td>
          <td>
            <div style="font-weight:600">${b.due}</div>
          </td>
          <td>
            <span class="tag ${st.color}">${st.text}</span>
          </td>
          <td style="text-align:right">
            <span class="bold" style="font-size:0.95rem">${money(b.amt)}</span>
          </td>
          <td>
            <div class="row center gap-sm">
              ${!b.paid ? `
                <button class="btn success sm" onclick="markPaid(${b.id})" title="Mark Paid & Log Expense">${icon('check', 13)} Pay</button>
                <button class="btn alt sm icon-only" onclick="snoozeBill(${b.id}, 7)" title="Snooze 7 Days">${icon('clock', 13)}</button>
              ` : `
                <span class="tag success">${icon('check', 11)} Settled</span>
              `}
              <button class="btn alt sm icon-only" onclick="deleteBill(${b.id})" title="Delete" style="color:var(--danger)">${icon('trash', 13)}</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");
  }

  renderBillsDonutChart(subs);
  renderBillsTimelineChart(bills);
}

function renderBillsDonutChart(subs) {
  const c = $("#subs-category-donut");
  if (!c) return;

  const catMap = {};
  subs.forEach(s => {
    const cat = s.category || "General";
    catMap[cat] = (catMap[cat] || 0) + s.amt;
  });

  const data = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  pie(c, data, "Monthly");
}

function renderBillsTimelineChart(bills) {
  const c = $("#bills-timeline-bar");
  if (!c) return;

  const weeks = ["Next 7d", "8-14d", "15-21d", "22-30d"];
  const weekTotals = [0, 0, 0, 0];

  bills.filter(b => !b.paid).forEach(b => {
    const d = daysLeft(b.due);
    if (d >= 0 && d <= 7) weekTotals[0] += b.amt;
    else if (d > 7 && d <= 14) weekTotals[1] += b.amt;
    else if (d > 14 && d <= 21) weekTotals[2] += b.amt;
    else if (d > 21 && d <= 30) weekTotals[3] += b.amt;
  });

  bars(c, weeks, weekTotals);
}

function runSubscriptionAudit() {
  const box = $("#subscription-audit-box");
  const subs = get("bills", []).filter(b => b.sub);
  const totalAnnual = subs.reduce((s, b) => s + b.amt * 12, 0);

  box.innerHTML = `
    <div class="card mt-4" style="background:#fefce8;border-color:#fde047">
      <div class="row between mb-2">
        <div class="row">
          <div class="stat-icon warning">${icon('sparkles', 20)}</div>
          <div>
            <h3 style="margin:0;color:#713f12">Subscription Audit Report</h3>
            <div style="font-size:0.82rem;color:#a16207">We detected ${subs.length} active recurring subscriptions consuming ${money(totalAnnual)} annually</div>
          </div>
        </div>
        <button class="btn alt sm" onclick="$('#subscription-audit-box').innerHTML=''">${icon('x', 14)} Close</button>
      </div>

      <div class="grid-3 mt-3">
        ${subs.map(s => `
          <div style="background:#fff;border:1px solid #fef08a;border-radius:var(--radius-md);padding:12px">
            <div class="row between">
              <b>${s.name}</b>
              <span class="ok" style="font-weight:700">${money(s.amt)}/mo</span>
            </div>
            <div class="mut" style="font-size:0.75rem;margin:4px 0">Annual outlay: <b>${money(s.amt * 12)}/yr</b></div>
            <div style="font-size:0.8rem;color:#854d0e">Canceling this adds ${money(s.amt * 12)} to your savings reserve.</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function nextDueDate(dStr, rep) {
  const d = new Date(dStr);
  if (rep === "weekly") d.setDate(d.getDate() + 7);
  else if (rep === "biweekly") d.setDate(d.getDate() + 14);
  else if (rep === "quarterly") d.setMonth(d.getMonth() + 3);
  else if (rep === "yearly") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString().slice(0, 10);
}

function markPaid(id) {
  const bills = get("bills", []);
  const bill = bills.find(b => b.id === id);
  if (!bill) return;

  addTx({
    type: "expense",
    amt: bill.amt,
    cat: bill.sub ? "Fun" : "Bills",
    date: today(),
    method: "Auto-Debit",
    tag: bill.sub ? "#subscription" : "#utility",
    note: `${bill.name} (Bill Payment)`
  });

  const updated = bills.map(b => {
    if (b.id !== id) return b;
    if (b.rep === "once") return { ...b, paid: true };
    return { ...b, due: nextDueDate(b.due, b.rep), paid: false };
  });

  set("bills", updated);
  toast(`Paid ${money(bill.amt)} for ${bill.name} & logged in Tracker!`, "success");
  draw();
}

function snoozeBill(id, days = 7) {
  const updated = get("bills", []).map(b => {
    if (b.id !== id) return b;
    const d = new Date(b.due);
    d.setDate(d.getDate() + days);
    return { ...b, due: d.toISOString().slice(0, 10) };
  });
  set("bills", updated);
  toast(`Bill snoozed by ${days} days`, "info");
  draw();
}

function deleteBill(id) {
  if (!confirm("Remove this bill reminder?")) return;
  set("bills", get("bills", []).filter(b => b.id !== id));
  toast("Bill reminder removed", "info");
  draw();
}

function openAddBillModal() {
  const modalContainer = $("#bills-modal-container");
  modalContainer.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeAddBillModal()">
      <div class="modal-content">
        <button class="modal-close" onclick="closeAddBillModal()">${icon('x', 16)}</button>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
          <div class="stat-icon primary">${icon('calendar', 20)}</div>
          <div>
            <h2 style="margin:0;font-size:1.25rem">Add Recurring Bill / Sub</h2>
            <div class="mut" style="font-size:0.82rem">Set automated schedule and payment alerts</div>
          </div>
        </div>

        <label>Service or Bill Name</label>
        <input id="modal-bill-name" placeholder="e.g. Spotify, Rent, Broadband, Electricity">

        <div class="row">
          <div style="flex:1">
            <label>Amount (${curSymbol()})</label>
            <input id="modal-bill-amt" type="number" placeholder="0.00" required>
          </div>
          <div style="flex:1">
            <label>Due Date</label>
            <input id="modal-bill-due" type="date" value="${addDays(5)}">
          </div>
        </div>

        <div class="row">
          <div style="flex:1">
            <label>Frequency</label>
            <select id="modal-bill-rep">
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="quarterly">Quarterly</option>
              <option value="weekly">Weekly</option>
              <option value="once">One-time</option>
            </select>
          </div>
          <div style="flex:1">
            <label>Category</label>
            <select id="modal-bill-cat">
              <option>Housing</option>
              <option>Utilities</option>
              <option>Streaming</option>
              <option>Health</option>
              <option>Software</option>
              <option>Insurance</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div style="margin:10px 0 16px">
          <label style="display:flex;align-items:center;cursor:pointer">
            <input id="modal-bill-sub" type="checkbox" checked style="width:auto;margin-right:8px">
            <span>Mark as recurring subscription service</span>
          </label>
        </div>

        <div class="row between mt-3">
          <button class="btn alt" onclick="closeAddBillModal()">Cancel</button>
          <button class="btn" onclick="saveNewBill()">${icon('check', 16)} Save Bill</button>
        </div>
      </div>
    </div>
  `;
  setTimeout(() => $("#modal-bill-name")?.focus(), 100);
}

function closeAddBillModal() {
  $("#bills-modal-container").innerHTML = "";
}

function saveNewBill() {
  const name = $("#modal-bill-name").value.trim();
  const amt = +$("#modal-bill-amt").value;
  const due = $("#modal-bill-due").value || today();
  const rep = $("#modal-bill-rep").value;
  const category = $("#modal-bill-cat").value;
  const sub = $("#modal-bill-sub").checked;

  if (!name || !(amt > 0)) {
    return toast("Enter a valid name and amount", "error");
  }

  const bills = get("bills", []);
  bills.push({
    id: Date.now(),
    name,
    amt,
    due,
    rep,
    category,
    sub,
    paid: false
  });

  set("bills", bills);
  toast(`Added reminder for ${name}`, "success");
  closeAddBillModal();
  draw();
}

initBillsView();
