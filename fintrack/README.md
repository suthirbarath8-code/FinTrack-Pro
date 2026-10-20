# FinTrack Pro — Enterprise Personal Wealth & Financial Intelligence Platform

FinTrack Pro is a client-side personal finance platform built with an elegant, modern light aesthetic. It requires no backend server or npm packages—simply open `index.html` in any modern web browser.

---

## Key Highlights & Architectural Revamp

1. **Classy Light-Themed Design System**
   - **Typography**: Google Font **Plus Jakarta Sans** (weights 300 to 800) with crisp font-feature settings.
   - **Color Palette**: Sophisticated light dashboard aesthetic featuring royal slate indigo accents, alabaster surfaces, emerald inflow badges, rose outflow indicators, soft borders, and elevated multi-layer drop shadows.
   - **Zero Emojis**: 100% replaced with crisp, inline scalable SVG vector icons.
   - **Smooth Animations**: Micro-interactions, animated entrance keyframes (`fadeInUp`, `scaleIn`), and responsive card hover states.

2. **Dedicated Authentication & Multi-Account Architecture**
   - **Sign In & Sign Up Modals/Pages**: Toggle between signing in and registering a new account.
   - **Real-Time Password Strength Engine**: Interactive 4-tier visual strength meter (evaluating length, uppercase, numbers, and symbols).
   - **Multi-Account Switcher**: Seamlessly switch between user profiles (`Alex Morgan`, `Sarah Jenkins`, or newly registered accounts).
   - **Quick Demo Access**: Instant 1-click access to the demo workspace.

3. **High-DPI Retina Canvas Charts on Every Page**
   - **Income & Expense Tracker**: 30-Day Cash Flow Velocity Line Chart & Inflow vs Outflow Grouped Bar Chart.
   - **Savings Goals & Budgets**: Capital Allocation Donut Chart & Category Budget vs Actual Spend Bar Chart.
   - **Loan & EMI Calculator**: Principal vs Interest Payment Composition Donut Chart & Amortization Balance Curve.
   - **Investment & FIRE Simulator**: Compound Wealth Growth Curve & Asset Allocation Donut Chart.
   - **Bills & Subscriptions**: Subscription Cost by Category Donut Chart & 30-Day Upcoming Payment Horizon Bar Chart.
   - **Reports & Deep Analytics**: Multi-month Inflow vs Outflow Bar Chart, Category Expense Donut, Cumulative Net Reserves Line Chart, and Day-of-Week Expense Activity Chart.
   - **Profile & Health Score**: 180° Animated Radial Speedometer Gauge measuring overall financial health.

4. **Multi-Currency Support**
   - Real-time global currency selector in the top navigation bar:
     - **INR (₹)**
     - **USD ($)**
     - **EUR (€)**
     - **GBP (£)**
     - **JPY (¥)**
     - **AUD (A$)**
     - **CAD (C$)**
   - All monetary figures and charts dynamically re-format based on the selected currency.

5. **Advanced Feature Set by Module**
   - **Tracker**: 1-click quick-entry presets (Coffee, Grocery, Fuel, Freelance, Salary), multi-filter toolbar, column sorting, bulk selection, bulk deletion, bulk CSV export, and pagination controls.
   - **Goals & Budgets**: Circular progress meters, Deposit/Withdraw flows, Goal Velocity Timeline Calculator, and an automated **50/30/20 Smart Budget Optimizer**.
   - **Loan Studio**: Presets for Home, Car, Personal, and Education loans, side-by-side Loan A vs B comparison, monthly prepayment savings calculator, and yearly amortization schedule table.
   - **Investment Simulator**: 5 simulation modes (Monthly SIP, Step-Up SIP, Lump Sum, FD, FIRE Retirement Planner), inflation-adjusted purchasing power, and Net Worth milestone countdowns.
   - **Bills & Subscriptions**: Subscription audit detector, recurrence intervals (weekly, monthly, quarterly, yearly), status badges, snooze by 7 days, and 1-click payment logging directly into the Tracker register.
   - **Reports**: MoM spend diagnostic engine, automated algorithmic financial advice, and official statement print layouts.
   - **Data Management**: Complete workspace JSON export, JSON import & restore, and sample dataset reset.

---

## File Structure

```
fintrack-pro/
├── index.html                  # Root launcher redirecting to fintrack/index.html
└── fintrack/
    ├── index.html              # Main entry point
    ├── tracker.html            # Income & Expense Register
    ├── goals.html              # Savings Goals & Category Budgets
    ├── loan.html               # Loan & EMI Calculator Studio
    ├── invest.html             # Investment, SIP & FIRE Simulator
    ├── bills.html              # Bills & Subscription Manager
    ├── reports.html            # Analytics & Executive Reports
    ├── profile.html            # User Profile, Health Score & Data Management
    ├── auth.html               # Dedicated Sign-In & Sign-Up Page
    ├── README.md               # Detailed documentation
    ├── css/
    │   └── style.css           # Modern light design system & responsive styling
    └── js/
        ├── common.js           # Core engine, SVG icons, Canvas charts, storage & nav
        ├── tracker.js          # Tracker logic, filters, presets, pagination
        ├── goals.js            # Goals & 50/30/20 budget generator
        ├── loan.js             # EMI calculator, comparison & prepayment analysis
        ├── invest.js           # 5 investment modes, wealth curve, asset allocation
        ├── bills.js            # Subscriptions manager & 1-click payment logger
        ├── reports.js          # Deep analytics & diagnostics engine
        └── profile.js          # Auth engine, password meter & health scorecard
```

---

## Quick Start

1. Open `fintrack/index.html` or `index.html` in any browser (Chrome, Edge, Firefox, Safari).
2. Click **"Try Demo Account"** to immediately explore the pre-seeded multi-month data.
3. Use the keyboard shortcut **`N`** on any page to open the **Quick Add Transaction** modal.
