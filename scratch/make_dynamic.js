const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard/DesktopView.jsx', 'utf8');

// Top KPIs (some were missed due to number formatting mismatch)
code = code.replace(/₹1,42,85,420/g, '₹{netWorth}');
code = code.replace(/₹3,20,720/g, '₹{surplus}');

// AI Insights - Insight 1 (Food & Dining)
code = code.replace(/Food &amp; Dining Velocity/g, '{sortedCategories.length > 0 ? sortedCategories[0][0] : \"Category\"} Velocity');
code = code.replace(/Spending rose <span className="font-semibold text-error">\+18\.2%<\/span> \(₹34,800\) primarily weekend travel; <span className="font-numeric-table font-medium text-on-surface">8\.4%<\/span> above projected runway./g, 
    'Top spending category is <span className="font-semibold text-error">{sortedCategories.length > 0 ? sortedCategories[0][0] : \"N/A\"}</span> (₹{sortedCategories.length > 0 ? sortedCategories[0][1].toLocaleString() : 0}) accounting for <span className="font-numeric-table font-medium text-on-surface">{sortedCategories.length > 0 && outflowNum > 0 ? ((sortedCategories[0][1] / outflowNum) * 100).toFixed(1) : 0}%</span> of total outflow.');

// AI Insights - Insight 2 (Recurring Fixed)
code = code.replace(/Recurring Fixed Arbitrage/g, 'Transaction Volume');
code = code.replace(/Fixed recurring subscriptions optimized: <span className="font-semibold text-on-tertiary-container">₹4,200 saved<\/span> following annual enterprise SaaS tier consolidation./g, 
    'Total transactions recorded: <span className="font-semibold text-on-tertiary-container">{transactions.length}</span> across all categories in current cycle.');

// AI Insights - Insight 3 (Burn Rate)
code = code.replace(/Daily burn currently <span className="font-numeric-table font-semibold">₹5,299\/day<\/span>; projected outflow <span className="font-numeric-table font-medium">₹1,88,400<\/span> \(well within ₹2\.1L ceiling\)./g, 
    'Daily burn currently <span className="font-numeric-table font-semibold">₹{(outflowNum / 30).toFixed(0)}/day</span>; projected monthly outflow <span className="font-numeric-table font-medium">₹{outflowNum.toLocaleString()}</span> (against ₹{budgetCap.toLocaleString()} ceiling).');

// AI Insights - Insight 4 (Automated Sweep)
code = code.replace(/Savings efficiency improved from <span className="font-numeric-table">58\.4%<\/span> to <span className="font-numeric-table font-semibold text-secondary">66\.1%<\/span> via Zerodha overnight liquid fund sweep./g, 
    'Savings efficiency is currently at <span className="font-numeric-table font-semibold text-secondary">{savingsVelocity}%</span> based on net retained surplus versus total inflow.');

// Cash Flow Run Top Badges
code = code.replace(/<span className="font-numeric-table text-body-lg font-semibold text-on-surface">₹4,85,000<\/span>/g, '<span className="font-numeric-table text-body-lg font-semibold text-on-surface">₹{inflow}</span>');
code = code.replace(/<span className="font-numeric-table text-body-lg font-semibold text-on-surface">₹1,64,280<\/span>/g, '<span className="font-numeric-table text-body-lg font-semibold text-on-surface">₹{outflow}</span>');
code = code.replace(/<span className="font-numeric-table text-body-lg font-semibold text-secondary">\+₹3,20,720<\/span>/g, '<span className="font-numeric-table text-body-lg font-semibold text-secondary">+₹{surplus}</span>');

// Category Donut Chart Center Text
code = code.replace(/<span className="font-numeric-table font-semibold text-body-md text-on-surface">Housing<\/span>/g, '<span className="font-numeric-table font-semibold text-body-md text-on-surface">{sortedCategories.length > 0 ? sortedCategories[0][0] : \"None\"}</span>');
code = code.replace(/<span className="font-numeric-table text-\[10px\] text-on-surface-variant">28\.0%<\/span>/g, '<span className="font-numeric-table text-[10px] text-on-surface-variant">{sortedCategories.length > 0 && outflowNum > 0 ? ((sortedCategories[0][1] / outflowNum) * 100).toFixed(1) : 0}%</span>');

fs.writeFileSync('src/components/Dashboard/DesktopView.jsx', code);
console.log('Dynamic values injected!');
