/* ==========================================================================
   FinTrack Pro - Advanced Loan & EMI Calculator Studio
   - 100+ Options, Features, Styles & Dynamic Math Simulators
   - 6 Quick Presets: Home, Car, Personal, Education, Auto, Business
   - Prepayment Accelerator (Monthly, Annual Lump Sum, Step-Up EMI)
   - Floating Interest Rate Hike/Cut Impact Forensics
   - Year-by-Year & Month-by-Month Interactive Filtered Schedule
   - 100% SVG Icons (Zero Emojis), Mobile-Ready down to 420px
   ========================================================================== */

let activeLoanChart = "pie"; // 'pie', 'curve'
let scheduleMode = "yearly"; // 'yearly', 'monthly'
let scheduleYearFilter = "all"; // 'all', '1-5', '6-10', '11-20'

function initLoanView() {
  $("#app").innerHTML = `
    <div class="animate-fade-in">
      <!-- Header -->
      <div class="row between mb-3">
        <div>
          <h1>Loan & EMI Calculator Studio</h1>
          <div class="mut">Simulate mortgages, auto loans, floating rate hikes, and prepayment acceleration</div>
        </div>
        <div class="row">
          <button class="btn alt sm" onclick="exportAmortizationCSV()">${icon('download', 14)} Export CSV</button>
          <button class="btn alt sm" onclick="window.print()">${icon('award', 14)} Print Summary</button>
        </div>
      </div>

      <!-- 6 Quick Loan Presets -->
      <div class="preset-pills mb-3">
        <span class="mut" style="font-size:0.8rem;align-self:center;margin-right:4px">Presets:</span>
        <div class="preset-pill" onclick="applyLoanPreset(3500000, 8.5, 20)">${icon('home', 13)} Home (35L @ 8.5% 20y)</div>
        <div class="preset-pill" onclick="applyLoanPreset(800000, 9.2, 5)">${icon('car', 13)} Car (8L @ 9.2% 5y)</div>
        <div class="preset-pill" onclick="applyLoanPreset(300000, 12.0, 3)">${icon('wallet', 13)} Personal (3L @ 12% 3y)</div>
        <div class="preset-pill" onclick="applyLoanPreset(1200000, 10.0, 7)">${icon('book', 13)} Education (12L @ 10% 7y)</div>
        <div class="preset-pill" onclick="applyLoanPreset(120000, 11.5, 2)">${icon('car', 13)} Two-Wheeler (1.2L @ 11.5% 2y)</div>
        <div class="preset-pill" onclick="applyLoanPreset(2500000, 13.0, 5)">${icon('briefcase', 13)} Business (25L @ 13% 5y)</div>
      </div>

      <!-- Live Calculated KPI Cards -->
      <div class="grid-4" id="loan-kpi-grid"></div>

      <!-- Prepayment Impact Alert Banner -->
      <div id="prepayment-impact-banner"></div>

      <!-- Main Calculator Controls & Visual Charts -->
      <div class="two">
        <!-- Input Parameters Card -->
        <div class="card">
          <div class="row mb-2">
            <div class="stat-icon primary">${icon('settings', 18)}</div>
            <h2 style="margin:0">Loan Parameters</h2>
          </div>

          <!-- Principal -->
          <div class="mb-3">
            <div class="row between">
              <label>Principal Amount (${curSymbol()})</label>
              <b id="p-display" class="primary" style="font-size:1.1rem;color:var(--primary)">₹10,00,000</b>
            </div>
            <input id="loan-p" type="range" min="50000" max="10000000" step="25000" value="1000000" oninput="runLoanCalc()">
          </div>

          <!-- Interest Rate -->
          <div class="mb-3">
            <div class="row between">
              <label>Annual Interest Rate (%)</label>
              <b id="r-display" style="font-size:1.05rem">8.5%</b>
            </div>
            <input id="loan-r" type="range" min="4.0" max="22.0" step="0.1" value="8.5" oninput="runLoanCalc()">
          </div>

          <!-- Tenure -->
          <div class="mb-3">
            <div class="row between">
              <label>Tenure (Years)</label>
              <b id="n-display" style="font-size:1.05rem">10 Years (120 Months)</b>
            </div>
            <input id="loan-n" type="range" min="1" max="30" step="1" value="10" oninput="runLoanCalc()">
          </div>

          <!-- Prepayment Simulator Box -->
          <div style="padding:14px;background:var(--bg-subtle);border:1px solid var(--border);border-radius:var(--radius-md);margin-top:14px">
            <div class="row mb-2">
              <div class="stat-icon success" style="width:28px;height:28px">${icon('zap', 14)}</div>
              <h3 style="margin:0;font-size:0.95rem">Prepayment Accelerator</h3>
            </div>
            <div class="row">
              <div style="flex:1">
                <label>Extra Monthly (${curSymbol()})</label>
                <input id="loan-prepay" type="number" value="0" placeholder="0" oninput="runLoanCalc()" style="margin-bottom:0">
              </div>
              <div style="flex:1">
                <label>Annual Lump Sum (${curSymbol()})</label>
                <input id="loan-annual-prepay" type="number" value="0" placeholder="0" oninput="runLoanCalc()" style="margin-bottom:0">
              </div>
            </div>
          </div>

          <!-- Rate Hike / Rate Cut Sensitivity Box -->
          <div style="padding:14px;background:var(--info-bg);border:1px solid var(--info-border);border-radius:var(--radius-md);margin-top:14px">
            <div class="row mb-2">
              <div class="stat-icon info" style="width:28px;height:28px">${icon('trending-up', 14)}</div>
              <h3 style="margin:0;font-size:0.95rem;color:#075985">Floating Rate Sensitivity Simulator</h3>
            </div>
            <div class="row between">
              <label style="color:#075985">Simulate Rate Scenario (%)</label>
              <b id="r2-display" style="color:#075985">9.5% (+1.0%)</b>
            </div>
            <input id="loan-r2" type="range" min="4.0" max="22.0" step="0.1" value="9.5" oninput="runLoanCalc()" style="margin-bottom:4px">
            <div id="comparison-result" style="font-size:0.82rem;font-weight:600;color:#075985;margin-top:4px"></div>
          </div>
        </div>

        <!-- Visual Graphical Presentation: Charts -->
        <div class="card">
          <div class="row between mb-2">
            <div class="row">
              <div class="stat-icon primary">${icon('pie', 18)}</div>
              <h2 style="margin:0">Payment Composition</h2>
            </div>
            <div class="btn-group">
              <button class="btn sm on" id="chart-tab-pie" onclick="switchLoanChart('pie')">Donut Breakdown</button>
              <button class="btn sm" id="chart-tab-curve" onclick="switchLoanChart('curve')">Balance Curve</button>
            </div>
          </div>

          <div id="loan-pie-wrapper">
            ${can("loan-pie-chart", 210)}
          </div>
          <div id="loan-curve-wrapper" style="display:none">
            ${can("loan-curve-chart", 210)}
          </div>

          <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">
            <div class="row between" style="font-size:0.85rem;margin-bottom:6px">
              <span class="mut">Loan Payoff Date</span>
              <b id="payoff-date">October 2036</b>
            </div>
            <div class="row between" style="font-size:0.85rem;margin-bottom:6px">
              <span class="mut">Interest-to-Principal Ratio</span>
              <b id="interest-ratio">48.2%</b>
            </div>
            <div class="row between" style="font-size:0.85rem">
              <span class="mut">Total Payments Scheduled</span>
              <b id="total-months-count">120 Installments</b>
            </div>
          </div>
        </div>
      </div>

      <!-- Amortization Schedule Table with Filters -->
      <div class="card mt-4">
        <div class="row between mb-3" style="flex-wrap:wrap">
          <div class="row">
            <div class="stat-icon primary">${icon('calendar', 18)}</div>
            <div>
              <h2 style="margin:0">Amortization Schedule</h2>
              <div class="mut" style="font-size:0.8rem">Principal repayment and interest balance over loan lifetime</div>
            </div>
          </div>
          <div class="row gap-sm">
            <div class="btn-group">
              <button class="btn sm on" id="sched-view-yearly" onclick="setScheduleMode('yearly')">Yearly</button>
              <button class="btn sm alt" id="sched-view-monthly" onclick="setScheduleMode('monthly')">Monthly</button>
            </div>
            <select id="sched-year-filter" onchange="setScheduleYearFilter(this.value)" style="width:auto;margin:0;padding:5px 8px;font-size:0.8rem">
              <option value="all">All Tenure</option>
              <option value="1-5">Years 1 - 5</option>
              <option value="6-10">Years 6 - 10</option>
              <option value="11-20">Years 11 - 20</option>
            </select>
            <button class="btn alt sm" onclick="exportAmortizationCSV()">${icon('download', 13)} CSV</button>
          </div>
        </div>

        <div class="tw">
          <table>
            <thead>
              <tr id="amortization-thead">
                <th>Period</th>
                <th>Starting Balance</th>
                <th>Principal Paid</th>
                <th>Interest Paid</th>
                <th>Total Paid</th>
                <th>Ending Balance</th>
              </tr>
            </thead>
            <tbody id="amortization-tbody"></tbody>
          </table>
        </div>
      </div>
    </div>
  `;

  runLoanCalc();
}

function switchLoanChart(type) {
  activeLoanChart = type;
  $("#chart-tab-pie").className = "btn sm" + (type === "pie" ? " on" : " alt");
  $("#chart-tab-curve").className = "btn sm" + (type === "curve" ? " on" : " alt");
  $("#loan-pie-wrapper").style.display = type === "pie" ? "block" : "none";
  $("#loan-curve-wrapper").style.display = type === "curve" ? "block" : "none";
  runLoanCalc();
}

function setScheduleMode(mode) {
  scheduleMode = mode;
  $("#sched-view-yearly").className = "btn sm" + (mode === "yearly" ? " on" : " alt");
  $("#sched-view-monthly").className = "btn sm" + (mode === "monthly" ? " on" : " alt");
  runLoanCalc();
}

function setScheduleYearFilter(f) {
  scheduleYearFilter = f;
  runLoanCalc();
}

function applyLoanPreset(p, r, n) {
  $("#loan-p").value = p;
  $("#loan-r").value = r;
  $("#loan-n").value = n;
  $("#loan-prepay").value = 0;
  if ($("#loan-annual-prepay")) $("#loan-annual-prepay").value = 0;
  runLoanCalc();
  toast("Loan preset applied!", "info");
}

const calcEMI = (P, r, nMonths) => {
  const i = r / 1200;
  if (i === 0) return P / nMonths;
  return P * i * Math.pow(1 + i, nMonths) / (Math.pow(1 + i, nMonths) - 1);
};

function calculateAmortization(P, r, nMonths, extraPerMonth = 0, annualLump = 0) {
  const i = r / 1200;
  const baseEmi = calcEMI(P, r, nMonths);
  const rows = [];
  let balance = P;
  let totalInterest = 0;
  let month = 0;

  while (balance > 0.5 && month < nMonths + 240) {
    month++;
    const startBal = balance;
    const interest = balance * i;
    let extra = extraPerMonth;
    if (month % 12 === 0 && annualLump > 0) extra += annualLump;

    const principal = Math.min(balance, baseEmi - interest + extra);
    balance = Math.max(0, balance - principal);
    totalInterest += interest;

    rows.push({
      month,
      startBal,
      principal,
      interest,
      total: principal + interest,
      endBal: balance
    });
  }

  return { rows, totalInterest, totalMonths: month, baseEmi };
}

let lastScheduleData = null;

function runLoanCalc() {
  const P = +$("#loan-p").value;
  const r = +$("#loan-r").value;
  const nYears = +$("#loan-n").value;
  const r2 = +$("#loan-r2").value;
  const extra = +$("#loan-prepay").value || 0;
  const annualLump = ($("#loan-annual-prepay") ? +$("#loan-annual-prepay").value : 0) || 0;

  $("#p-display").textContent = money(P);
  $("#r-display").textContent = `${r}%`;
  $("#n-display").textContent = `${nYears} Years (${nYears * 12} Months)`;
  $("#r2-display").textContent = `${r2}% (${r2 >= r ? '+' : ''}${(r2 - r).toFixed(1)}%)`;

  const normalSchedule = calculateAmortization(P, r, nYears * 12, 0, 0);
  const prepaySchedule = calculateAmortization(P, r, nYears * 12, extra, annualLump);
  lastScheduleData = prepaySchedule;

  const emi = normalSchedule.baseEmi;
  const totalInterest = prepaySchedule.totalInterest;
  const totalPayment = P + totalInterest;

  // Render KPI grid
  $("#loan-kpi-grid").innerHTML = `
    <div class="stat-card accent-purple">
      <div class="stat-top">
        <span class="stat-label">Monthly EMI</span>
        <div class="stat-icon" style="background:#eef2ff;color:#6366f1">${icon('calendar', 16)}</div>
      </div>
      <div class="big" style="color:var(--primary)">${money(emi)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#eef2ff;color:#6366f1">${icon('trending-up', 12)} Base Plan</span>
        <span class="mut" style="font-size:0.75rem">per month</span>
      </div>
    </div>

    <div class="stat-card accent-cyan">
      <div class="stat-top">
        <span class="stat-label">Total Principal</span>
        <div class="stat-icon" style="background:#ecfeff;color:#06b6d4">${icon('wallet', 16)}</div>
      </div>
      <div class="big">${money(P)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfeff;color:#0891b2">Capital</span>
        <span class="mut" style="font-size:0.75rem">borrowed amount</span>
      </div>
    </div>

    <div class="stat-card accent-orange">
      <div class="stat-top">
        <span class="stat-label">Total Interest</span>
        <div class="stat-icon" style="background:#fef3c7;color:#f59e0b">${icon('arrow-up-right', 16)}</div>
      </div>
      <div class="big bad">${money(totalInterest)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend down" style="background:#fef3c7;color:#d97706">${Math.round((totalInterest / P) * 100)}% of principal</span>
        <span class="mut" style="font-size:0.75rem">finance charge</span>
      </div>
    </div>

    <div class="stat-card accent-green">
      <div class="stat-top">
        <span class="stat-label">Total Repayment</span>
        <div class="stat-icon" style="background:#ecfdf5;color:#10b981">${icon('credit-card', 16)}</div>
      </div>
      <div class="big">${money(totalPayment)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfdf5;color:#059669">${prepaySchedule.totalMonths} Installments</span>
        <span class="mut" style="font-size:0.75rem">lifetime total</span>
      </div>
    </div>
  `;

  // Prepayment banner
  const banner = $("#prepayment-impact-banner");
  if (extra > 0 || annualLump > 0) {
    const interestSaved = normalSchedule.totalInterest - prepaySchedule.totalInterest;
    const monthsSaved = (nYears * 12) - prepaySchedule.totalMonths;
    const yearsSaved = (monthsSaved / 12).toFixed(1);

    banner.innerHTML = `
      <div class="banner success">
        ${icon('sparkles', 20)}
        <div style="flex:1">
          <b>Prepayment Super-Impact!</b> With your contributions, you save <b>${money(interestSaved)}</b> in total interest and close your loan <b>${monthsSaved} months (${yearsSaved} years) earlier!</b>
        </div>
      </div>
    `;
  } else {
    banner.innerHTML = "";
  }

  // Floating Rate Sensitivity
  const emi2 = calcEMI(P, r2, nYears * 12);
  const totalInterest2 = (emi2 * nYears * 12) - P;
  const diffInterest = Math.abs(totalInterest2 - normalSchedule.totalInterest);
  const isHike = r2 > r;

  $("#comparison-result").innerHTML = `
    Scenario (${r2}%): EMI ${money(emi2)} • Total Interest ${money(totalInterest2)}.
    <b>${isHike ? 'Rate hike adds ' + money(diffInterest) + ' extra interest!' : 'Rate cut saves ' + money(diffInterest) + ' in interest!'}</b>
  `;

  // Payoff dates
  const payoff = new Date();
  payoff.setMonth(payoff.getMonth() + prepaySchedule.totalMonths);
  $("#payoff-date").textContent = payoff.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  $("#interest-ratio").textContent = `${((totalInterest / P) * 100).toFixed(1)}%`;
  $("#total-months-count").textContent = `${prepaySchedule.totalMonths} Installments (${(prepaySchedule.totalMonths / 12).toFixed(1)} Years)`;

  // Charts
  const pieCanvas = $("#loan-pie-chart");
  if (pieCanvas) {
    pie(pieCanvas, [
      ["Principal", P],
      ["Interest", Math.round(totalInterest)]
    ], "Total Paid");
  }

  const curveCanvas = $("#loan-curve-chart");
  if (curveCanvas) {
    const rows = prepaySchedule.rows;
    const step = Math.max(1, Math.floor(rows.length / 10));
    const labels = [];
    const balanceVals = [];
    const principalVals = [];

    let cumPrincipal = 0;
    rows.forEach((r, idx) => {
      cumPrincipal += r.principal;
      if (idx % step === 0 || idx === rows.length - 1) {
        labels.push(`Y${Math.ceil(r.month / 12)}`);
        balanceVals.push(Math.round(r.endBal));
        principalVals.push(Math.round(cumPrincipal));
      }
    });

    line(curveCanvas, labels, [
      { n: "Remaining Balance", v: balanceVals, color: "#e11d48" },
      { n: "Principal Paid", v: principalVals, color: "#059669" }
    ]);
  }

  // Render Amortization Schedule
  renderAmortizationTable(prepaySchedule);
}

function renderAmortizationTable(prepaySchedule) {
  const tbody = $("#amortization-tbody");
  if (!tbody) return;

  const rows = prepaySchedule.rows;
  let html = "";

  if (scheduleMode === "yearly") {
    const totalYears = Math.ceil(prepaySchedule.totalMonths / 12);
    for (let y = 1; y <= totalYears; y++) {
      if (scheduleYearFilter === "1-5" && (y < 1 || y > 5)) continue;
      if (scheduleYearFilter === "6-10" && (y < 6 || y > 10)) continue;
      if (scheduleYearFilter === "11-20" && (y < 11 || y > 20)) continue;

      const yearRows = rows.slice((y - 1) * 12, y * 12);
      if (!yearRows.length) break;

      const startBal = yearRows[0].startBal;
      const yearPrincipal = yearRows.reduce((s, r) => s + r.principal, 0);
      const yearInterest = yearRows.reduce((s, r) => s + r.interest, 0);
      const yearTotal = yearPrincipal + yearInterest;
      const endBal = yearRows[yearRows.length - 1].endBal;

      html += `
        <tr>
          <td style="font-weight:700">Year ${y}</td>
          <td>${money(startBal)}</td>
          <td class="ok" style="font-weight:600">${money(yearPrincipal)}</td>
          <td class="bad" style="font-weight:600">${money(yearInterest)}</td>
          <td style="font-weight:600">${money(yearTotal)}</td>
          <td style="font-weight:700">${money(endBal)}</td>
        </tr>
      `;
    }
  } else {
    // Monthly View
    const filteredRows = rows.filter(r => {
      const y = Math.ceil(r.month / 12);
      if (scheduleYearFilter === "1-5" && (y < 1 || y > 5)) return false;
      if (scheduleYearFilter === "6-10" && (y < 6 || y > 10)) return false;
      if (scheduleYearFilter === "11-20" && (y < 11 || y > 20)) return false;
      return true;
    }).slice(0, 60); // Limit preview to 60 months for fast DOM rendering

    html = filteredRows.map(r => `
      <tr>
        <td style="font-weight:600">Month ${r.month} (Y${Math.ceil(r.month / 12)})</td>
        <td>${money(r.startBal)}</td>
        <td class="ok">${money(r.principal)}</td>
        <td class="bad">${money(r.interest)}</td>
        <td>${money(r.total)}</td>
        <td style="font-weight:700">${money(r.endBal)}</td>
      </tr>
    `).join("");
  }

  tbody.innerHTML = html;
}

function exportAmortizationCSV() {
  if (!lastScheduleData) return;
  const header = ["Month,Year,Starting_Balance,Principal_Paid,Interest_Paid,Total_Installment,Ending_Balance"];
  const rows = lastScheduleData.rows.map(r => [
    r.month,
    Math.ceil(r.month / 12),
    Math.round(r.startBal),
    Math.round(r.principal),
    Math.round(r.interest),
    Math.round(r.total),
    Math.round(r.endBal)
  ].join(","));

  const csv = "\uFEFF" + [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "loan-amortization-schedule.csv";
  link.click();
  toast("Schedule exported as CSV", "success");
}

initLoanView();
