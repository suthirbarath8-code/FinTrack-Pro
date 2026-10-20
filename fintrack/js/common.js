/* ==========================================================================
   FinTrack Pro - Core Common Library & Component Engine
   - 100% SVG Icons (Zero Emojis)
   - Transparent Sticky Navbar with Glassmorphism Blur on Scroll
   - Interactive Canvas Wave Charts with Hover Tooltip & Crosshairs
   - Multi-Segment Semi-Circular Radial Gauges with Growth Tags
   - Realistic 3D Stacked Credit Cards Widget
   - Dynamic Currency Math (INR, USD, EUR, GBP, JPY, AUD, CAD)
   ========================================================================== */

// --- Storage Utilities ---
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

const get = (k, d) => {
  try {
    const v = JSON.parse(localStorage.getItem('fintrack_' + k));
    return v === null || v === undefined ? d : v;
  } catch (e) {
    return d;
  }
};

const set = (k, v) => {
  try {
    localStorage.setItem('fintrack_' + k, JSON.stringify(v));
  } catch (e) {
    console.error('Storage error', e);
  }
};

// --- Dynamic Currency & Formatting ---
const CURRENCIES = {
  INR: { symbol: '₹', name: 'Indian Rupee (INR)', locale: 'en-IN' },
  USD: { symbol: '$', name: 'US Dollar (USD)', locale: 'en-US' },
  EUR: { symbol: '€', name: 'Euro (EUR)', locale: 'de-DE' },
  GBP: { symbol: '£', name: 'British Pound (GBP)', locale: 'en-GB' },
  JPY: { symbol: '¥', name: 'Japanese Yen (JPY)', locale: 'ja-JP' },
  AUD: { symbol: 'A$', name: 'Australian Dollar (AUD)', locale: 'en-AU' },
  CAD: { symbol: 'C$', name: 'Canadian Dollar (CAD)', locale: 'en-CA' }
};

const getCur = () => get('currency', 'INR');
const curSymbol = () => (CURRENCIES[getCur()] || CURRENCIES.INR).symbol;

function money(n, decimals = 0) {
  const val = Number(n) || 0;
  const cur = CURRENCIES[getCur()] || CURRENCIES.INR;
  const formatted = decimals > 0 
    ? val.toLocaleString(cur.locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : Math.round(val).toLocaleString(cur.locale);
  return `${cur.symbol}${formatted}`;
}

const addDays = (n) => {
  const d = new Date(Date.now() + n * 864e5);
  return d.toISOString().slice(0, 10);
};

const today = () => addDays(0);
const mk = () => today().slice(0, 7);

// --- 100% SVG Icon Library (Zero Emojis) ---
const SVG_ICONS = {
  logo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`,
  chart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>`,
  wallet: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a8 8 0 0 1-8 8H5a2 2 0 0 1-2-2V6"/></svg>`,
  target: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
  pie: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  bell: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>`,
  plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  'arrow-up-right': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>`,
  'arrow-down-left': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 17H7V7"/><path d="m17 7-10 10"/></svg>`,
  tag: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r=".5" fill="currentColor"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
  trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>`,
  edit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/></svg>`,
  check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
  x: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  download: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>`,
  upload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
  'credit-card': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>`,
  'trending-up': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  'trending-down': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 17 13.5 8.5 8.5 13.5 2 7"/><polyline points="16 17 22 17 22 11"/></svg>`,
  percent: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" x2="5" y1="5" y2="19"/><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>`,
  clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  repeat: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>`,
  'alert-circle': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
  eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
  'eye-off': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/></svg>`,
  briefcase: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>`,
  coffee: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v2"/><path d="M14 2v2"/><path d="M17 8h1a4 4 0 0 1 0 8h-1"/><path d="M6 4h12v9a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4Z"/><line x1="6" x2="18" y1="21" y2="21"/></svg>`,
  shopping: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>`,
  zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
  award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  sparkles: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3Z"/></svg>`,
  'log-out': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>`,
  'log-in': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" x2="3" y1="12" y2="12"/></svg>`,
  refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21h5v-5"/></svg>`,
  laptop: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/></svg>`,
  compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
  book: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
  'chevron-down': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`
};

function icon(name, size = 18, className = '') {
  const svg = SVG_ICONS[name] || SVG_ICONS['tag'];
  return `<span class="svg-icon ${className}" style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;">${svg.replace('<svg', `<svg width="${size}" height="${size}"`)}</span>`;
}

// Category Mapping & SVG Association
const CATS = ["Food", "Rent", "Travel", "Bills", "Shopping", "Fun", "Salary", "Investment", "Health", "Freelance", "Other"];
const CAT_ICONS = {
  Food: 'coffee',
  Rent: 'home',
  Travel: 'car',
  Bills: 'zap',
  Shopping: 'shopping',
  Fun: 'sparkles',
  Salary: 'wallet',
  Investment: 'trending-up',
  Health: 'shield',
  Freelance: 'briefcase',
  Other: 'tag'
};

const COL = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#8b5cf6", "#14b8a6", "#f97316", "#3b82f6", "#ec4899", "#64748b"];

// Toast Notification
function toast(m, type = 'info') {
  let t = $("#toast");
  if (!t) {
    t = document.createElement("div");
    t.id = "toast";
    document.body.appendChild(t);
  }
  const iconName = type === 'success' ? 'check' : type === 'error' ? 'alert-circle' : 'sparkles';
  t.innerHTML = `${icon(iconName, 18)} <span>${m}</span>`;
  t.className = "show";
  clearTimeout(t.timer);
  t.timer = setTimeout(() => {
    t.className = "";
  }, 2600);
}

// --- Rich Multi-Month Seed Data ---
function seed() {
  if (get("seeded_v5")) return;
  const d = (m, day) => {
    const t = new Date();
    t.setDate(1);
    t.setMonth(t.getMonth() - m);
    t.setDate(m ? day : Math.min(day, new Date().getDate()));
    return t.toISOString().slice(0, 10);
  };

  const tx = [];
  let id = 1000;

  [0, 1, 2].forEach(m => {
    tx.push(
      { id: id++, type: "income", amt: 65000, cat: "Salary", date: d(m, 1), note: "Monthly Primary Salary", method: "Net Banking", tag: "#salary" },
      { id: id++, type: "income", amt: 15000, cat: "Freelance", date: d(m, 12), note: "Client Consulting Gig", method: "UPI", tag: "#freelance" },
      { id: id++, type: "expense", amt: 18000, cat: "Rent", date: d(m, 2), note: "Apartment Rent & Maintenance", method: "Net Banking", tag: "#housing" },
      { id: id++, type: "expense", amt: 4800 + m * 300, cat: "Food", date: d(m, 4), note: "Organic Supermarket", method: "Credit Card", tag: "#essentials" },
      { id: id++, type: "expense", amt: 2200, cat: "Travel", date: d(m, 6), note: "Metro & Fuel Refill", method: "UPI", tag: "#commute" },
      { id: id++, type: "expense", amt: 3500 + m * 400, cat: "Shopping", date: d(m, 8), note: "Wardrobe & Supplies", method: "Credit Card", tag: "#lifestyle" },
      { id: id++, type: "expense", amt: 1950, cat: "Bills", date: d(m, 10), note: "Fiber High-Speed Internet", method: "UPI", tag: "#utilities" },
      { id: id++, type: "expense", amt: 1400, cat: "Fun", date: d(m, 14), note: "Cinema & Weekend Dinner", method: "Debit Card", tag: "#leisure" },
      { id: id++, type: "expense", amt: 10000, cat: "Investment", date: d(m, 15), note: "Nifty Index Fund SIP", method: "Auto-Debit", tag: "#wealth" },
      { id: id++, type: "expense", amt: 1850, cat: "Health", date: d(m, 18), note: "Vitamins & Dental Care", method: "UPI", tag: "#health" }
    );
  });

  set("tx", tx);

  set("goals", [
    { id: 1, name: "Emergency Fund", iconName: "shield", target: 150000, saved: 95000, priority: "High", targetDate: addDays(120), category: "Safety" },
    { id: 2, name: "MacBook Pro M3", iconName: "laptop", target: 140000, saved: 75000, priority: "Medium", targetDate: addDays(60), category: "Gadgets" },
    { id: 3, name: "Japan Summer Trip", iconName: "compass", target: 200000, saved: 62000, priority: "Low", targetDate: addDays(180), category: "Travel" },
    { id: 4, name: "New Electric Car", iconName: "car", target: 500000, saved: 120000, priority: "Medium", targetDate: addDays(365), category: "Vehicle" }
  ]);

  set("budgets", {
    Food: 7500,
    Shopping: 6000,
    Travel: 4500,
    Fun: 4000,
    Bills: 3500,
    Health: 3000
  });

  set("bills", [
    { id: 1, name: "Apartment Rent", amt: 18000, due: addDays(4), rep: "monthly", paid: false, sub: false, category: "Housing" },
    { id: 2, name: "Netflix Premium 4K", amt: 649, due: addDays(2), rep: "monthly", paid: false, sub: true, category: "Streaming" },
    { id: 3, name: "Gym & Fitness Club", amt: 1500, due: addDays(9), rep: "monthly", paid: false, sub: true, category: "Health" },
    { id: 4, name: "Airtel Fiber Broadband", amt: 999, due: addDays(14), rep: "monthly", paid: false, sub: true, category: "Utilities" },
    { id: 5, name: "Cloud Backup 2TB", amt: 220, due: addDays(-2), rep: "monthly", paid: false, sub: true, category: "Software" }
  ]);

  set("users", [
    { name: "Alex Morgan", email: "alex.morgan@fintrack.pro", pass: "Password123!", role: "Pro Member", currency: "INR", avatar: "exec" },
    { name: "Sarah Jenkins", email: "sarah.j@fintrack.pro", pass: "Password123!", role: "Investor", currency: "USD", avatar: "invest" }
  ]);

  if (!get("user")) {
    set("user", { name: "Alex Morgan", email: "alex.morgan@fintrack.pro", role: "Pro Member", currency: "INR", avatar: "exec" });
  }

  set("seeded_v5", 1);
}

seed();

const tx = () => get("tx", []);
const sum = (l, t) => l.filter(x => x.type === t).reduce((s, x) => s + x.amt, 0);
const byCat = l => {
  const o = {};
  l.filter(x => x.type === "expense").forEach(x => {
    o[x.cat] = (o[x.cat] || 0) + x.amt;
  });
  return o;
};

function addTx(o) {
  const l = tx();
  const newTx = {
    id: Date.now(),
    date: today(),
    method: "UPI",
    tag: "#general",
    ...o
  };
  l.unshift(newTx);
  set("tx", l);
  return newTx;
}

// Navigation Pages
const PAGES = [
  { id: "tracker", title: "Tracker", icon: "wallet" },
  { id: "goals", title: "Goals", icon: "target" },
  { id: "loan", title: "Loan", icon: "percent" },
  { id: "invest", title: "Invest", icon: "trending-up" },
  { id: "bills", title: "Bills", icon: "calendar" },
  { id: "reports", title: "Reports", icon: "chart" },
  { id: "profile", title: "Profile", icon: "user" }
];

const currentPg = location.pathname.split("/").pop().replace(".html", "") || "tracker";
const isAuthPage = currentPg === "login" || currentPg === "signup" || currentPg === "auth";
if (!get("user") && !isAuthPage) {
  location.href = "login.html";
}

// Render Transparent Sticky Navigation Bar (Logo-free clean typography)
function renderNav() {
  const navContainer = $("#nav");
  if (!navContainer) return;

  const user = get("user");
  const bills = get("bills", []);
  const overdueCount = bills.filter(b => !b.paid && b.due < today()).length;
  const currentCur = getCur();

  navContainer.innerHTML = `
    <nav>
      <div class="nav-container">
        <!-- Clean Logo-Free Branding -->
        <a class="brand-clean" href="tracker.html">
          FinTrack<span class="brand-accent">Pro</span>
        </a>

        <!-- Page Links with Responsive Touch Scroll -->
        <div class="nav-links">
          ${PAGES.map(p => `
            <a href="${p.id}.html" class="${currentPg === p.id ? 'on' : ''}">
              ${icon(p.icon, 16)}
              <span class="link-text">${p.title}</span>
            </a>
          `).join("")}
        </div>

        <!-- Action Controls -->
        <div class="nav-actions">
          <button class="btn sm" onclick="openQuickAddModal()" title="Add Transaction (+)">
            ${icon('plus', 16)}
            <span class="link-text">Add</span>
          </button>

          <select class="nav-currency-select" onchange="changeCurrency(this.value)" title="Change Currency">
            ${Object.keys(CURRENCIES).map(c => `
              <option value="${c}" ${c === currentCur ? 'selected' : ''}>${c} (${CURRENCIES[c].symbol})</option>
            `).join("")}
          </select>

          <!-- Notification Menu -->
          <div style="position:relative">
            <button class="btn alt icon-only" onclick="toggleNotifications()" title="Notifications">
              ${icon('bell', 16)}
              ${overdueCount > 0 ? `<span style="position:absolute;top:-4px;right:-4px;width:17px;height:17px;background:var(--danger);color:#fff;border-radius:50%;font-size:10px;font-weight:700;display:flex;align-items:center;justify-content:center">${overdueCount}</span>` : ''}
            </button>
            <div id="nav-notif-menu" class="notification-menu" style="display:none">
              <div style="font-weight:700;padding:4px 8px 8px;border-bottom:1px solid var(--border);display:flex;justify-content:space-between">
                <span>Alerts & Reminders</span>
                <span class="tag ${overdueCount > 0 ? 'danger' : 'success'}">${overdueCount} urgent</span>
              </div>
              <div id="notif-items" style="max-height:220px;overflow-y:auto;padding-top:6px">
                ${bills.filter(b => !b.paid).map(b => `
                  <div class="notification-item">
                    <div style="color:${b.due < today() ? 'var(--danger)' : 'var(--warning)'};margin-top:2px">
                      ${icon('clock', 16)}
                    </div>
                    <div style="flex:1">
                      <div style="font-weight:600">${b.name}</div>
                      <div class="mut" style="font-size:0.75rem">${b.due < today() ? 'Overdue since ' : 'Due on '}${b.due} • ${money(b.amt)}</div>
                    </div>
                  </div>
                `).join("") || `<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.85rem">All bills are up to date!</div>`}
              </div>
            </div>
          </div>

          <!-- User Pill / Auth Links -->
          ${user ? `
            <a href="profile.html" class="nav-user-pill" title="Profile & Settings">
              <div class="nav-avatar-icon">
                ${icon('user', 15)}
              </div>
              <span class="nav-user-name">${user.name.split(" ")[0]}</span>
            </a>
          ` : `
            <a href="login.html" class="btn alt sm">Sign In</a>
            <a href="signup.html" class="btn sm">Sign Up</a>
          `}
        </div>
      </div>
    </nav>
  `;
}

renderNav();

// --- Sticky Transparent Navbar with Blur Transition on Scroll ---
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (nav) {
    if (window.scrollY > 12) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }
}, { passive: true });

function changeCurrency(cur) {
  set('currency', cur);
  toast(`Currency changed to ${CURRENCIES[cur].name}`, 'success');
  setTimeout(() => location.reload(), 250);
}

function toggleNotifications() {
  const m = $("#nav-notif-menu");
  if (m) m.style.display = m.style.display === "none" ? "block" : "none";
}

document.addEventListener('click', (e) => {
  const m = $("#nav-notif-menu");
  if (m && m.style.display === "block" && !e.target.closest(".nav-actions")) {
    m.style.display = "none";
  }
});

// --- Realistic 3D Stacked Credit Cards Widget Generator ---
function renderMyCardsWidget(cardholder = "Ethan Cole", last4 = "7824", balance = 55501) {
  return `
    <div class="card" style="padding:20px;height:100%;display:flex;flex-direction:column;justify-content:space-between">
      <div class="row between mb-2">
        <h3 style="margin:0">My Cards</h3>
        <button class="btn alt sm" onclick="toast('New card application simulated', 'info')">+ Add new card</button>
      </div>

      <div class="credit-card-widget">
        <!-- Purple card behind -->
        <div class="credit-card-back"></div>

        <!-- Front clean white card with contactless & chip -->
        <div class="credit-card-front">
          <div class="row between">
            <span style="font-size:0.75rem;font-weight:800;letter-spacing:1px;color:var(--text-muted)">DEBIT CARD</span>
            <div class="svg-icon" style="color:#64748b;transform:rotate(90deg)">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 10a10 10 0 0 1 20 0"/><path d="M6 14a6 6 0 0 1 12 0"/></svg>
            </div>
          </div>

          <div class="row gap-md" style="align-items:center;margin:6px 0">
            <div class="card-chip"></div>
          </div>

          <div class="card-number-display">
            •••• •••• ${last4}
          </div>

          <div class="row between" style="font-size:0.78rem;font-weight:700">
            <div>
              <div class="mut" style="font-size:0.65rem">CARD HOLDER</div>
              <span>${cardholder}</span>
            </div>
            <div class="card-brand-circles">
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      </div>

      <div class="row between mt-3" style="font-size:0.85rem">
        <span class="mut">Primary Card Balance</span>
        <b class="primary">${money(balance)}</b>
      </div>
    </div>
  `;
}

// --- Global Quick Add Modal ---
function openQuickAddModal() {
  let modal = $("#quick-add-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "quick-add-modal";
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="modal-overlay" onclick="if(event.target===this)closeQuickAddModal()">
      <div class="modal-content">
        <button class="modal-close" onclick="closeQuickAddModal()">${icon('x', 16)}</button>
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:18px">
          <div class="stat-icon primary">${icon('plus', 20)}</div>
          <div>
            <h2 style="margin:0;font-size:1.2rem">Quick Add Transaction</h2>
            <div class="mut" style="font-size:0.82rem">Record expense, income, or investment</div>
          </div>
        </div>

        <div class="preset-pills">
          <div class="preset-pill" onclick="quickFillTx('expense', 150, 'Food', 'Coffee & Croissant', '#food')">${icon('coffee', 14)} Coffee (150)</div>
          <div class="preset-pill" onclick="quickFillTx('expense', 1250, 'Food', 'Grocery Supermarket', '#essentials')">${icon('shopping', 14)} Grocery (1.25k)</div>
          <div class="preset-pill" onclick="quickFillTx('expense', 2000, 'Travel', 'Fuel refill', '#fuel')">${icon('car', 14)} Fuel (2k)</div>
          <div class="preset-pill" onclick="quickFillTx('income', 15000, 'Freelance', 'Design gig payout', '#freelance')">${icon('briefcase', 14)} Freelance (15k)</div>
        </div>

        <div class="row">
          <div style="flex:1">
            <label>Type</label>
            <select id="modal-type">
              <option value="expense">Expense (-)</option>
              <option value="income">Income (+)</option>
              <option value="investment">Investment</option>
            </select>
          </div>
          <div style="flex:1">
            <label>Amount (${curSymbol()})</label>
            <input id="modal-amt" type="number" placeholder="0.00" step="any" required>
          </div>
        </div>

        <div class="row">
          <div style="flex:1">
            <label>Category</label>
            <select id="modal-cat">
              ${CATS.map(c => `<option value="${c}">${c}</option>`).join("")}
            </select>
          </div>
          <div style="flex:1">
            <label>Date</label>
            <input id="modal-date" type="date" value="${today()}">
          </div>
        </div>

        <div class="row">
          <div style="flex:1">
            <label>Payment Method</label>
            <select id="modal-method">
              <option>UPI</option>
              <option>Credit Card</option>
              <option>Debit Card</option>
              <option>Net Banking</option>
              <option>Cash</option>
            </select>
          </div>
          <div style="flex:1">
            <label>Tag</label>
            <input id="modal-tag" placeholder="#personal">
          </div>
        </div>

        <label>Note / Description</label>
        <input id="modal-note" placeholder="What was this for?">

        <div class="row between" style="margin-top:14px">
          <button class="btn alt" onclick="closeQuickAddModal()">Cancel</button>
          <button class="btn" onclick="saveQuickAddModal()">${icon('check', 16)} Save Transaction</button>
        </div>
      </div>
    </div>
  `;
  setTimeout(() => $("#modal-amt")?.focus(), 100);
}

function quickFillTx(type, amt, cat, note, tag = '#general') {
  if ($("#modal-type")) $("#modal-type").value = type;
  if ($("#modal-amt")) $("#modal-amt").value = amt;
  if ($("#modal-cat")) $("#modal-cat").value = cat;
  if ($("#modal-note")) $("#modal-note").value = note;
  if ($("#modal-tag")) $("#modal-tag").value = tag;
}

function closeQuickAddModal() {
  const m = $("#quick-add-modal");
  if (m) m.innerHTML = "";
}

function saveQuickAddModal() {
  const amt = +$("#modal-amt").value;
  if (!(amt > 0)) return toast("Please enter a valid amount above 0", "error");
  const type = $("#modal-type").value;
  const cat = $("#modal-cat").value;
  const date = $("#modal-date").value || today();
  const method = $("#modal-method").value;
  const tag = $("#modal-tag").value.trim() || "#general";
  const note = $("#modal-note").value.trim() || cat;

  addTx({ type, amt, cat, date, method, tag, note });
  toast("Transaction successfully added!", "success");
  closeQuickAddModal();

  if (typeof draw === 'function') {
    draw();
  } else if (typeof run === 'function') {
    run();
  } else {
    setTimeout(() => location.reload(), 300);
  }
}

document.addEventListener('keydown', (e) => {
  if ((e.key === 'n' || e.key === 'N') && !['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
    e.preventDefault();
    openQuickAddModal();
  }
});

let resizeDebounce = null;
window.addEventListener('resize', () => {
  clearTimeout(resizeDebounce);
  resizeDebounce = setTimeout(() => {
    if (typeof draw === 'function') draw();
    if (typeof run === 'function') run();
    if (typeof runLoanCalc === 'function') runLoanCalc();
    if (typeof runInvestCalc === 'function') runInvestCalc();
  }, 200);
});

// ==========================================================================
// High-DPI Canvas Rendering Engine (Retina Ready, Smooth Bezier Wave Curves)
// ==========================================================================

function cv(c) {
  const dpr = window.devicePixelRatio || 1;
  const rect = c.getBoundingClientRect();
  const width = rect.width || c.width || 320;
  const height = rect.height || c.height || 200;

  c.width = width * dpr;
  c.height = height * dpr;
  c.style.width = width + "px";
  c.style.height = height + "px";

  const ctx = c.getContext("2d");
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, width, height);
  ctx.font = "500 12px 'Plus Jakarta Sans', system-ui, sans-serif";
  ctx.fillStyle = "#334155";
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  return { ctx, width, height, dpr };
}

// Donut / Pie Chart with subtle hole and center stats
function pie(c, it, centerLabel = "Total") {
  const { ctx, width, height } = cv(c);
  const total = it.reduce((s, i) => s + i[1], 0);

  if (!total) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText("No spending data available", width / 2, height / 2);
    return;
  }

  const isSmallScreen = width < 420;
  const radius = isSmallScreen ? Math.min(width * 0.22, height * 0.38) : Math.min(width * 0.28, height * 0.44);
  const innerRadius = radius * 0.62;
  const cx = isSmallScreen ? radius + 12 : radius + 24;
  const cy = height / 2;

  let angle = -Math.PI / 2;

  it.forEach((v, i) => {
    const sliceAngle = (v[1] / total) * (Math.PI * 2);
    ctx.beginPath();
    ctx.arc(cx, cy, radius, angle, angle + sliceAngle);
    ctx.arc(cx, cy, innerRadius, angle + sliceAngle, angle, true);
    ctx.closePath();
    ctx.fillStyle = COL[i % COL.length];
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#ffffff";
    ctx.stroke();
    angle += sliceAngle;
  });

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#64748b";
  ctx.font = isSmallScreen ? "600 10px 'Plus Jakarta Sans', sans-serif" : "600 11px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(centerLabel, cx, cy - 8);
  ctx.fillStyle = "#0f172a";
  ctx.font = isSmallScreen ? "700 11px 'Plus Jakarta Sans', sans-serif" : "700 13px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(money(total), cx, cy + 8);

  const legendX = cx + radius + (isSmallScreen ? 14 : 24);
  const maxLegendItems = Math.min(it.length, isSmallScreen ? 5 : 6);
  const itemHeight = Math.min(22, (height - 16) / maxLegendItems);

  it.slice(0, maxLegendItems).forEach((v, i) => {
    const ly = 20 + i * itemHeight;
    ctx.beginPath();
    ctx.arc(legendX + 5, ly, 4, 0, Math.PI * 2);
    ctx.fillStyle = COL[i % COL.length];
    ctx.fill();

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#0f172a";
    ctx.font = isSmallScreen ? "600 10.5px 'Plus Jakarta Sans', sans-serif" : "600 11.5px 'Plus Jakarta Sans', sans-serif";
    const percent = Math.round((v[1] / total) * 100);
    ctx.fillText(`${v[0]}`, legendX + 14, ly);

    ctx.textAlign = "right";
    ctx.fillStyle = "#64748b";
    ctx.fillText(`${percent}%`, width - 8, ly);
  });
}

// Modern Bar Chart (Single or Grouped) with Rounded Tops
function bars(c, labels, series, options = {}) {
  const { ctx, width, height } = cv(c);
  if (!labels.length) return;

  const isMulti = Array.isArray(series[0]);
  const dataGroups = isMulti ? series : [series];
  const allValues = dataGroups.flat();
  const maxVal = Math.max(1, ...allValues) * 1.15;

  const isSmallScreen = width < 420;
  const paddingBottom = 28;
  const paddingTop = 20;
  const paddingLeft = 10;
  const paddingRight = 10;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;
  const groupW = chartW / labels.length;

  ctx.strokeStyle = "#f1f5f9";
  ctx.lineWidth = 1;
  for (let g = 0; g <= 3; g++) {
    const y = paddingTop + (chartH / 3) * g;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();
  }

  labels.forEach((label, i) => {
    const groupX = paddingLeft + i * groupW;
    const numBars = dataGroups.length;
    const barWidth = Math.max(6, (groupW * 0.65) / numBars);
    const spacing = 3;

    dataGroups.forEach((dataset, k) => {
      const val = dataset[i] || 0;
      const barH = (val / maxVal) * chartH;
      const barX = groupX + (groupW - (numBars * barWidth + (numBars - 1) * spacing)) / 2 + k * (barWidth + spacing);
      const barY = paddingTop + chartH - barH;

      ctx.fillStyle = k === 0 ? "#6366f1" : "#10b981";
      ctx.beginPath();
      const r = Math.min(3, barWidth / 2);
      ctx.moveTo(barX, paddingTop + chartH);
      ctx.lineTo(barX, barY + r);
      ctx.quadraticCurveTo(barX, barY, barX + r, barY);
      ctx.lineTo(barX + barWidth - r, barY);
      ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + r);
      ctx.lineTo(barX + barWidth, paddingTop + chartH);
      ctx.closePath();
      ctx.fill();
    });

    ctx.fillStyle = "#64748b";
    ctx.textAlign = "center";
    ctx.font = isSmallScreen ? "600 9.5px 'Plus Jakarta Sans', sans-serif" : "600 11px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(label, groupX + groupW / 2, height - 8);
  });
}

// Smooth Wave Curves Chart (As in "Your Assets" in reference image) with Interactive Hover Tooltip
function line(c, labels, series) {
  const { ctx, width, height } = cv(c);
  if (!labels.length) return;

  const all = series.flatMap(s => s.v);
  const max = Math.max(1, ...all);
  const min = Math.min(0, ...all);
  const range = max - min || 1;

  const isSmallScreen = width < 420;
  const pLeft = isSmallScreen ? 34 : 44;
  const pRight = 14;
  const pTop = 30;
  const pBottom = 26;

  const W = width - pLeft - pRight;
  const H = height - pTop - pBottom;

  const X = i => pLeft + (i / Math.max(1, labels.length - 1)) * W;
  const Y = v => pTop + H - ((v - min) / range) * H;

  // Background Grid
  ctx.strokeStyle = "#f1f5f9";
  ctx.lineWidth = 1;
  for (let g = 0; g <= 3; g++) {
    const gy = pTop + (H / 3) * g;
    ctx.beginPath();
    ctx.moveTo(pLeft, gy);
    ctx.lineTo(width - pRight, gy);
    ctx.stroke();

    const gVal = max - (range / 3) * g;
    ctx.fillStyle = "#94a3b8";
    ctx.textAlign = "right";
    ctx.font = "500 9.5px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(money(gVal), pLeft - 6, gy + 3);
  }

  // Draw Smooth Bézier Wave Curves & Translucent Gradient Area Fills
  series.forEach((s, k) => {
    const col = s.color || (k === 0 ? "#06b6d4" : "#f59e0b");

    // Area Fill Gradient
    const grad = ctx.createLinearGradient(0, pTop, 0, pTop + H);
    grad.addColorStop(0, `${col}33`);
    grad.addColorStop(1, `${col}00`);

    ctx.beginPath();
    ctx.moveTo(X(0), pTop + H);
    
    // Smooth Bezier Curve through points
    ctx.lineTo(X(0), Y(s.v[0]));
    for (let i = 0; i < s.v.length - 1; i++) {
      const xc = (X(i) + X(i + 1)) / 2;
      const yc = (Y(s.v[i]) + Y(s.v[i + 1])) / 2;
      ctx.quadraticCurveTo(X(i), Y(s.v[i]), xc, yc);
    }
    const lastIdx = s.v.length - 1;
    ctx.lineTo(X(lastIdx), Y(s.v[lastIdx]));
    ctx.lineTo(X(lastIdx), pTop + H);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Curve Line
    ctx.beginPath();
    ctx.moveTo(X(0), Y(s.v[0]));
    for (let i = 0; i < s.v.length - 1; i++) {
      const xc = (X(i) + X(i + 1)) / 2;
      const yc = (Y(s.v[i]) + Y(s.v[i + 1])) / 2;
      ctx.quadraticCurveTo(X(i), Y(s.v[i]), xc, yc);
    }
    ctx.lineTo(X(lastIdx), Y(s.v[lastIdx]));
    ctx.strokeStyle = col;
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Data points markers
    s.v.forEach((val, i) => {
      ctx.beginPath();
      ctx.arc(X(i), Y(val), 3, 0, Math.PI * 2);
      ctx.fillStyle = "#ffffff";
      ctx.fill();
      ctx.strokeStyle = col;
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // Top Legend
    ctx.fillStyle = col;
    ctx.textAlign = "left";
    ctx.font = "700 11px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(`● ${s.n}`, pLeft + k * 110, 16);
  });

  // X Axis Labels
  ctx.fillStyle = "#64748b";
  ctx.textAlign = "center";
  ctx.font = "600 10px 'Plus Jakarta Sans', sans-serif";
  const step = Math.ceil(labels.length / (isSmallScreen ? 4 : 8));
  labels.forEach((l, i) => {
    if (i % step === 0 || i === labels.length - 1) {
      ctx.fillText(l, X(i), height - 6);
    }
  });

  // Attach Mouse Interactive Hover Indicator (Crosshair & Floating Badge)
  c.onmousemove = (e) => {
    const rect = c.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const clampedMx = Math.max(pLeft, Math.min(width - pRight, mx));
    const ratio = (clampedMx - pLeft) / W;
    const closestIdx = Math.round(ratio * (labels.length - 1));

    // Redraw with highlight dot and vertical guide line
    ctx.save();
    ctx.strokeStyle = "#cbd5e1";
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(X(closestIdx), pTop);
    ctx.lineTo(X(closestIdx), pTop + H);
    ctx.stroke();
    ctx.restore();

    // Show floating tooltip
    let tooltip = $("#chart-floating-tooltip");
    if (!tooltip) {
      tooltip = document.createElement("div");
      tooltip.id = "chart-floating-tooltip";
      tooltip.className = "canvas-tooltip";
      document.body.appendChild(tooltip);
    }
    
    let tooltipContent = `<div style="font-size:0.75rem;color:#94a3b8;margin-bottom:3px">${labels[closestIdx]}</div>`;
    series.forEach((s, k) => {
      const col = s.color || (k === 0 ? "#06b6d4" : "#f59e0b");
      tooltipContent += `<div><span style="color:${col}">●</span> <b>${s.n}:</b> ${money(s.v[closestIdx])}</div>`;
    });
    tooltip.innerHTML = tooltipContent;
    tooltip.style.display = "block";
    tooltip.style.left = `${rect.left + X(closestIdx)}px`;
    tooltip.style.top = `${rect.top + Y(series[0].v[closestIdx]) - 10}px`;
  };

  c.onmouseleave = () => {
    const tooltip = $("#chart-floating-tooltip");
    if (tooltip) tooltip.style.display = "none";
  };
}

// 180° Radial Multi-Segment Speedometer Gauge (Transaction View Style)
function gauge(c, score) {
  const { ctx, width, height } = cv(c);
  const cx = width / 2;
  const cy = height - 20;
  const r = Math.min(width * 0.38, height * 0.72);

  // Background Arc Track
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#f1f5f9";
  ctx.lineCap = "round";
  ctx.stroke();

  // Multi-Segment Colored Track (Purple, Emerald, Gold as in reference design)
  const segments = [
    { start: Math.PI, end: Math.PI + Math.PI * 0.33, color: "#6366f1" },
    { start: Math.PI + Math.PI * 0.33, end: Math.PI + Math.PI * 0.66, color: "#10b981" },
    { start: Math.PI + Math.PI * 0.66, end: Math.PI * 2, color: "#f59e0b" }
  ];

  segments.forEach(seg => {
    ctx.beginPath();
    ctx.arc(cx, cy, r, seg.start, seg.end);
    ctx.lineWidth = 14;
    ctx.strokeStyle = seg.color;
    ctx.lineCap = "butt";
    ctx.stroke();
  });

  // Active Score Needle Indicator
  const targetAngle = Math.PI + (Math.PI * (score / 100));
  ctx.beginPath();
  ctx.arc(cx, cy, r, Math.PI, targetAngle);
  ctx.lineWidth = 16;
  ctx.strokeStyle = "#4f46e5";
  ctx.lineCap = "round";
  ctx.stroke();

  // Center Score Counter
  ctx.textAlign = "center";
  ctx.fillStyle = "#0f172a";
  ctx.font = "800 32px 'Plus Jakarta Sans', sans-serif";
  ctx.fillText(Math.round(score), cx, cy - 22);

  ctx.fillStyle = "#10b981";
  ctx.font = "700 12px 'Plus Jakarta Sans', sans-serif";
  const rating = score >= 80 ? "+20% Prime" : score >= 60 ? "+12% Good" : score >= 40 ? "Moderate" : "Needs Review";
  ctx.fillText(rating, cx, cy - 4);
}

const can = (id, h = 210) => `<div class="chart-container"><canvas id="${id}" height="${h}"></canvas></div>`;
