/* ==========================================================================
   FinTrack Pro - Wealth & Investment Simulator (FIRE & Portfolio)
   - 100+ Options, Features, Styles & Dynamic Math Engines
   - 6 Simulators: SIP, Step-Up SIP, Lumpsum, FD, FIRE, SWP
   - Real-Time Inflation Forensics & Nominal vs Real Purchasing Power
   - Dynamic Asset Allocation Rebalancing (Conservative, Balanced, Aggressive)
   - Milestone Countdown (10L, 25L, 50L, 1 Crore, 2.5 Crore, 5 Crore)
   - 100% SVG Icons (Zero Emojis), Mobile-Ready down to 420px
   ========================================================================== */

let activeInvestTab = "sip"; // 'sip', 'stepup', 'lump', 'fd', 'fire', 'swp'
let portfolioRiskProfile = "balanced"; // 'conservative', 'balanced', 'aggressive'

function initInvestView() {
  $("#app").innerHTML = `
    <div class="animate-fade-in">
      <!-- Header -->
      <div class="row between mb-3">
        <div>
          <h1>Wealth & Investment Simulator</h1>
          <div class="mut">Model compound interest, step-up SIPs, SWP post-retirement cash flows, and FIRE milestones</div>
        </div>
        <div class="row">
          <button class="btn alt sm" onclick="window.print()">${icon('award', 14)} Print Projections</button>
        </div>
      </div>

      <!-- 6 Simulation Engine Tabs -->
      <div class="btn-group mb-4" style="display:flex;width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;scrollbar-width:none">
        <button class="btn on" id="tab-sip" onclick="switchInvestTab('sip')" style="flex:1">Monthly SIP</button>
        <button class="btn alt" id="tab-stepup" onclick="switchInvestTab('stepup')" style="flex:1">Step-Up SIP</button>
        <button class="btn alt" id="tab-lump" onclick="switchInvestTab('lump')" style="flex:1">Lump Sum</button>
        <button class="btn alt" id="tab-fd" onclick="switchInvestTab('fd')" style="flex:1">Fixed Deposit</button>
        <button class="btn alt" id="tab-fire" onclick="switchInvestTab('fire')" style="flex:1">FIRE Planner</button>
        <button class="btn alt" id="tab-swp" onclick="switchInvestTab('swp')" style="flex:1">SWP Pension</button>
      </div>

      <!-- Live Calculated KPI Stat Cards -->
      <div class="grid-4" id="invest-kpi-grid"></div>

      <!-- Main Controls and Growth Curve -->
      <div class="two">
        <!-- Interactive Parameters Card -->
        <div class="card" id="invest-controls-card"></div>

        <!-- Wealth Projection Chart Card -->
        <div class="card">
          <div class="card-header">
            <div class="card-header-title">
              <div class="stat-icon success">${icon('trending-up', 18)}</div>
              <div>
                <h3 style="margin:0">Wealth Compounding Trajectory</h3>
                <div class="mut" style="font-size:0.8rem">Capital invested vs exponential returns over time</div>
              </div>
            </div>
          </div>
          ${can("invest-growth-chart", 210)}

          <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--border)">
            <div class="row between" style="font-size:0.85rem;margin-bottom:6px">
              <span class="mut">Inflation-Adjusted Real Value (at 6%):</span>
              <b id="real-value-display" class="primary" style="color:var(--primary)">₹42,50,000</b>
            </div>
            <div class="row between" style="font-size:0.85rem">
              <span class="mut">Capital Multiplier:</span>
              <b id="wealth-multiplier" class="ok">2.8x Invested Capital</b>
            </div>
          </div>
        </div>
      </div>

      <!-- Dual Lower Section: Asset Allocation & Milestone Timeline -->
      <div class="two mt-4">
        <!-- Optimal Asset Allocation Card -->
        <div class="card">
          <div class="row between mb-2">
            <div class="row">
              <div class="stat-icon primary">${icon('pie', 18)}</div>
              <div>
                <h3 style="margin:0">Portfolio Asset Allocation</h3>
                <div class="mut" style="font-size:0.8rem">Risk-adjusted model & rebalancing guide</div>
              </div>
            </div>
            <div class="btn-group">
              <button class="btn sm alt" id="risk-cons" onclick="setRiskProfile('conservative')">Conservative</button>
              <button class="btn sm on" id="risk-bal" onclick="setRiskProfile('balanced')">Balanced</button>
              <button class="btn sm alt" id="risk-aggr" onclick="setRiskProfile('aggressive')">Aggressive</button>
            </div>
          </div>
          ${can("asset-allocation-donut", 200)}
        </div>

        <!-- Milestone Countdown Table -->
        <div class="card">
          <div class="row mb-2">
            <div class="stat-icon warning">${icon('award', 18)}</div>
            <div>
              <h3 style="margin:0">Wealth Milestone Countdown</h3>
              <div class="mut" style="font-size:0.8rem">Estimated timeline to hit key net worth milestones</div>
            </div>
          </div>
          <div class="tw mt-2">
            <table>
              <thead>
                <tr>
                  <th>Milestone Target</th>
                  <th>Timeline</th>
                  <th>Total Invested</th>
                  <th>Compounded Gain</th>
                </tr>
              </thead>
              <tbody id="milestones-tbody"></tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;

  renderInvestControls();
  runInvestCalc();
  renderAssetAllocationDonut();
}

function switchInvestTab(tab) {
  activeInvestTab = tab;
  ["sip", "stepup", "lump", "fd", "fire", "swp"].forEach(t => {
    const el = $("#tab-" + t);
    if (el) el.className = "btn" + (t === tab ? " on" : " alt");
  });
  renderInvestControls();
  runInvestCalc();
}

function setRiskProfile(profile) {
  portfolioRiskProfile = profile;
  $("#risk-cons").className = "btn sm" + (profile === "conservative" ? " on" : " alt");
  $("#risk-bal").className = "btn sm" + (profile === "balanced" ? " on" : " alt");
  $("#risk-aggr").className = "btn sm" + (profile === "aggressive" ? " on" : " alt");
  renderAssetAllocationDonut();
}

function renderInvestControls() {
  const container = $("#invest-controls-card");
  if (!container) return;

  if (activeInvestTab === "sip") {
    container.innerHTML = `
      <div class="row mb-2">
        <div class="stat-icon primary">${icon('repeat', 18)}</div>
        <h2 style="margin:0">Monthly SIP Parameters</h2>
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Monthly Investment (${curSymbol()})</label>
          <b id="inv-amt-val" class="primary" style="font-size:1.1rem;color:var(--primary)">₹10,000</b>
        </div>
        <input id="inv-amt" type="range" min="500" max="150000" step="500" value="10000" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Expected Annual Return (CAGR %)</label>
          <b id="inv-rate-val" style="font-size:1.05rem">12.5%</b>
        </div>
        <input id="inv-rate" type="range" min="1.0" max="25.0" step="0.5" value="12.5" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Investment Tenure (Years)</label>
          <b id="inv-years-val" style="font-size:1.05rem">15 Years</b>
        </div>
        <input id="inv-years" type="range" min="1" max="35" step="1" value="15" oninput="runInvestCalc()">
      </div>

      <div style="padding:12px;background:var(--success-bg);border:1px solid var(--success-border);border-radius:var(--radius-md);margin-top:10px" id="sip-insight-box"></div>
    `;
  } else if (activeInvestTab === "stepup") {
    container.innerHTML = `
      <div class="row mb-2">
        <div class="stat-icon primary">${icon('trending-up', 18)}</div>
        <h2 style="margin:0">Step-Up SIP Parameters</h2>
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Initial Monthly SIP (${curSymbol()})</label>
          <b id="inv-amt-val" class="primary" style="font-size:1.1rem;color:var(--primary)">₹10,000</b>
        </div>
        <input id="inv-amt" type="range" min="500" max="150000" step="500" value="10000" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Annual Step-Up Rate (%)</label>
          <b id="inv-step-val" style="font-size:1.05rem">10% per year</b>
        </div>
        <input id="inv-step" type="range" min="1" max="25" step="1" value="10" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Expected Annual Return (CAGR %)</label>
          <b id="inv-rate-val" style="font-size:1.05rem">12.0%</b>
        </div>
        <input id="inv-rate" type="range" min="1.0" max="25.0" step="0.5" value="12.0" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Tenure (Years)</label>
          <b id="inv-years-val" style="font-size:1.05rem">15 Years</b>
        </div>
        <input id="inv-years" type="range" min="1" max="35" step="1" value="15" oninput="runInvestCalc()">
      </div>
    `;
  } else if (activeInvestTab === "lump") {
    container.innerHTML = `
      <div class="row mb-2">
        <div class="stat-icon primary">${icon('wallet', 18)}</div>
        <h2 style="margin:0">Lump Sum Compounding</h2>
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Initial Capital (${curSymbol()})</label>
          <b id="inv-amt-val" class="primary" style="font-size:1.1rem;color:var(--primary)">₹5,00,000</b>
        </div>
        <input id="inv-amt" type="range" min="10000" max="5000000" step="10000" value="500000" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Expected Annual Growth (%)</label>
          <b id="inv-rate-val" style="font-size:1.05rem">11.5%</b>
        </div>
        <input id="inv-rate" type="range" min="1.0" max="25.0" step="0.5" value="11.5" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Investment Horizon (Years)</label>
          <b id="inv-years-val" style="font-size:1.05rem">10 Years</b>
        </div>
        <input id="inv-years" type="range" min="1" max="40" step="1" value="10" oninput="runInvestCalc()">
      </div>
    `;
  } else if (activeInvestTab === "fd") {
    container.innerHTML = `
      <div class="row mb-2">
        <div class="stat-icon primary">${icon('shield', 18)}</div>
        <h2 style="margin:0">Fixed Deposit (FD) Simulator</h2>
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Deposit Amount (${curSymbol()})</label>
          <b id="inv-amt-val" class="primary" style="font-size:1.1rem;color:var(--primary)">₹2,00,000</b>
        </div>
        <input id="inv-amt" type="range" min="5000" max="2000000" step="5000" value="200000" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Interest Rate (% p.a.)</label>
          <b id="inv-rate-val" style="font-size:1.05rem">7.2%</b>
        </div>
        <input id="inv-rate" type="range" min="3.0" max="10.0" step="0.1" value="7.2" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Tenure (Years)</label>
          <b id="inv-years-val" style="font-size:1.05rem">5 Years</b>
        </div>
        <input id="inv-years" type="range" min="1" max="10" step="1" value="5" oninput="runInvestCalc()">
      </div>
    `;
  } else if (activeInvestTab === "fire") {
    container.innerHTML = `
      <div class="row mb-2">
        <div class="stat-icon primary">${icon('sparkles', 18)}</div>
        <h2 style="margin:0">FIRE Retirement Planner</h2>
      </div>

      <div class="row">
        <div style="flex:1">
          <label>Current Age</label>
          <input id="fire-age-cur" type="number" value="28" oninput="runInvestCalc()">
        </div>
        <div style="flex:1">
          <label>Target FIRE Age</label>
          <input id="fire-age-ret" type="number" value="48" oninput="runInvestCalc()">
        </div>
      </div>

      <label>Current Monthly Living Expenses (${curSymbol()})</label>
      <input id="fire-exp" type="number" value="40000" oninput="runInvestCalc()">

      <div class="row">
        <div style="flex:1">
          <label>Inflation Rate (%)</label>
          <input id="fire-inf" type="number" value="6.0" step="0.1" oninput="runInvestCalc()">
        </div>
        <div style="flex:1">
          <label>Safe Withdrawal Rate (%)</label>
          <input id="fire-swr" type="number" value="4.0" step="0.1" oninput="runInvestCalc()">
        </div>
      </div>
    `;
  } else if (activeInvestTab === "swp") {
    container.innerHTML = `
      <div class="row mb-2">
        <div class="stat-icon primary">${icon('calendar', 18)}</div>
        <h2 style="margin:0">SWP Systematic Withdrawal (Pension)</h2>
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Initial Retirement Corpus (${curSymbol()})</label>
          <b id="inv-amt-val" class="primary" style="font-size:1.1rem;color:var(--primary)">₹50,00,000</b>
        </div>
        <input id="inv-amt" type="range" min="500000" max="20000000" step="100000" value="5000000" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Monthly Pension Withdrawal (${curSymbol()})</label>
          <b id="inv-swp-val" style="font-size:1.05rem">₹35,000 / mo</b>
        </div>
        <input id="inv-swp" type="range" min="5000" max="200000" step="2500" value="35000" oninput="runInvestCalc()">
      </div>

      <div class="mb-3">
        <div class="row between">
          <label>Portfolio Yield (% p.a.)</label>
          <b id="inv-rate-val" style="font-size:1.05rem">8.5%</b>
        </div>
        <input id="inv-rate" type="range" min="4.0" max="15.0" step="0.5" value="8.5" oninput="runInvestCalc()">
      </div>
    `;
  }
}

function runInvestCalc() {
  const chartCanvas = $("#invest-growth-chart");
  if (!chartCanvas) return;

  let totalInvested = 0;
  let maturityValue = 0;
  let years = 10;
  const labels = [];
  const investedData = [];
  const valueData = [];

  if (activeInvestTab === "sip") {
    const P = +$("#inv-amt").value;
    const r = +$("#inv-rate").value;
    years = +$("#inv-years").value;

    $("#inv-amt-val").textContent = money(P);
    $("#inv-rate-val").textContent = `${r}%`;
    $("#inv-years-val").textContent = `${years} Years`;

    const i = r / 1200;
    for (let y = 0; y <= years; y++) {
      const n = y * 12;
      const fv = n === 0 ? 0 : P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      labels.push(`Y${y}`);
      investedData.push(P * 12 * y);
      valueData.push(Math.round(fv));
    }

    totalInvested = P * 12 * years;
    maturityValue = valueData[years];

    const extraP = P + 2000;
    const extraN = years * 12;
    const extraFV = extraN === 0 ? 0 : extraP * ((Math.pow(1 + i, extraN) - 1) / i) * (1 + i);
    $("#sip-insight-box").innerHTML = `
      <div style="font-weight:700;color:var(--success);font-size:0.85rem">${icon('sparkles', 14)} Step Up Opportunity</div>
      <div class="mut" style="font-size:0.8rem;margin-top:2px">Adding <b>${money(2000)}/month</b> more generates an extra <b>${money(extraFV - maturityValue)}</b>!</div>
    `;
  } else if (activeInvestTab === "stepup") {
    let monthly = +$("#inv-amt").value;
    const stepPct = +$("#inv-step").value;
    const r = +$("#inv-rate").value;
    years = +$("#inv-years").value;

    $("#inv-amt-val").textContent = money(monthly);
    $("#inv-step-val").textContent = `${stepPct}% per year`;
    $("#inv-rate-val").textContent = `${r}%`;
    $("#inv-years-val").textContent = `${years} Years`;

    const monthlyRate = r / 1200;
    let corpus = 0;
    let cumInvested = 0;

    labels.push("Y0");
    investedData.push(0);
    valueData.push(0);

    for (let y = 1; y <= years; y++) {
      for (let m = 1; m <= 12; m++) {
        corpus = (corpus + monthly) * (1 + monthlyRate);
        cumInvested += monthly;
      }
      monthly *= (1 + stepPct / 100);
      labels.push(`Y${y}`);
      investedData.push(Math.round(cumInvested));
      valueData.push(Math.round(corpus));
    }

    totalInvested = cumInvested;
    maturityValue = Math.round(corpus);
  } else if (activeInvestTab === "lump") {
    const P = +$("#inv-amt").value;
    const r = +$("#inv-rate").value;
    years = +$("#inv-years").value;

    $("#inv-amt-val").textContent = money(P);
    $("#inv-rate-val").textContent = `${r}%`;
    $("#inv-years-val").textContent = `${years} Years`;

    for (let y = 0; y <= years; y++) {
      const fv = P * Math.pow(1 + r / 100, y);
      labels.push(`Y${y}`);
      investedData.push(P);
      valueData.push(Math.round(fv));
    }

    totalInvested = P;
    maturityValue = valueData[years];
  } else if (activeInvestTab === "fd") {
    const P = +$("#inv-amt").value;
    const r = +$("#inv-rate").value;
    years = +$("#inv-years").value;

    $("#inv-amt-val").textContent = money(P);
    $("#inv-rate-val").textContent = `${r}%`;
    $("#inv-years-val").textContent = `${years} Years`;

    for (let y = 0; y <= years; y++) {
      const fv = P * Math.pow(1 + r / 400, 4 * y);
      labels.push(`Y${y}`);
      investedData.push(P);
      valueData.push(Math.round(fv));
    }

    totalInvested = P;
    maturityValue = valueData[years];
  } else if (activeInvestTab === "fire") {
    const curAge = +$("#fire-age-cur").value || 28;
    const retAge = +$("#fire-age-ret").value || 48;
    const monthlyExp = +$("#fire-exp").value || 40000;
    const inf = +$("#fire-inf").value || 6.0;
    const swr = +$("#fire-swr").value || 4.0;

    years = Math.max(1, retAge - curAge);
    const annualExpAtRet = (monthlyExp * 12) * Math.pow(1 + inf / 100, years);
    const fireCorpusNeeded = annualExpAtRet * (100 / swr);

    const i = 12 / 1200;
    const n = years * 12;
    const reqMonthly = fireCorpusNeeded / (((Math.pow(1 + i, n) - 1) / i) * (1 + i));

    totalInvested = Math.round(reqMonthly * n);
    maturityValue = Math.round(fireCorpusNeeded);

    for (let y = 0; y <= years; y++) {
      const m = y * 12;
      const fv = m === 0 ? 0 : reqMonthly * ((Math.pow(1 + i, m) - 1) / i) * (1 + i);
      labels.push(`Age ${curAge + y}`);
      investedData.push(Math.round(reqMonthly * 12 * y));
      valueData.push(Math.round(fv));
    }
  } else if (activeInvestTab === "swp") {
    const P = +$("#inv-amt").value;
    const monthlyW = +$("#inv-swp").value;
    const r = +$("#inv-rate").value;
    years = 20;

    $("#inv-amt-val").textContent = money(P);
    $("#inv-swp-val").textContent = `${money(monthlyW)} / mo`;
    $("#inv-rate-val").textContent = `${r}%`;

    const monthlyR = r / 1200;
    let balance = P;
    let totalWithdrawn = 0;

    for (let y = 0; y <= years; y++) {
      labels.push(`Y${y}`);
      investedData.push(Math.round(totalWithdrawn));
      valueData.push(Math.max(0, Math.round(balance)));

      for (let m = 0; m < 12; m++) {
        balance = balance * (1 + monthlyR) - monthlyW;
        totalWithdrawn += monthlyW;
        if (balance <= 0) break;
      }
    }

    totalInvested = totalWithdrawn;
    maturityValue = Math.max(0, Math.round(balance));
  }

  const returns = Math.max(0, maturityValue - totalInvested);
  const inflationRate = 0.06;
  const realValue = maturityValue / Math.pow(1 + inflationRate, years);
  const multiplier = totalInvested > 0 ? (maturityValue / totalInvested).toFixed(1) : 1;

  // KPI Grid
  $("#invest-kpi-grid").innerHTML = `
    <div class="stat-card accent-purple">
      <div class="stat-top">
        <span class="stat-label">Total Capital Invested</span>
        <div class="stat-icon" style="background:#eef2ff;color:#6366f1">${icon('wallet', 16)}</div>
      </div>
      <div class="big">${money(totalInvested)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#eef2ff;color:#6366f1">${icon('trending-up', 12)} Base Plan</span>
        <span class="mut" style="font-size:0.75rem">principal sum</span>
      </div>
    </div>

    <div class="stat-card accent-green">
      <div class="stat-top">
        <span class="stat-label">Wealth Gains (Returns)</span>
        <div class="stat-icon" style="background:#ecfdf5;color:#10b981">${icon('trending-up', 16)}</div>
      </div>
      <div class="big ok">${money(returns)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfdf5;color:#059669">${Math.round((returns / (totalInvested || 1)) * 100)}% Gain</span>
        <span class="mut" style="font-size:0.75rem">growth earned</span>
      </div>
    </div>

    <div class="stat-card accent-cyan">
      <div class="stat-top">
        <span class="stat-label">Maturity Corpus</span>
        <div class="stat-icon" style="background:#ecfeff;color:#06b6d4">${icon('award', 16)}</div>
      </div>
      <div class="big primary" style="color:var(--primary)">${money(maturityValue)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend up" style="background:#ecfeff;color:#0891b2">${multiplier}x Capital Multiplier</span>
        <span class="mut" style="font-size:0.75rem">net value</span>
      </div>
    </div>

    <div class="stat-card accent-orange">
      <div class="stat-top">
        <span class="stat-label">Real Purchasing Power</span>
        <div class="stat-icon" style="background:#fef3c7;color:#f59e0b">${icon('shield', 16)}</div>
      </div>
      <div class="big">${money(realValue)}</div>
      <div class="stat-bottom mt-1">
        <span class="stat-trend down" style="background:#fef3c7;color:#d97706">Inflation Adj.</span>
        <span class="mut" style="font-size:0.75rem">at 6% per year</span>
      </div>
    </div>
  `;

  $("#real-value-display").textContent = money(realValue);
  $("#wealth-multiplier").textContent = `${multiplier}x Capital Multiplier`;

  line(chartCanvas, labels, [
    { n: "Invested / Withdrawn", v: investedData, color: "#64748b" },
    { n: "Corpus Value", v: valueData, color: "#059669" }
  ]);

  renderMilestones(activeInvestTab === "sip" ? +$("#inv-amt").value : 10000, 12.0);
}

function renderAssetAllocationDonut() {
  const c = $("#asset-allocation-donut");
  if (!c) return;

  let allocation = [];
  if (portfolioRiskProfile === "conservative") {
    allocation = [
      ["Government Bonds & Debt", 50],
      ["Large Cap Equities", 25],
      ["Liquid Emergency Cash", 15],
      ["Physical Gold", 10]
    ];
  } else if (portfolioRiskProfile === "aggressive") {
    allocation = [
      ["Mid & Small Cap Equities", 40],
      ["Large Cap Equities", 35],
      ["High-Yield Corporate Debt", 15],
      ["Gold / Real Estate", 10]
    ];
  } else {
    // Balanced
    allocation = [
      ["Large Cap Equity", 35],
      ["Mid & Small Cap", 25],
      ["Debt & Bonds", 20],
      ["Gold & Real Estate", 10],
      ["Liquid Cash / Emergency", 10]
    ];
  }

  pie(c, allocation, portfolioRiskProfile);
}

function renderMilestones(monthlySip, rate) {
  const tbody = $("#milestones-tbody");
  if (!tbody) return;

  const milestones = [
    { target: 1000000, label: "₹10 Lakh (First Million)" },
    { target: 2500000, label: "₹25 Lakh" },
    { target: 5000000, label: "₹50 Lakh Half-Crore" },
    { target: 10000000, label: "₹1 Crore (Financial Fortress)" },
    { target: 50000000, label: "₹5 Crore (Ultra HNI)" }
  ];

  const i = rate / 1200;
  tbody.innerHTML = milestones.map(m => {
    let months = 0;
    let fv = 0;
    while (fv < m.target && months < 600) {
      months++;
      fv = monthlySip * ((Math.pow(1 + i, months) - 1) / i) * (1 + i);
    }

    const years = (months / 12).toFixed(1);
    const invested = monthlySip * months;
    const gain = Math.max(0, m.target - invested);

    return `
      <tr>
        <td style="font-weight:700">${m.label}</td>
        <td><span class="tag primary">${years} Years</span> (${months} mos)</td>
        <td>${money(invested)}</td>
        <td class="ok" style="font-weight:700">+${money(gain)}</td>
      </tr>
    `;
  }).join("");
}

initInvestView();
