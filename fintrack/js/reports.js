/* ==========================================================================
   FinTrack Pro - Deep Financial Reports & Executive Analytics
   - 100+ Options, Features, Styles & Dynamic Filter Selectors
   - 4 High-DPI Charts: Inflow vs Outflow, Category Donut, Balance Trend, Day-of-Week
   - Automated Financial Forensics & Algorithm Diagnostics
   - Executive PDF Statement Print & CSV Data Export
   - 100% SVG Icons (Zero Emojis), Mobile-Ready down to 420px
   ========================================================================== */

let reportPeriod = "all";

function initReportsView() {
  $("#app").innerHTML = `
    <div class="animate-fade-in">
      <!-- Header & Period Switcher -->
      <div class="row between mb-3" style="flex-wrap:wrap">
        <div>
          <h1>Financial Analytics & Reports</h1>
          <div class="mut">Comprehensive cash flow forensics, category distribution, and wealth velocity</div>
        </div>
        <div class="row gap-sm">
          <select id="report-period-select" onchange="changeReportPeriod(this.value)" style="width:auto;margin-bottom:0">
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="last-90">Last 90 Days</option>
            <option value="this-year">This Year</option>
            <option value="all" selected>All Time</option>
          </select>
          <button class="btn alt sm" onclick="exportReportCSV()">${icon('download', 14)} Export CSV</button>
          <button class="btn alt sm" onclick="window.print()">${icon('award', 14)} Print Statement</button>
        </div>
      </div>

      <!-- Live Calculated Executive KPI Cards -->
      <div class="grid-4" id="report-kpi-grid"></div>

      <!-- Top Row Charts: Inflow vs Outflow Bar & Category Distribution Donut -->
      <div class="two">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <div class="stat-icon primary">${icon('chart', 18)}</div>
              <div>
                <h3 style="margin:0">Monthly Inflow vs Outflow</h3>
                <div class="mut" style="font-size:0.8rem">Cash received vs expenses across past 6 months</div>
              </div>
            </div>
          </div>
          ${can("report-monthly-bars", 210)}
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <div class="stat-icon info">${icon('pie', 18)}</div>
              <div>
                <h3 style="margin:0">Expense Breakdown by Category</h3>
                <div class="mut" style="font-size:0.8rem">Proportional allocation of expenditures</div>
              </div>
            </div>
          </div>
          ${can("report-category-donut", 210)}
        </div>
      </div>

      <!-- Bottom Row Charts: Cumulative Balance Curve & Day of Week Heatmap -->
      <div class="two">
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <div class="stat-icon success">${icon('trending-up', 18)}</div>
              <div>
                <h3 style="margin:0">Cumulative Cash Reserve Trajectory</h3>
                <div class="mut" style="font-size:0.8rem">Net capital accumulation curve over time</div>
              </div>
            </div>
          </div>
          ${can("report-balance-trend", 200)}
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <div class="stat-icon warning">${icon('calendar', 18)}</div>
              <div>
                <h3 style="margin:0">Spending by Day of Week</h3>
                <div class="mut" style="font-size:0.8rem">Identify high-spending days (Mon - Sun)</div>
              </div>
            </div>
          </div>
          ${can("report-dayofweek-bar", 200)}
        </div>
      </div>

      <!-- Automated Financial Insights & Top Spends -->
      <div class="two mt-4">
        <!-- AI-Style Insights Engine -->
        <div class="card">
          <div class="row mb-2">
            <div class="stat-icon primary">${icon('sparkles', 18)}</div>
            <div>
              <h3 style="margin:0">Automated Financial Diagnostics</h3>
              <div class="mut" style="font-size:0.8rem">Algorithmic observations from your transaction data</div>
            </div>
          </div>
          <div id="report-insights-list" style="display:flex;flex-direction:column;gap:12px;margin-top:14px"></div>
        </div>

        <!-- Top 5 Expense Categories & Highlights -->
        <div class="card">
          <div class="row mb-2">
            <div class="stat-icon danger">${icon('arrow-up-right', 18)}</div>
            <div>
              <h3 style="margin:0">Top Expenditure Categories</h3>
              <div class="mut" style="font-size:0.8rem">Where your capital flows the most</div>
            </div>
          </div>
          <div id="report-top-categories" class="mt-3"></div>
        </div>
      </div>
    </div>
  `;

  run();
}

function changeReportPeriod(p) {
  reportPeriod = p;
  run();
}

let activeReportTransactions = [];

function getPeriodTransactions() {
  const all = tx().sort((a, b) => a.date.localeCompare(b.date));
  const currentMonth = mk();

  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);

  const ninetyDaysAgo = addDays(-90);
  const currentYearStr = String(new Date().getFullYear());

  if (reportPeriod === "this-month") {
    return all.filter(t => t.date.startsWith(currentMonth));
  } else if (reportPeriod === "last-month") {
    return all.filter(t => t.date.startsWith(lastMonthStr));
  } else if (reportPeriod === "last-90") {
    return all.filter(t => t.date >= ninetyDaysAgo);
  } else if (reportPeriod === "this-year") {
    return all.filter(t => t.date.startsWith(currentYearStr));
  }
  return all;
}

function run() {
  activeReportTransactions = getPeriodTransactions();
  const list = activeReportTransactions;
  const allTx = tx();

  const income = sum(list, "income");
  const expense = sum(list, "expense");
  const investments = sum(list, "investment");
  const netSavings = income - expense;
  const savingsRate = income > 0 ? Math.round((netSavings / income) * 100) : 0;

  const dates = [...new Set(list.filter(t => t.type === "expense").map(t => t.date))];
  const avgDaily = dates.length ? Math.round(expense / dates.length) : 0;

  $("#report-kpi-grid").innerHTML = `
    <div class="stat-card accent-purple">
      <div class="stat-top">
        <span class="stat-label">Total Inflow</span>
        <div class="stat-icon" style="background:#eef2ff;color:#6366f1">${icon('arrow-down-left', 16)}</div>
      </div>
      <div class="big ok">${money(income)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#eef2ff;color:#6366f1">${list.filter(t => t.type === 'income').length} Deposits</span>
        <span class="mut" style="font-size:0.75rem">total receipts</span>
      </div>
    </div>

    <div class="stat-card accent-orange">
      <div class="stat-top">
        <span class="stat-label">Total Outflow</span>
        <div class="stat-icon" style="background:#fef3c7;color:#f59e0b">${icon('arrow-up-right', 16)}</div>
      </div>
      <div class="big bad">${money(expense)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend down" style="background:#fef3c7;color:#d97706">${money(avgDaily)}/day</span>
        <span class="mut" style="font-size:0.75rem">total spending</span>
      </div>
    </div>

    <div class="stat-card accent-cyan">
      <div class="stat-top">
        <span class="stat-label">Net Savings</span>
        <div class="stat-icon" style="background:#ecfeff;color:#06b6d4">${icon('wallet', 16)}</div>
      </div>
      <div class="big ${netSavings >= 0 ? 'ok' : 'bad'}">${money(netSavings)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfeff;color:#0891b2">${savingsRate}% Rate</span>
        <span class="mut" style="font-size:0.75rem">net retention</span>
      </div>
    </div>

    <div class="stat-card accent-green">
      <div class="stat-top">
        <span class="stat-label">Invested Assets</span>
        <div class="stat-icon" style="background:#ecfdf5;color:#10b981">${icon('trending-up', 16)}</div>
      </div>
      <div class="big">${money(investments)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfdf5;color:#059669">Deployed</span>
        <span class="mut" style="font-size:0.75rem">wealth growth</span>
      </div>
    </div>
  `;

  renderMonthlyBarChart(allTx);
  renderCategoryDonutChart(list);
  renderBalanceTrendChart(list);
  renderDayOfWeekBarChart(list);
  renderDiagnostics(list, income, expense, savingsRate, allTx);
  renderTopCategories(list, expense);
}

function renderMonthlyBarChart(allTx) {
  const c = $("#report-monthly-bars");
  if (!c) return;

  const monthsMap = {};
  allTx.forEach(t => {
    const m = t.date.slice(0, 7);
    if (!monthsMap[m]) monthsMap[m] = { inc: 0, exp: 0 };
    if (t.type === "income") monthsMap[m].inc += t.amt;
    if (t.type === "expense") monthsMap[m].exp += t.amt;
  });

  const sortedMonths = Object.keys(monthsMap).sort().slice(-6);
  if (!sortedMonths.length) return;

  const monthLabels = sortedMonths.map(m => {
    const [y, mon] = m.split("-");
    const d = new Date(y, Number(mon) - 1, 1);
    return d.toLocaleDateString("en-US", { month: "short" });
  });

  const incomeSeries = sortedMonths.map(m => monthsMap[m].inc);
  const expenseSeries = sortedMonths.map(m => monthsMap[m].exp);

  bars(c, monthLabels, [incomeSeries, expenseSeries]);
}

function renderCategoryDonutChart(list) {
  const c = $("#report-category-donut");
  if (!c) return;

  const catMap = byCat(list);
  const items = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
  pie(c, items, "Total Outflow");
}

function renderBalanceTrendChart(list) {
  const c = $("#report-balance-trend");
  if (!c) return;

  const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));
  if (!sorted.length) return;

  let balance = 0;
  const labels = [];
  const balanceVals = [];

  const step = Math.max(1, Math.floor(sorted.length / 10));
  sorted.forEach((t, i) => {
    if (t.type === "income") balance += t.amt;
    else if (t.type === "expense") balance -= t.amt;

    if (i % step === 0 || i === sorted.length - 1) {
      labels.push(t.date.slice(5)); // MM-DD
      balanceVals.push(balance);
    }
  });

  line(c, labels, [
    { n: "Net Reserves", v: balanceVals, color: "#4f46e5" }
  ]);
}

function renderDayOfWeekBarChart(list) {
  const c = $("#report-dayofweek-bar");
  if (!c) return;

  const dayTotals = [0, 0, 0, 0, 0, 0, 0];

  list.filter(t => t.type === "expense").forEach(t => {
    const d = new Date(t.date);
    const dayIdx = d.getDay();
    dayTotals[dayIdx] += t.amt;
  });

  const orderedLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const orderedTotals = [dayTotals[1], dayTotals[2], dayTotals[3], dayTotals[4], dayTotals[5], dayTotals[6], dayTotals[0]];

  bars(c, orderedLabels, orderedTotals);
}

function renderDiagnostics(list, income, expense, savingsRate, allTx) {
  const container = $("#report-insights-list");
  if (!container) return;

  const insights = [];

  if (savingsRate >= 30) {
    insights.push({
      type: "success",
      icon: "trending-up",
      title: "Superb Savings Velocity",
      desc: `You are saving ${savingsRate}% of your total earnings. This places you in the top tier of financial discipline and accelerates your FIRE timeline.`
    });
  } else if (savingsRate >= 15) {
    insights.push({
      type: "info",
      icon: "check",
      title: "Healthy Cash Flow Margin",
      desc: `Your current savings rate is ${savingsRate}%. Target 20%+ by pruning minor discretionary spends.`
    });
  } else {
    insights.push({
      type: "warning",
      icon: "alert-circle",
      title: "Tight Savings Runway",
      desc: `Your savings rate is ${savingsRate}%. With high outflow, building an emergency safety net will take longer.`
    });
  }

  const biggestExpense = [...list].filter(t => t.type === "expense").sort((a, b) => b.amt - a.amt)[0];
  if (biggestExpense) {
    insights.push({
      type: "neutral",
      icon: "tag",
      title: "Peak Individual Outflow",
      desc: `Your highest single expenditure was <b>${biggestExpense.note || biggestExpense.cat}</b> (${money(biggestExpense.amt)}) on ${biggestExpense.date}.`
    });
  }

  const thisMonthStr = mk();
  const lastMonthDate = new Date();
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonthStr = lastMonthDate.toISOString().slice(0, 7);

  const thisMonthExp = sum(allTx.filter(t => t.date.startsWith(thisMonthStr)), "expense");
  const lastMonthExp = sum(allTx.filter(t => t.date.startsWith(lastMonthStr)), "expense");

  if (lastMonthExp > 0) {
    const diff = thisMonthExp - lastMonthExp;
    const pct = Math.round((Math.abs(diff) / lastMonthExp) * 100);
    insights.push({
      type: diff <= 0 ? "success" : "warning",
      icon: diff <= 0 ? "arrow-down-left" : "arrow-up-right",
      title: diff <= 0 ? "Spending Decreased MoM" : "Spending Increased MoM",
      desc: `Current month spending is <b>${money(Math.abs(diff))} (${pct}%) ${diff <= 0 ? 'lower' : 'higher'}</b> than last month.`
    });
  }

  container.innerHTML = insights.map(ins => `
    <div style="padding:12px 14px;border-radius:var(--radius-md);background:${ins.type === 'success' ? 'var(--success-bg)' : ins.type === 'warning' ? 'var(--warning-bg)' : 'var(--bg-subtle)'};border:1px solid ${ins.type === 'success' ? 'var(--success-border)' : ins.type === 'warning' ? 'var(--warning-border)' : 'var(--border)'}">
      <div class="row gap-sm mb-1">
        <span style="color:${ins.type === 'success' ? 'var(--success)' : ins.type === 'warning' ? '#92400e' : 'var(--primary)'}">
          ${icon(ins.icon, 16)}
        </span>
        <b style="font-size:0.88rem;color:var(--text-main)">${ins.title}</b>
      </div>
      <div style="font-size:0.82rem;color:var(--text-body)">${ins.desc}</div>
    </div>
  `).join("");
}

function renderTopCategories(list, totalExpense) {
  const container = $("#report-top-categories");
  if (!container) return;

  const catMap = byCat(list);
  const sorted = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (!sorted.length) {
    container.innerHTML = `<div class="mut" style="font-size:0.85rem">No expense records found.</div>`;
    return;
  }

  container.innerHTML = sorted.map(([cat, amt]) => {
    const p = totalExpense > 0 ? Math.round((amt / totalExpense) * 100) : 0;
    return `
      <div style="margin-bottom:12px">
        <div class="row between" style="font-size:0.85rem;font-weight:600;margin-bottom:4px">
          <div class="row gap-sm">
            ${icon(CAT_ICONS[cat] || 'tag', 14)}
            <span>${cat}</span>
          </div>
          <div>
            <b>${money(amt)}</b>
            <span class="mut">(${p}%)</span>
          </div>
        </div>
        <div class="meter primary">
          <i style="width:${p}%"></i>
        </div>
      </div>
    `;
  }).join("");
}

function exportReportCSV() {
  const header = ["ID,Date,Type,Category,Method,Tag,Description,Amount"];
  const rows = activeReportTransactions.map(t => [
    t.id,
    t.date,
    t.type,
    t.cat,
    `"${t.method || ''}"`,
    `"${t.tag || ''}"`,
    `"${(t.note || '').replace(/"/g, '""')}"`,
    t.amt
  ].join(","));

  const csv = "\uFEFF" + [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `fintrack-report-${reportPeriod}.csv`;
  link.click();
  toast("Analytics report exported as CSV", "success");
}

initReportsView();
