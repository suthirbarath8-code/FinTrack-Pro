/* ==========================================================================
   FinTrack Pro - Savings Goals & Smart Budget Studio
   - 100% SVG Icons (Zero Emojis), Mobile-Ready down to 420px
   - Goal Filter Chips: Status, Category, Priority
   - Visual Circular Progress Rings & Milestone Checkpoints
   - 50/30/20 Rule Budget Optimizer & Custom Splits (60/20/20, 70/20/10)
   - Rollover Budgeting & Category Ceiling Management
   - Dual High-DPI Charts: Fund Donut & Budget vs Actual Spend
   ========================================================================== */

let goalStatusFilter = "all"; // 'all', 'active', 'completed'
let goalCatFilter = "all";
let goalPriorityFilter = "all"; // 'all', 'high', 'medium', 'low'
let budgetViewFilter = "all"; // 'all', 'safe', 'warning', 'exceeded'

function initGoalsView() {
  $("#app").innerHTML = `
    <div class="animate-fade-in">
      <!-- Header -->
      <div class="row between mb-3">
        <div>
          <h1>Savings Goals & Smart Budgets</h1>
          <div class="mut">Milestone capital allocation, priority ranking, and automated budget optimization</div>
        </div>
        <div class="row">
          <button class="btn alt sm" onclick="openBudget503020Modal()">${icon('sparkles', 14)} 50/30/20 Optimizer</button>
          <button class="btn sm" onclick="openNewGoalModal()">${icon('plus', 14)} New Goal</button>
        </div>
      </div>

      <!-- Live KPI Grid -->
      <div class="grid-4" id="goals-kpi-grid"></div>

      <!-- Over-budget Warnings Banner -->
      <div id="budget-alerts-container"></div>

      <!-- Dual Visual Charts: Goals Donut & Budget vs Spend -->
      <div class="two">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <div class="stat-icon primary">${icon('target', 18)}</div>
              <div>
                <h3 style="margin:0">Goals Fund Allocation</h3>
                <div class="mut" style="font-size:0.8rem">Capital reserved per milestone</div>
              </div>
            </div>
          </div>
          ${can("goals-donut-chart", 210)}
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <div class="stat-icon info">${icon('chart', 18)}</div>
              <div>
                <h3 style="margin:0">Budget vs Actual Spend</h3>
                <div class="mut" style="font-size:0.8rem">Current month limit consumption</div>
              </div>
            </div>
          </div>
          ${can("budgets-bar-chart", 210)}
        </div>
      </div>

      <!-- Active Savings Goals Section with JS Filters -->
      <div class="card mt-4">
        <div class="row between mb-2">
          <div class="row">
            <div class="stat-icon primary">${icon('target', 18)}</div>
            <div>
              <h2 style="margin:0">Financial Milestones</h2>
              <div class="mut" style="font-size:0.8rem">Track progress, fund accounts, and project deadlines</div>
            </div>
          </div>
          <button class="btn sm" onclick="openNewGoalModal()">${icon('plus', 13)} Create Goal</button>
        </div>

        <!-- Filter Chips for Goals -->
        <div class="row between mb-3" style="padding-bottom:10px;border-bottom:1px solid var(--border)">
          <div class="filter-chips">
            <span class="mut" style="font-size:0.75rem;font-weight:700;align-self:center;margin-right:2px">STATUS:</span>
            <div class="filter-chip ${goalStatusFilter === 'all' ? 'active' : ''}" onclick="setGoalStatusFilter('all')">All Goals</div>
            <div class="filter-chip ${goalStatusFilter === 'active' ? 'active' : ''}" onclick="setGoalStatusFilter('active')">In Progress</div>
            <div class="filter-chip ${goalStatusFilter === 'completed' ? 'active' : ''}" onclick="setGoalStatusFilter('completed')">Achieved</div>
          </div>

          <div class="filter-chips">
            <span class="mut" style="font-size:0.75rem;font-weight:700;align-self:center;margin-right:2px">PRIORITY:</span>
            <div class="filter-chip ${goalPriorityFilter === 'all' ? 'active' : ''}" onclick="setGoalPriorityFilter('all')">All</div>
            <div class="filter-chip ${goalPriorityFilter === 'high' ? 'active' : ''}" onclick="setGoalPriorityFilter('high')">High Priority</div>
            <div class="filter-chip ${goalPriorityFilter === 'medium' ? 'active' : ''}" onclick="setGoalPriorityFilter('medium')">Medium</div>
          </div>
        </div>

        <!-- Goals Cards Grid -->
        <div class="grid" id="goals-cards-grid"></div>
      </div>

      <!-- Goal Velocity Timeline Calculator & Category Monthly Ceilings -->
      <div class="two mt-4">
        <!-- Goal Planner Calculator -->
        <div class="card">
          <div class="row mb-2">
            <div class="stat-icon primary">${icon('clock', 18)}</div>
            <div>
              <h3 style="margin:0">Goal Velocity Timeline Planner</h3>
              <div class="mut" style="font-size:0.8rem">Calculate exact monthly deposit to hit your target</div>
            </div>
          </div>

          <div class="row">
            <div style="flex:1">
              <label>Target Amount (${curSymbol()})</label>
              <input id="calc-target" type="number" value="100000" oninput="runGoalCalc()">
            </div>
            <div style="flex:1">
              <label>Saved So Far (${curSymbol()})</label>
              <input id="calc-saved" type="number" value="35000" oninput="runGoalCalc()">
            </div>
          </div>

          <label>Monthly Contribution Rate (${curSymbol()})</label>
          <input id="calc-monthly" type="number" value="7500" oninput="runGoalCalc()">

          <div style="background:var(--bg-subtle);border:1px solid var(--border);border-radius:var(--radius-md);padding:14px;margin-top:10px">
            <div class="mut" style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.04em">Projected Timeline</div>
            <div class="big primary mt-1" id="calc-result" style="color:var(--primary)">10 months</div>
            <div class="mut mt-1" id="calc-date-desc" style="font-size:0.82rem">Target reached by October 2027</div>
          </div>
        </div>

        <!-- Category Budgets Management with Status Filters -->
        <div class="card">
          <div class="row between mb-2">
            <div class="row">
              <div class="stat-icon warning">${icon('pie', 18)}</div>
              <div>
                <h3 style="margin:0">Category Monthly Limits</h3>
                <div class="mut" style="font-size:0.8rem">Enforce spending ceilings to maximize net savings</div>
              </div>
            </div>
            <button class="btn alt sm" onclick="openBudget503020Modal()">${icon('sparkles', 13)} Auto 50/30/20</button>
          </div>

          <!-- Filter for Budgets -->
          <div class="filter-chips mb-2">
            <div class="filter-chip ${budgetViewFilter === 'all' ? 'active' : ''}" onclick="setBudgetViewFilter('all')">All Budgets</div>
            <div class="filter-chip ${budgetViewFilter === 'safe' ? 'active' : ''}" onclick="setBudgetViewFilter('safe')">Safe (&lt;70%)</div>
            <div class="filter-chip ${budgetViewFilter === 'warning' ? 'active' : ''}" onclick="setBudgetViewFilter('warning')">Caution (70-99%)</div>
            <div class="filter-chip ${budgetViewFilter === 'exceeded' ? 'active' : ''}" onclick="setBudgetViewFilter('exceeded')">Exceeded</div>
          </div>

          <div id="category-budgets-list"></div>

          <div class="row mt-3" style="padding-top:12px;border-top:1px solid var(--border)">
            <div style="flex:1">
              <select id="new-budget-cat">
                ${CATS.map(c => `<option value="${c}">${c}</option>`).join("")}
              </select>
            </div>
            <div style="flex:1">
              <input id="new-budget-amt" type="number" placeholder="Monthly Limit">
            </div>
            <div style="margin-bottom:14px">
              <button class="btn sm" onclick="setCategoryBudget()">${icon('plus', 14)} Set Limit</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals Container -->
    <div id="goals-modal-container"></div>
  `;

  draw();
  runGoalCalc();
}

function setGoalStatusFilter(s) {
  goalStatusFilter = s;
  draw();
}

function setGoalPriorityFilter(p) {
  goalPriorityFilter = p;
  draw();
}

function setBudgetViewFilter(f) {
  budgetViewFilter = f;
  draw();
}

function draw() {
  const allGoals = get("goals", []);
  const budgets = get("budgets", {});
  const currentMonthTx = tx().filter(t => t.date.startsWith(mk()));
  const categorySpent = byCat(currentMonthTx);

  // Overall KPI metrics
  const totalTarget = allGoals.reduce((s, g) => s + g.target, 0);
  const totalSaved = allGoals.reduce((s, g) => s + g.saved, 0);
  const totalBudgeted = Object.values(budgets).reduce((s, v) => s + v, 0);
  const totalSpentInBudgets = Object.keys(budgets).reduce((s, c) => s + (categorySpent[c] || 0), 0);
  const overallGoalPercent = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  // Render KPI grid with accent stripes
  $("#goals-kpi-grid").innerHTML = `
    <div class="stat-card accent-purple">
      <div class="stat-top">
        <span class="stat-label">Total Saved</span>
        <div class="stat-icon" style="background:#eef2ff;color:#6366f1">${icon('target', 16)}</div>
      </div>
      <div class="big">${money(totalSaved)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#eef2ff;color:#6366f1">${overallGoalPercent}% Target</span>
        <span class="mut" style="font-size:0.75rem">of ${money(totalTarget)}</span>
      </div>
    </div>

    <div class="stat-card accent-green">
      <div class="stat-top">
        <span class="stat-label">Goals Funded</span>
        <div class="stat-icon" style="background:#ecfdf5;color:#10b981">${icon('award', 16)}</div>
      </div>
      <div class="big">${allGoals.filter(g => g.saved >= g.target).length} / ${allGoals.length}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfdf5;color:#059669">+100% Complete</span>
        <span class="mut" style="font-size:0.75rem">Milestones achieved</span>
      </div>
    </div>

    <div class="stat-card accent-orange">
      <div class="stat-top">
        <span class="stat-label">Monthly Budget</span>
        <div class="stat-icon" style="background:#fef3c7;color:#f59e0b">${icon('pie', 16)}</div>
      </div>
      <div class="big">${money(totalBudgeted)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend down" style="background:#fef3c7;color:#d97706">${money(totalSpentInBudgets)}</span>
        <span class="mut" style="font-size:0.75rem">spent this month</span>
      </div>
    </div>

    <div class="stat-card accent-cyan">
      <div class="stat-top">
        <span class="stat-label">Budget Remaining</span>
        <div class="stat-icon" style="background:#ecfeff;color:#06b6d4">${icon('shield', 16)}</div>
      </div>
      <div class="big">${money(Math.max(0, totalBudgeted - totalSpentInBudgets))}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfeff;color:#0891b2">${totalBudgeted > 0 ? Math.round((totalSpentInBudgets / totalBudgeted) * 100) : 0}% Consumed</span>
      </div>
    </div>
  `;

  // Warning Banners
  const hotCategories = Object.keys(budgets).filter(c => (categorySpent[c] || 0) >= budgets[c] * 0.85);
  const alertsContainer = $("#budget-alerts-container");
  if (hotCategories.length) {
    alertsContainer.innerHTML = hotCategories.map(c => {
      const spent = categorySpent[c] || 0;
      const limit = budgets[c];
      const isExceeded = spent >= limit;
      return `
        <div class="banner ${isExceeded ? 'danger' : 'warning'}">
          ${icon('alert-circle', 18)}
          <div style="flex:1">
            <b>${c} Budget ${isExceeded ? 'Exceeded' : 'Alert'}!</b> Spent ${money(spent)} of ${money(limit)} limit (${Math.round((spent / limit) * 100)}%).
          </div>
        </div>
      `;
    }).join("");
  } else {
    alertsContainer.innerHTML = "";
  }

  // Filtered Goals
  const filteredGoals = allGoals.filter(g => {
    const isDone = g.saved >= g.target;
    if (goalStatusFilter === "active" && isDone) return false;
    if (goalStatusFilter === "completed" && !isDone) return false;
    if (goalPriorityFilter !== "all" && (g.priority || 'medium').toLowerCase() !== goalPriorityFilter) return false;
    return true;
  });

  const goalsGrid = $("#goals-cards-grid");
  if (!filteredGoals.length) {
    goalsGrid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1;text-align:center;padding:36px;color:var(--text-muted)">
        <div style="font-size:1.1rem;font-weight:700;margin-bottom:6px">No goals matching this filter</div>
        <div style="font-size:0.85rem;margin-bottom:12px">Try choosing "All Goals" or create a new goal.</div>
        <button class="btn sm" onclick="openNewGoalModal()">${icon('plus', 14)} Create Goal</button>
      </div>
    `;
  } else {
    goalsGrid.innerHTML = filteredGoals.map(g => {
      const percent = Math.min(100, Math.round((g.saved / g.target) * 100));
      const remaining = Math.max(0, g.target - g.saved);
      const isComplete = g.saved >= g.target;
      const gIcon = g.iconName || 'target';

      return `
        <div class="card">
          <div class="row between mb-2">
            <div class="row">
              <div class="stat-icon ${isComplete ? 'success' : 'primary'}">${icon(gIcon, 18)}</div>
              <div>
                <h3 style="margin:0;font-size:1.05rem">${g.name}</h3>
                <div class="row gap-sm">
                  <span class="tag" style="font-size:0.68rem">${g.category || 'Milestone'}</span>
                  <span class="tag ${g.priority === 'High' ? 'danger' : 'info'}" style="font-size:0.68rem">${g.priority || 'Medium'}</span>
                </div>
              </div>
            </div>
            <div class="tag ${isComplete ? 'success' : percent >= 75 ? 'primary' : 'warning'}">
              ${percent}%
            </div>
          </div>

          <div class="meter ${isComplete ? '' : percent >= 80 ? 'wn' : 'primary'}">
            <i style="width:${percent}%"></i>
          </div>

          <div class="row between mt-2" style="font-size:0.85rem">
            <div>
              <div class="mut" style="font-size:0.75rem">SAVED</div>
              <div style="font-weight:700;color:var(--text-main)">${money(g.saved)}</div>
            </div>
            <div style="text-align:right">
              <div class="mut" style="font-size:0.75rem">TARGET</div>
              <div style="font-weight:700">${money(g.target)}</div>
            </div>
          </div>

          ${isComplete ? `
            <div class="banner success mt-2" style="padding:6px 10px;font-size:0.78rem">
              ${icon('check', 13)} Target fully achieved!
            </div>
          ` : `
            <div class="mut mt-2" style="font-size:0.78rem">
              ${money(remaining)} remaining
            </div>
          `}

          <div class="row between mt-3" style="padding-top:10px;border-top:1px solid var(--border-light)">
            <div class="row gap-sm">
              <button class="btn sm" onclick="promptDeposit(${g.id})">${icon('plus', 13)} Deposit</button>
              <button class="btn alt sm" onclick="promptWithdraw(${g.id})">${icon('arrow-up-right', 13)} Withdraw</button>
            </div>
            <button class="btn alt sm icon-only" onclick="deleteGoal(${g.id})" title="Delete" style="color:var(--danger)">${icon('trash', 13)}</button>
          </div>
        </div>
      `;
    }).join("");
  }

  // Filtered Budgets
  const budgetListEl = $("#category-budgets-list");
  let budgetKeys = Object.keys(budgets);

  if (budgetViewFilter === "safe") {
    budgetKeys = budgetKeys.filter(c => ((categorySpent[c] || 0) / budgets[c]) < 0.7);
  } else if (budgetViewFilter === "warning") {
    budgetKeys = budgetKeys.filter(c => {
      const p = (categorySpent[c] || 0) / budgets[c];
      return p >= 0.7 && p < 1.0;
    });
  } else if (budgetViewFilter === "exceeded") {
    budgetKeys = budgetKeys.filter(c => ((categorySpent[c] || 0) / budgets[c]) >= 1.0);
  }

  if (!budgetKeys.length) {
    budgetListEl.innerHTML = `<div class="mut" style="font-size:0.85rem">No budgets match this filter.</div>`;
  } else {
    budgetListEl.innerHTML = budgetKeys.map(c => {
      const limit = budgets[c];
      const spent = categorySpent[c] || 0;
      const p = Math.round((spent / limit) * 100);
      const isOver = p >= 100;
      const isNear = p >= 70 && !isOver;

      return `
        <div style="margin-bottom:12px">
          <div class="row between" style="font-size:0.85rem;font-weight:600">
            <div class="row gap-sm">
              ${icon(CAT_ICONS[c] || 'tag', 14)}
              <span>${c}</span>
            </div>
            <div>
              <span>${money(spent)}</span>
              <span class="mut"> / ${money(limit)}</span>
              <span class="tag ${isOver ? 'danger' : isNear ? 'warning' : 'success'}" style="margin-left:6px;font-size:0.7rem">${p}%</span>
              <button class="btn alt sm icon-only" onclick="removeBudget('${c}')" style="margin-left:4px;padding:2px 4px;color:var(--danger)">${icon('x', 11)}</button>
            </div>
          </div>
          <div class="meter ${isOver ? 'over' : isNear ? 'wn' : ''}">
            <i style="width:${Math.min(100, p)}%"></i>
          </div>
        </div>
      `;
    }).join("");
  }

  renderGoalsDonutChart();
  renderBudgetsBarChart();
}

function renderGoalsDonutChart() {
  const c = $("#goals-donut-chart");
  if (!c) return;
  const goals = get("goals", []);
  const data = goals.map(g => [g.name, g.saved]).filter(item => item[1] > 0);
  pie(c, data, "Saved");
}

function renderBudgetsBarChart() {
  const c = $("#budgets-bar-chart");
  if (!c) return;
  const budgets = get("budgets", {});
  const currentMonthTx = tx().filter(t => t.date.startsWith(mk()));
  const categorySpent = byCat(currentMonthTx);

  const labels = Object.keys(budgets);
  if (!labels.length) return;

  const budgetLimits = labels.map(l => budgets[l]);
  const actualSpends = labels.map(l => categorySpent[l] || 0);

  bars(c, labels, [budgetLimits, actualSpends]);
}

function runGoalCalc() {
  const t = +$("#calc-target").value;
  const s = +$("#calc-saved").value;
  const m = +$("#calc-monthly").value;

  if (m <= 0 || t <= s) {
    $("#calc-result").textContent = t <= s ? "Goal Reached!" : "Enter savings/mo";
    $("#calc-date-desc").textContent = t <= s ? "Target amount is already reached." : "Enter a monthly rate above 0.";
    return;
  }

  const monthsNeeded = Math.ceil((t - s) / m);
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + monthsNeeded);
  const formattedDate = targetDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  $("#calc-result").textContent = `${monthsNeeded} months`;
  $("#calc-date-desc").textContent = `Target achieved by ${formattedDate} (${money(m * monthsNeeded)} total contribution).`;
}

function promptDeposit(id) {
  const goal = get("goals").find(g => g.id === id);
  if (!goal) return;
  const amtStr = prompt(`Deposit funds into "${goal.name}" (Amount in ${curSymbol()}):`);
  const amt = Number(amtStr);
  if (!(amt > 0)) return;

  const updated = get("goals").map(g => g.id === id ? { ...g, saved: g.saved + amt } : g);
  set("goals", updated);

  addTx({
    type: "investment",
    amt,
    cat: "Investment",
    date: today(),
    method: "Bank Transfer",
    tag: "#goal-deposit",
    note: `Funded goal: ${goal.name}`
  });

  toast(`Deposited ${money(amt)} into ${goal.name}`, "success");
  draw();
}

function promptWithdraw(id) {
  const goal = get("goals").find(g => g.id === id);
  if (!goal) return;
  const amtStr = prompt(`Withdraw funds from "${goal.name}" (Max available ${money(goal.saved)}):`);
  const amt = Number(amtStr);
  if (!(amt > 0)) return;
  if (amt > goal.saved) return toast("Cannot withdraw more than current savings", "error");

  const updated = get("goals").map(g => g.id === id ? { ...g, saved: g.saved - amt } : g);
  set("goals", updated);

  addTx({
    type: "income",
    amt,
    cat: "Other",
    date: today(),
    method: "Bank Transfer",
    tag: "#goal-withdraw",
    note: `Withdrew from goal: ${goal.name}`
  });

  toast(`Withdrew ${money(amt)} from ${goal.name}`, "info");
  draw();
}

function deleteGoal(id) {
  if (!confirm("Delete this savings goal?")) return;
  set("goals", get("goals").filter(g => g.id !== id));
  toast("Savings goal removed", "info");
  draw();
}

function setCategoryBudget() {
  const cat = $("#new-budget-cat").value;
  const limit = +$("#new-budget-amt").value;
  if (!(limit > 0)) return toast("Enter a monthly budget limit above 0", "error");

  const b = get("budgets", {});
  b[cat] = limit;
  set("budgets", b);
  $("#new-budget-amt").value = "";
  toast(`Budget set for ${cat}: ${money(limit)}`, "success");
  draw();
}

function removeBudget(cat) {
  const b = get("budgets", {});
  delete b[cat];
  set("budgets", b);
  toast(`Budget limit removed for ${cat}`, "info");
  draw();
}

// Modal: Create New Goal
function openNewGoalModal() {
  const modalContainer = $("#goals-modal-container");
  modalContainer.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeNewGoalModal()">
      <div class="modal-content">
        <button class="modal-close" onclick="closeNewGoalModal()">${icon('x', 16)}</button>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
          <div class="stat-icon primary">${icon('target', 20)}</div>
          <div>
            <h2 style="margin:0;font-size:1.25rem">Create Savings Goal</h2>
            <div class="mut" style="font-size:0.82rem">Establish a target milestone and track deposit velocity</div>
          </div>
        </div>

        <label>Goal Name</label>
        <input id="modal-goal-name" placeholder="e.g. Tesla Downpayment, Tokyo Trip, Emergency Fund">

        <div class="row">
          <div style="flex:1">
            <label>Icon / Theme</label>
            <select id="modal-goal-icon">
              <option value="shield">Safety / Emergency</option>
              <option value="laptop">Tech / Gadgets</option>
              <option value="compass">Travel / Vacation</option>
              <option value="home">Real Estate / Home</option>
              <option value="car">Vehicle / Auto</option>
              <option value="book">Education / Course</option>
              <option value="award">Wedding / Milestone</option>
              <option value="target">General Target</option>
            </select>
          </div>
          <div style="flex:1">
            <label>Priority</label>
            <select id="modal-goal-priority">
              <option value="High">High Priority</option>
              <option value="Medium" selected>Medium</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
        </div>

        <div class="row">
          <div style="flex:1">
            <label>Target Amount (${curSymbol()})</label>
            <input id="modal-goal-target" type="number" placeholder="50000" required>
          </div>
          <div style="flex:1">
            <label>Initial Deposit (${curSymbol()})</label>
            <input id="modal-goal-initial" type="number" placeholder="0" value="0">
          </div>
        </div>

        <div class="row between mt-3">
          <button class="btn alt" onclick="closeNewGoalModal()">Cancel</button>
          <button class="btn" onclick="saveNewGoal()">${icon('check', 16)} Create Goal</button>
        </div>
      </div>
    </div>
  `;
  setTimeout(() => $("#modal-goal-name")?.focus(), 100);
}

function closeNewGoalModal() {
  $("#goals-modal-container").innerHTML = "";
}

function saveNewGoal() {
  const name = $("#modal-goal-name").value.trim();
  const target = +$("#modal-goal-target").value;
  const initial = +$("#modal-goal-initial").value || 0;
  const iconName = $("#modal-goal-icon").value;
  const priority = $("#modal-goal-priority").value;

  if (!name || !(target > 0)) {
    return toast("Please enter a goal name and target amount above 0", "error");
  }

  const goals = get("goals", []);
  goals.push({
    id: Date.now(),
    name,
    iconName,
    priority,
    category: priority === "High" ? "Safety" : "Milestone",
    target,
    saved: initial
  });
  set("goals", goals);

  toast(`Goal "${name}" created!`, "success");
  closeNewGoalModal();
  draw();
}

// Modal: 50/30/20 Smart Budget Optimizer
function openBudget503020Modal() {
  const modalContainer = $("#goals-modal-container");
  modalContainer.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)close503020Modal()">
      <div class="modal-content">
        <button class="modal-close" onclick="close503020Modal()">${icon('x', 16)}</button>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:14px">
          <div class="stat-icon primary">${icon('sparkles', 20)}</div>
          <div>
            <h2 style="margin:0;font-size:1.25rem">Budget Split Optimizer</h2>
            <div class="mut" style="font-size:0.82rem">Golden financial allocation frameworks</div>
          </div>
        </div>

        <div class="row">
          <div style="flex:1">
            <label>Net Monthly Income (${curSymbol()})</label>
            <input id="opt-income" type="number" value="65000" oninput="calcBudgetSplit()">
          </div>
          <div style="flex:1">
            <label>Allocation Framework</label>
            <select id="opt-split-mode" onchange="calcBudgetSplit()">
              <option value="503020">50 / 30 / 20 (Balanced)</option>
              <option value="602020">60 / 20 / 20 (High Needs)</option>
              <option value="702010">70 / 20 / 10 (Strict Survival)</option>
            </select>
          </div>
        </div>

        <div class="mt-2" style="display:flex;flex-direction:column;gap:12px" id="opt-breakdown"></div>

        <div class="row between mt-4">
          <button class="btn alt" onclick="close503020Modal()">Close</button>
          <button class="btn" onclick="applyBudgetSplit()">${icon('check', 16)} Apply to Categories</button>
        </div>
      </div>
    </div>
  `;

  calcBudgetSplit();
}

function calcBudgetSplit() {
  const inc = +$("#opt-income").value || 0;
  const mode = $("#opt-split-mode").value;

  let nPct = 0.50, wPct = 0.30, sPct = 0.20;
  if (mode === "602020") { nPct = 0.60; wPct = 0.20; sPct = 0.20; }
  else if (mode === "702010") { nPct = 0.70; wPct = 0.20; sPct = 0.10; }

  const needs = inc * nPct;
  const wants = inc * wPct;
  const savings = inc * sPct;

  $("#opt-breakdown").innerHTML = `
    <div style="padding:12px;background:var(--primary-light);border:1px solid var(--primary-border);border-radius:var(--radius-md)">
      <div class="row between">
        <span style="font-weight:700;color:var(--primary)">${Math.round(nPct * 100)}% Essential Needs</span>
        <span style="font-weight:800;color:var(--primary)">${money(needs)}</span>
      </div>
      <div class="mut" style="font-size:0.8rem;margin-top:4px">Rent, utilities, groceries, commute, healthcare.</div>
    </div>

    <div style="padding:12px;background:var(--warning-bg);border:1px solid var(--warning-border);border-radius:var(--radius-md)">
      <div class="row between">
        <span style="font-weight:700;color:#92400e">${Math.round(wPct * 100)}% Lifestyle & Wants</span>
        <span style="font-weight:800;color:#92400e">${money(wants)}</span>
      </div>
      <div class="mut" style="font-size:0.8rem;margin-top:4px">Dining out, shopping, subscriptions, leisure.</div>
    </div>

    <div style="padding:12px;background:var(--success-bg);border:1px solid var(--success-border);border-radius:var(--radius-md)">
      <div class="row between">
        <span style="font-weight:700;color:var(--success)">${Math.round(sPct * 100)}% Wealth & Savings</span>
        <span style="font-weight:800;color:var(--success)">${money(savings)}</span>
      </div>
      <div class="mut" style="font-size:0.8rem;margin-top:4px">Emergency reserve, mutual fund SIPs, and targets.</div>
    </div>
  `;
}

function close503020Modal() {
  $("#goals-modal-container").innerHTML = "";
}

function applyBudgetSplit() {
  const inc = +$("#opt-income").value || 0;
  if (!(inc > 0)) return toast("Please enter your monthly income", "error");

  const mode = $("#opt-split-mode").value;
  let nPct = 0.50, wPct = 0.30;
  if (mode === "602020") { nPct = 0.60; wPct = 0.20; }
  else if (mode === "702010") { nPct = 0.70; wPct = 0.20; }

  const needs = inc * nPct;
  const wants = inc * wPct;

  const b = get("budgets", {});
  b.Rent = Math.round(needs * 0.55);
  b.Food = Math.round(needs * 0.30);
  b.Bills = Math.round(needs * 0.15);
  b.Shopping = Math.round(wants * 0.50);
  b.Fun = Math.round(wants * 0.30);
  b.Travel = Math.round(wants * 0.20);

  set("budgets", b);
  toast("Category budgets successfully updated!", "success");
  close503020Modal();
  draw();
}

initGoalsView();
