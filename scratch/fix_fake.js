const fs = require('fs');
let code = fs.readFileSync('src/components/Dashboard/DesktopView.jsx', 'utf8');

// First, inject some new math variables at the top of the component
let newVars = `
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysLeft = daysInMonth - today.getDate() || 1;
    const safeMargin = (unallocatedBuffer / daysLeft).toFixed(0);
    const receiptsCount = transactions.filter(t => t.type === 'credit').length;
    const currentBurn = (outflowNum / (today.getDate() || 1)).toFixed(0);
    const outflowProgress = inflowNum > 0 ? ((outflowNum / inflowNum) * 100).toFixed(1) : 0;
    const efficiencyGrade = savingsVelocity > 70 ? 'A+' : savingsVelocity > 50 ? 'B' : 'C';
`;
code = code.replace(/const categorySpending = \{\};/, newVars + '\n    const categorySpending = {};');

// Replace Top Net Worth fake data
code = code.replace(/\+4\.2%/g, '{surplusNum > 0 ? "+": ""}{surplusPercent}%');
code = code.replace(/\+₹5\.76L MoM/g, 'MoM');
code = code.replace(/Liquid: 28\.4%/g, 'Active Balance');
code = code.replace(/Invested: 71\.6%/g, 'Tracked');

// Replace Oct Total Inflow fake data
code = code.replace(/\+8\.4%/g, 'Active');
code = code.replace(/vs Sept \(₹4\.47L\)/g, 'Cycle');
code = code.replace(/Salary \+ Yields/g, 'Total Credits');
code = code.replace(/3 Receipts/g, '{receiptsCount} Receipts');

// Replace Oct Outflow fake data
code = code.replace(/-8\.0%/g, '{outflowProgress}%');
code = code.replace(/-₹14,200 vs Sept/g, 'of Inflow');
code = code.replace(/Burn: ₹5,299\/day/g, 'Burn: ₹{currentBurn}/day');
code = code.replace(/12d left/g, '{daysLeft}d left');

// Replace Net Cash Surplus fake data
code = code.replace(/\+14\.8%/g, '{surplusPercent}%');
code = code.replace(/MoM surplus/g, 'Retained');
code = code.replace(/Free Cash Flow/g, 'Net');
code = code.replace(/Accumulating/g, '{surplusNum > 0 ? "Surplus" : "Deficit"}');

// Replace Savings Velocity fake data
code = code.replace(/Target: 60%/g, 'Target: 50%');
code = code.replace(/\+6\.1% spread/g, '{savingsVelocity > 50 ? "+" : ""}{(savingsVelocity - 50).toFixed(1)}% spread');
code = code.replace(/Benchmark: High/g, 'Benchmark:');
code = code.replace(/Efficiency: A\+/g, 'Efficiency: {efficiencyGrade}');

// Replace Unallocated Buffer fake data
code = code.replace(/Cap: ₹2,10,000/g, 'Cap: ₹{budgetCap.toLocaleString()}');
code = code.replace(/78\.2% spent/g, '{spentPercent}% spent');
code = code.replace(/₹3,810\/day max/g, '₹{safeMargin}/day max');

// Other Insights fixes
code = code.replace(/Deficit Threshold: Low/g, 'Deficit Threshold: {spentPercent > 90 ? "High" : spentPercent > 75 ? "Medium" : "Low"}');
code = code.replace(/Recurring: -11\.3%/g, 'Recorded: {transactions.length} items');
code = code.replace(/Runway: \+10\.2% Safe/g, 'Runway: {daysLeft} days');
code = code.replace(/Alpha: \+7\.7% Spread/g, 'Grade: {efficiencyGrade}');
code = code.replace(/Fixed Outflow: 53\.0%/g, 'Data driven by');
code = code.replace(/Variable Outflow: 47\.0%/g, 'Firebase Realtime DB');

fs.writeFileSync('src/components/Dashboard/DesktopView.jsx', code);
console.log('Fixed remaining fake data strings!');
