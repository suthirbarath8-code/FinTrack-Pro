/* ==========================================================================
   FinTrack Pro - User Profile & Financial Health Center
   - 100% SVG Icons (Zero Emojis), Mobile-Ready down to 420px
   - Clean Logo-Free Branding & Professional Persona Customizer
   - 180° Animated Radial Speedometer Health Scorecard (4 Pillars)
   - Workspace Data Center: Full JSON Backup, Restore, Demo Reset
   ========================================================================== */

const AVATARS = [
  { id: "exec", label: "Executive", icon: "briefcase" },
  { id: "tech", label: "Tech / Pro", icon: "laptop" },
  { id: "invest", label: "Investor", icon: "trending-up" },
  { id: "shield", label: "Protector", icon: "shield" },
  { id: "global", label: "Global", icon: "compass" },
  { id: "award", label: "Achiever", icon: "award" }
];

const FINANCIAL_TIPS = [
  "Pay yourself first: Automate a transfer of at least 20% of your salary to investments on payday.",
  "Build a 6-month liquid emergency runway in high-yield instruments before taking risky stock bets.",
  "The 50/30/20 framework keeps lifestyle inflation in check: 50% Needs, 30% Wants, 20% Compounding.",
  "Review and audit recurring subscriptions quarterly—unused subscriptions bleed significant annual capital.",
  "Prepaying high-interest debts yields a guaranteed risk-free return equivalent to the interest rate.",
  "Increase your monthly SIP by 10% whenever you receive an annual increment or promotion."
];

let activeTipIndex = 0;

function initProfileView() {
  const user = get("user");
  if (!user) {
    location.href = "login.html";
    return;
  }
  renderProfileDashboard(user);
}

function computeHealthScore() {
  const l = tx();
  const income = sum(l, "income");
  const expense = sum(l, "expense");

  const savingsRate = income > 0 ? (income - expense) / income : 0;
  const savingsScore = Math.round(Math.max(0, Math.min(30, savingsRate * 75)));

  const budgets = get("budgets", {});
  const currentMonthTx = l.filter(t => t.date.startsWith(mk()));
  const currentSpent = byCat(currentMonthTx);
  const budgetKeys = Object.keys(budgets);

  let budgetScore = 18;
  if (budgetKeys.length) {
    const withinLimits = budgetKeys.filter(c => (currentSpent[c] || 0) <= budgets[c]).length;
    budgetScore = Math.round((withinLimits / budgetKeys.length) * 25);
  }

  const bills = get("bills", []);
  const overdueCount = bills.filter(b => !b.paid && b.due < today()).length;
  const billScore = Math.max(0, 25 - overdueCount * 8);

  const goals = get("goals", []);
  const totalSaved = goals.reduce((s, g) => s + g.saved, 0);
  const monthlyExpenses = expense > 0 ? expense / 3 : 25000;
  const runwayMonths = monthlyExpenses > 0 ? totalSaved / monthlyExpenses : 0;
  const runwayScore = Math.round(Math.min(20, (runwayMonths / 3) * 20));

  const totalScore = Math.min(100, savingsScore + budgetScore + billScore + runwayScore);

  return {
    total: totalScore,
    pillars: [
      { name: "Savings Rate Velocity", score: savingsScore, max: 30, desc: `${Math.round(savingsRate * 100)}% net savings rate` },
      { name: "Category Budget Ceilings", score: budgetScore, max: 25, desc: `${budgetKeys.length ? 'Spending within monthly caps' : 'Default budget posture'}` },
      { name: "Bill Payment Punctuality", score: billScore, max: 25, desc: `${overdueCount === 0 ? 'Zero overdue liabilities' : overdueCount + ' overdue bills'}` },
      { name: "Emergency Runway Buffer", score: runwayScore, max: 20, desc: `${runwayMonths.toFixed(1)} months of living costs saved` }
    ]
  };
}

function renderProfileDashboard(user) {
  const scoreData = computeHealthScore();
  const currentTip = FINANCIAL_TIPS[activeTipIndex % FINANCIAL_TIPS.length];
  const userAvatar = user.avatar || "exec";
  const avatarObj = AVATARS.find(a => a.id === userAvatar) || AVATARS[0];

  $("#app").innerHTML = `
    <div class="animate-fade-in">
      <!-- User Greeting Banner -->
      <div class="row between mb-4" style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius-xl);padding:24px;box-shadow:var(--shadow-sm);flex-wrap:wrap">
        <div class="row gap-md">
          <div style="width:58px;height:58px;border-radius:var(--radius-full);background:var(--primary-light);color:var(--primary);display:flex;align-items:center;justify-content:center;box-shadow:var(--shadow-xs);flex-shrink:0">
            ${icon(avatarObj.icon, 28)}
          </div>
          <div>
            <div class="row gap-sm">
              <h1 style="margin:0;font-size:1.55rem">Hello, ${user.name}</h1>
              <span class="tag primary">${user.role || 'Pro Member'}</span>
            </div>
            <div class="mut" style="font-size:0.85rem">${user.email} • Workspace: Active</div>
          </div>
        </div>
        <div class="row gap-sm">
          <button class="btn alt sm" onclick="logout()">${icon('log-out', 14)} Sign Out</button>
          <button class="btn sm" onclick="openSwitchAccountModal()">${icon('repeat', 14)} Switch User</button>
        </div>
      </div>

      <!-- Financial Health Scorecard & Tip of the Day -->
      <div class="two">
        <!-- Health Scorecard -->
        <div class="card">
          <div class="row between mb-2">
            <div class="row">
              <div class="stat-icon primary">${icon('shield', 18)}</div>
              <h2 style="margin:0">Financial Health Index</h2>
            </div>
            <span class="tag ${scoreData.total >= 75 ? 'success' : scoreData.total >= 50 ? 'warning' : 'danger'}">
              ${scoreData.total >= 75 ? 'Prime Health' : scoreData.total >= 50 ? 'Moderate' : 'Needs Optimization'}
            </span>
          </div>

          ${can("health-gauge-canvas", 175)}

          <div style="display:flex;flex-direction:column;gap:10px;margin-top:14px">
            ${scoreData.pillars.map(p => `
              <div>
                <div class="row between" style="font-size:0.85rem;margin-bottom:3px">
                  <b>${p.name}</b>
                  <span class="mut"><b>${p.score}</b> / ${p.max} pts</span>
                </div>
                <div class="meter primary">
                  <i style="width:${Math.round((p.score / p.max) * 100)}%"></i>
                </div>
                <div class="mut" style="font-size:0.75rem">${p.desc}</div>
              </div>
            `).join("")}
          </div>
        </div>

        <!-- Tip of the Day & Quick Profile Settings -->
        <div class="card">
          <div class="row mb-2">
            <div class="stat-icon warning">${icon('sparkles', 18)}</div>
            <h2 style="margin:0">Wealth Advisor Intelligence</h2>
          </div>

          <div style="padding:16px;background:var(--bg-subtle);border:1px solid var(--border);border-radius:var(--radius-md);margin-bottom:20px">
            <div class="mut" style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em;font-weight:700">Financial Insight of the Day</div>
            <p id="tip-text" style="font-size:0.92rem;font-weight:600;margin:8px 0 12px;color:var(--text-main);line-height:1.5">
              ${currentTip}
            </p>
            <button class="btn alt sm" onclick="nextTip()">${icon('refresh', 13)} Next Tip</button>
          </div>

          <h2 style="margin-top:16px">${icon('settings', 18)} Account Preferences</h2>

          <div class="row">
            <div style="flex:1">
              <label>Display Currency</label>
              <select onchange="changeCurrency(this.value)">
                ${Object.keys(CURRENCIES).map(c => `
                  <option value="${c}" ${c === getCur() ? 'selected' : ''}>${c} (${CURRENCIES[c].symbol})</option>
                `).join("")}
              </select>
            </div>
            <div style="flex:1">
              <label>Avatar Persona</label>
              <select onchange="changeAvatar(this.value)">
                ${AVATARS.map(a => `
                  <option value="${a.id}" ${a.id === userAvatar ? 'selected' : ''}>${a.label}</option>
                `).join("")}
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Workspace Data Management Center -->
      <div class="card mt-4">
        <div class="row between mb-2">
          <div class="row">
            <div class="stat-icon primary">${icon('download', 18)}</div>
            <div>
              <h2 style="margin:0">Workspace Data & Backup Center</h2>
              <div class="mut" style="font-size:0.82rem">Safeguard your records, import backups, or reset demo workspaces</div>
            </div>
          </div>
        </div>

        <div class="grid-3 mt-3">
          <div style="padding:16px;background:var(--bg-subtle);border:1px solid var(--border);border-radius:var(--radius-md)">
            <div class="row gap-sm mb-1">
              ${icon('download', 16)}
              <b>Export Complete Backup</b>
            </div>
            <div class="mut mb-3" style="font-size:0.8rem">Download full JSON backup of all transactions, budgets, goals, and bills.</div>
            <button class="btn sm" onclick="exportFullWorkspaceJSON()">${icon('download', 13)} Download JSON</button>
          </div>

          <div style="padding:16px;background:var(--bg-subtle);border:1px solid var(--border);border-radius:var(--radius-md)">
            <div class="row gap-sm mb-1">
              ${icon('upload', 16)}
              <b>Restore from Backup</b>
            </div>
            <div class="mut mb-3" style="font-size:0.8rem">Restore your workspace data from a previously downloaded JSON file.</div>
            <label class="btn alt sm" style="margin:0;display:inline-flex;cursor:pointer">
              ${icon('upload', 13)} Select JSON File
              <input type="file" accept=".json" onchange="importWorkspaceJSON(event)" style="display:none">
            </label>
          </div>

          <div style="padding:16px;background:var(--bg-subtle);border:1px solid var(--border);border-radius:var(--radius-md)">
            <div class="row gap-sm mb-1">
              ${icon('refresh', 16)}
              <b>Reset Demo Dataset</b>
            </div>
            <div class="mut mb-3" style="font-size:0.8rem">Populate workspace with fresh realistic transactions, goals, and budgets.</div>
            <button class="btn alt sm" onclick="resetToSampleData()" style="color:var(--danger)">${icon('refresh', 13)} Reset Workspace</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals Container -->
    <div id="profile-modal-container"></div>
  `;

  const canvas = $("#health-gauge-canvas");
  if (canvas) {
    gauge(canvas, scoreData.total);
  }
}

function nextTip() {
  activeTipIndex++;
  const tipEl = $("#tip-text");
  if (tipEl) {
    tipEl.textContent = FINANCIAL_TIPS[activeTipIndex % FINANCIAL_TIPS.length];
  }
}

function changeAvatar(avatarId) {
  const user = get("user");
  if (!user) return;
  user.avatar = avatarId;
  set("user", user);
  toast("Profile avatar updated!", "success");
  setTimeout(() => location.reload(), 250);
}

function logout() {
  localStorage.removeItem("fintrack_user");
  toast("Signed out successfully", "info");
  setTimeout(() => location.href = "login.html", 300);
}

function openSwitchAccountModal() {
  const users = get("users", []);
  const modalContainer = $("#profile-modal-container");
  modalContainer.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeProfileModal()">
      <div class="modal-content">
        <button class="modal-close" onclick="closeProfileModal()">${icon('x', 16)}</button>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
          <div class="stat-icon primary">${icon('user', 20)}</div>
          <div>
            <h2 style="margin:0;font-size:1.25rem">Switch Workspace User</h2>
            <div class="mut" style="font-size:0.82rem">Select an existing account or register a new one</div>
          </div>
        </div>

        <div style="display:flex;flex-direction:column;gap:10px;margin-bottom:18px">
          ${users.map(u => `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:12px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--bg-subtle)">
              <div class="row gap-sm">
                <div class="stat-icon primary" style="width:32px;height:32px">${icon('user', 14)}</div>
                <div>
                  <div style="font-weight:700">${u.name}</div>
                  <div class="mut" style="font-size:0.75rem">${u.email}</div>
                </div>
              </div>
              <button class="btn alt sm" onclick="selectUserAccount('${u.email}')">Select</button>
            </div>
          `).join("")}
        </div>

        <div class="row between">
          <a href="signup.html" class="btn alt sm">${icon('plus', 14)} Register New</a>
          <a href="login.html" class="btn sm">${icon('log-in', 14)} Sign In Page</a>
        </div>
      </div>
    </div>
  `;
}

function closeProfileModal() {
  $("#profile-modal-container").innerHTML = "";
}

function selectUserAccount(email) {
  const users = get("users", []);
  const u = users.find(x => x.email === email);
  if (u) {
    set("user", u);
    if (u.currency) set("currency", u.currency);
    toast(`Switched to account: ${u.name}`, "success");
    setTimeout(() => location.reload(), 300);
  }
}

function exportFullWorkspaceJSON() {
  const fullBackup = {
    app: "FinTrack Pro",
    version: "2.0",
    exportDate: new Date().toISOString(),
    user: get("user"),
    currency: getCur(),
    transactions: tx(),
    goals: get("goals", []),
    budgets: get("budgets", {}),
    bills: get("bills", [])
  };

  const jsonStr = JSON.stringify(fullBackup, null, 2);
  const blob = new Blob([jsonStr], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `fintrack-workspace-backup-${today()}.json`;
  link.click();
  toast("Full workspace JSON backup downloaded!", "success");
}

function importWorkspaceJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.transactions && Array.isArray(data.transactions)) {
        set("tx", data.transactions);
      }
      if (data.goals) set("goals", data.goals);
      if (data.budgets) set("budgets", data.budgets);
      if (data.bills) set("bills", data.bills);
      if (data.currency) set("currency", data.currency);
      toast("Workspace successfully restored from backup!", "success");
      setTimeout(() => location.reload(), 500);
    } catch (err) {
      toast("Invalid backup JSON file", "error");
    }
  };
  reader.readAsText(file);
}

function resetToSampleData() {
  if (!confirm("Reset all transactions, goals, budgets, and bills to sample demo state?")) return;
  localStorage.removeItem("fintrack_seeded_v4");
  ["tx", "goals", "budgets", "bills"].forEach(k => localStorage.removeItem("fintrack_" + k));
  seed();
  toast("Workspace reset to rich demo dataset!", "success");
  setTimeout(() => location.reload(), 400);
}

initProfileView();
