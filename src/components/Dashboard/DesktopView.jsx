import React from 'react';
import { Link } from 'react-router-dom';
import { calculateAnalytics, parseTxDate } from '../../utils/analytics';

const DesktopView = ({ analytics, transactions, timeFilter, setTimeFilter }) => {
    const netWorth = analytics?.totalNetWorth?.toLocaleString() || '0';
    const inflowNum = analytics?.totalInflow || 0;
    const outflowNum = analytics?.totalOutflow || 0;
    const surplusNum = analytics?.netSurplus || 0;
    
    const inflow = inflowNum.toLocaleString();
    const outflow = outflowNum.toLocaleString();
    const surplus = surplusNum.toLocaleString();
    
    const outflowPercent = inflowNum > 0 ? ((outflowNum / inflowNum) * 100).toFixed(1) : 0;
    const surplusPercent = inflowNum > 0 ? ((surplusNum / inflowNum) * 100).toFixed(1) : 0;

    const savingsVelocity = analytics?.savingsVelocity || 0;
    const budgetCap = 3000;
    const unallocatedBuffer = budgetCap - outflowNum;
    const spentPercent = ((outflowNum / budgetCap) * 100).toFixed(1);

    
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysLeft = daysInMonth - today.getDate() || 1;
    const safeMargin = (budgetCap / daysInMonth).toFixed(0);
    const receiptsCount = transactions.filter(t => t.type === 'credit').length;
    const currentBurn = (outflowNum / (today.getDate() || 1)).toFixed(0);
    const outflowProgress = inflowNum > 0 ? ((outflowNum / inflowNum) * 100).toFixed(1) : 0;
    const efficiencyGrade = savingsVelocity > 70 ? 'A+' : savingsVelocity > 50 ? 'B' : 'C';

    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const currentMonthIndex = today.getMonth();
    const chartBuckets = [];
    
    if (timeFilter === '7D') {
        for (let i = 6; i >= 0; i--) {
            let d = new Date(today);
            d.setDate(today.getDate() - i);
            chartBuckets.push({ label: d.getDate().toString(), dateKey: d.toDateString(), inflow: 0, outflow: 0 });
        }
    } else if (timeFilter === '30D') {
        for (let i = 5; i >= 0; i--) {
            let dEnd = new Date(today);
            dEnd.setDate(today.getDate() - (i * 5));
            dEnd.setHours(23, 59, 59);
            let dStart = new Date(dEnd);
            dStart.setDate(dEnd.getDate() - 4);
            dStart.setHours(0, 0, 0);
            chartBuckets.push({ label: `${dStart.getDate()}-${dEnd.getDate()}`, startDate: dStart, endDate: dEnd, inflow: 0, outflow: 0 });
        }
    } else if (timeFilter === '3M') {
        for (let i = 5; i >= 0; i--) {
            let dEnd = new Date(today);
            dEnd.setDate(today.getDate() - (i * 15));
            dEnd.setHours(23, 59, 59);
            let dStart = new Date(dEnd);
            dStart.setDate(dEnd.getDate() - 14);
            dStart.setHours(0, 0, 0);
            chartBuckets.push({ label: `${dStart.getDate()} ${monthNames[dStart.getMonth()]}`, startDate: dStart, endDate: dEnd, inflow: 0, outflow: 0 });
        }
    } else if (timeFilter === '1Y') {
        for (let i = 11; i >= 0; i--) {
            let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            chartBuckets.push({ label: monthNames[d.getMonth()], year: d.getFullYear(), month: d.getMonth(), inflow: 0, outflow: 0 });
        }
    } else if (timeFilter === 'YTD') {
        const mCount = today.getMonth() + 1;
        for (let i = mCount - 1; i >= 0; i--) {
            let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            chartBuckets.push({ label: monthNames[d.getMonth()], year: d.getFullYear(), month: d.getMonth(), inflow: 0, outflow: 0 });
        }
    } else {
        for (let i = 5; i >= 0; i--) {
            let d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            chartBuckets.push({ label: monthNames[d.getMonth()], year: d.getFullYear(), month: d.getMonth(), inflow: 0, outflow: 0 });
        }
    }

    transactions.forEach(tx => {
        if (!tx.date) return;
        const txDate = parseTxDate(tx.date);
        let bucket = null;
        if (['1Y', '6M', 'YTD'].includes(timeFilter)) {
            bucket = chartBuckets.find(b => b.year === txDate.getFullYear() && b.month === txDate.getMonth());
        } else if (timeFilter === '7D') {
            bucket = chartBuckets.find(b => b.dateKey === txDate.toDateString());
        } else {
            bucket = chartBuckets.find(b => txDate >= b.startDate && txDate <= b.endDate);
        }
        if (bucket) {
            if (tx.type === 'credit') bucket.inflow += Number(tx.amount || 0);
            if (tx.type === 'debit') bucket.outflow += Number(tx.amount || 0);
        }
    });

    const maxVal = Math.max(...chartBuckets.flatMap(m => [m.inflow, m.outflow]), 100);
    const gridMax = Math.ceil(maxVal / 1000) * 1000;
    
    const getY = (val) => {
        const ratio = val / gridMax;
        return 200 - (ratio * 170); // 200 is base, 30 is top (170 range)
    };

    const formatScale = (val) => val >= 1000 ? `₹${(val / 1000).toFixed(0)}k` : `₹${val}`;

    const margin = 95;
    const width = 760;
    const usableWidth = width - margin * 1.5;
    const numBuckets = chartBuckets.length;
    const step = numBuckets > 1 ? usableWidth / (numBuckets - 1) : usableWidth;
    const xPositions = chartBuckets.map((_, i) => margin + (i * step));

    const categorySpending = {};
    transactions.forEach(tx => {
        if (tx.type === 'debit') {
            const cat = tx.category || 'General';
            categorySpending[cat] = (categorySpending[cat] || 0) + (parseFloat(tx.amount) || 0);
        }
    });
    const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);

    return (
        <>
        <div className="flex flex-col w-full min-w-0">
<div className="p-margin space-y-gutter min-w-0">

<div className="flex items-center justify-between">
<div className="flex items-baseline gap-space-sm">
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Dashboard</h1>
</div>
<div className="flex items-center gap-space-sm">
<Link to="/expense/download" className="h-7 px-2.5 bg-surface-container-high hover:bg-surface-variant text-on-surface rounded font-body-sm text-body-sm font-medium transition-colors flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-[14px]">file_download</span>
<span>Export</span>
</Link>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-gutter-dense">

<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div className="flex items-center justify-between text-outline">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Net Worth</span>
<span className="material-symbols-outlined text-[16px] text-secondary">account_balance_wallet</span>
</div>
<div className="mt-space-xs">
<div className={`font-numeric-metric text-numeric-metric tracking-tight ${surplusNum >= 0 ? 'text-on-tertiary-container' : 'text-error'}`}>₹{netWorth}</div>
<div className="flex items-center gap-1 mt-1 font-label-sm text-label-sm">
<span className={`px-1.5 py-0.2 rounded font-semibold flex items-center ${surplusNum >= 0 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'}`}>
<span className="material-symbols-outlined text-[12px] mr-0.5">{surplusNum >= 0 ? 'arrow_upward' : 'arrow_downward'}</span>{surplusNum > 0 ? "+": ""}{surplusPercent}%
            </span>
<span className="text-on-surface-variant truncate">MoM</span>
</div>
</div>
<div className="mt-2 pt-1 border-t-0 flex items-center justify-between text-outline font-label-sm text-[10px]">
<span>Active Balance</span>
<span>Tracked</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div className="flex items-center justify-between text-outline">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{monthNames[currentMonthIndex]} Total Inflow</span>
<span className="material-symbols-outlined text-[16px] text-on-tertiary-container">arrow_downward_alt</span>
</div>
<div className="mt-space-xs">
<div className="font-numeric-metric text-numeric-metric text-on-tertiary-container tracking-tight">₹{inflow}</div>
<div className="flex items-center gap-1 mt-1 font-label-sm text-label-sm">
<span className="px-1.5 py-0.2 rounded bg-tertiary-fixed text-on-tertiary-fixed font-semibold flex items-center">
<span className="material-symbols-outlined text-[12px] mr-0.5">arrow_upward</span>Active
            </span>
<span className="text-on-surface-variant truncate">Cycle</span>
</div>
</div>
<div className="mt-2 pt-1 flex items-center justify-between text-outline font-label-sm text-[10px]">
<span>Total Credits</span>
<span className="text-secondary font-medium">{receiptsCount} Receipts</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div className="flex items-center justify-between text-outline">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">{monthNames[currentMonthIndex]} Outflow</span>
<span className="material-symbols-outlined text-[16px] text-error">trending_down</span>
</div>
<div className="mt-space-xs">
<div className="font-numeric-metric text-numeric-metric text-error tracking-tight">₹{outflow}</div>
<div className="flex items-center gap-1 mt-1 font-label-sm text-label-sm">
<span className="px-1.5 py-0.2 rounded bg-error-container text-on-error-container font-semibold flex items-center">
<span className="material-symbols-outlined text-[12px] mr-0.5">trending_up</span>{outflowProgress}%
            </span>
<span className="text-on-surface-variant truncate">of Inflow</span>
</div>
</div>
<div className="mt-2 pt-1 flex items-center justify-between text-outline font-label-sm text-[10px]">
<span>Today: ₹{transactions.filter(t => t.type === 'debit' && t.date === today.toLocaleDateString('en-GB')).reduce((sum, t) => sum + Number(t.amount || 0), 0)} ({today.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})</span>
<span>{daysLeft}d left</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div className="flex items-center justify-between text-outline">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Net Cash Surplus</span>
<span className="material-symbols-outlined text-[16px] text-secondary">savings</span>
</div>
<div className="mt-space-xs">
<div className={`font-numeric-metric text-numeric-metric tracking-tight ${surplusNum >= 0 ? 'text-on-tertiary-container' : 'text-error'}`}>₹{surplus}</div>
<div className="flex items-center gap-1 mt-1 font-label-sm text-label-sm">
<span className={`px-1.5 py-0.2 rounded font-semibold flex items-center ${surplusNum >= 0 ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'}`}>
<span className="material-symbols-outlined text-[12px] mr-0.5">{surplusNum >= 0 ? 'arrow_upward' : 'arrow_downward'}</span>{surplusPercent}%
            </span>
<span className="text-on-surface-variant truncate">Retained</span>
</div>
</div>
<div className="mt-2 pt-1 flex items-center justify-between text-outline font-label-sm text-[10px]">
<span>Net</span>
<span className={surplusNum >= 0 ? "text-on-tertiary-container font-medium" : "text-error font-medium"}>{surplusNum >= 0 ? "Surplus" : "Deficit"}</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div className="flex items-center justify-between text-outline">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Savings Velocity</span>
<span className="material-symbols-outlined text-[16px] text-secondary-container">speed</span>
</div>
<div className="mt-space-xs">
<div className={`font-numeric-metric text-numeric-metric tracking-tight ${savingsVelocity >= 0 ? 'text-on-tertiary-container' : 'text-error'}`}>{savingsVelocity}%</div>
<div className="flex items-center gap-1 mt-1 font-label-sm text-label-sm">
<span className="px-1.5 py-0.2 rounded bg-secondary-fixed text-on-secondary-fixed font-semibold flex items-center">
              Target: 50%
            </span>
<span className="text-on-tertiary-container font-medium truncate">{savingsVelocity > 50 ? "+" : ""}{(savingsVelocity - 50).toFixed(1)}% spread</span>
</div>
</div>
<div className="mt-2 pt-1 flex items-center justify-between text-outline font-label-sm text-[10px]">
<span>Benchmark:</span>
<span>Efficiency: {efficiencyGrade}</span>
</div>
</div>

<div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
<div className="flex items-center justify-between text-outline">
<span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Unallocated Buffer</span>
<span className="material-symbols-outlined text-[16px] text-outline">donut_large</span>
</div>
<div className="mt-space-xs">
<div className="font-numeric-metric text-numeric-metric text-on-surface tracking-tight">₹{unallocatedBuffer.toLocaleString()}</div>
<div className="flex items-center gap-1 mt-1 font-label-sm text-label-sm">
<span className="text-on-surface-variant truncate">Cap: ₹{budgetCap.toLocaleString()}</span>
<span className="text-on-surface font-semibold">{spentPercent}% spent</span>
</div>
</div>
<div className="mt-2 pt-1 flex items-center justify-between text-outline font-label-sm text-[10px]">
<span className="text-on-tertiary-container font-medium">Safe Margin</span>
<span>₹{safeMargin}/day max</span>
</div>
</div>
</div>


<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between min-w-0">
<div>
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm pb-space-sm">
<div>
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider block">Cash Flow</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Income vs Expense Cash Flow Run</h2>
</div>

<div className="flex items-center bg-surface-container-low p-0.5 rounded">
    {['7D', '30D', '3M', '6M', '1Y', 'YTD'].map(tf => (
        <button 
            key={tf}
            onClick={() => setTimeFilter(tf)}
            className={`px-2 py-0.5 font-label-sm text-label-sm ${timeFilter === tf ? 'bg-primary text-on-primary font-medium rounded shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
        >
            {tf}
        </button>
    ))}
</div>
</div>

<div className="flex items-center gap-space-xl py-space-sm">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-sm bg-on-tertiary-container"></span>
<div>
<span className="font-label-caps text-[10px] text-outline uppercase block">Current Inflow</span>
<span className="font-numeric-table text-body-lg font-semibold text-on-surface">₹{inflow}</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-sm bg-error"></span>
<div>
<span className="font-label-caps text-[10px] text-outline uppercase block">Current Outflow</span>
<span className="font-numeric-table text-body-lg font-semibold text-on-surface">₹{outflow}</span>
</div>
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-sm bg-secondary"></span>
<div>
<span className="font-label-caps text-[10px] text-outline uppercase block">Net Retained Surplus</span>
<span className="font-numeric-table text-body-lg font-semibold text-secondary">₹{surplus}</span>
</div>
</div>
</div>
</div>


<div className="relative w-full h-64 mt-2">
<svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 760 220">
<defs>
<linearGradient id="surplusGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#0051d5" stopOpacity="0.18"/>
<stop offset="100%" stopColor="#0051d5" stopOpacity="0.0"/>
</linearGradient>
</defs>

<line stroke="#c6c6cd" strokeDasharray="3 3" strokeOpacity="0.3" x1="40" x2="750" y1="30" y2="30"/>
<text fill="#76777d" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="32" y="34">{formatScale(gridMax)}</text>
<line stroke="#c6c6cd" strokeDasharray="3 3" strokeOpacity="0.3" x1="40" x2="750" y1="86" y2="86"/>
<text fill="#76777d" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="32" y="90">{formatScale(gridMax * 0.66)}</text>
<line stroke="#c6c6cd" strokeDasharray="3 3" strokeOpacity="0.3" x1="40" x2="750" y1="143" y2="143"/>
<text fill="#76777d" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="32" y="147">{formatScale(gridMax * 0.33)}</text>
<line stroke="#c6c6cd" strokeOpacity="0.5" x1="40" x2="750" y1="200" y2="200"/>
<text fill="#76777d" fontFamily="JetBrains Mono" fontSize="10" textAnchor="end" x="32" y="204">₹0</text>

{/* Net Surplus Trendline */}
<path d={`M ${chartBuckets.map((m, i) => `${xPositions[i]},${getY(m.inflow - m.outflow)}`).join(' L ')}`} fill="none" stroke="#0051d5" strokeLinecap="round" strokeWidth="2.5"/>
<path d={`M ${xPositions[0]},${getY(chartBuckets[0].inflow - chartBuckets[0].outflow)} ${chartBuckets.map((m, i) => `L ${xPositions[i]},${getY(m.inflow - m.outflow)}`).join(' ')} L ${xPositions[5]},200 L ${xPositions[0]},200 Z`} fill="url(#surplusGradient)"/>

{chartBuckets.map((m, i) => {
    const xCenter = xPositions[i];
    const rawYIn = getY(m.inflow);
    const rawYOut = getY(m.outflow);
    const hIn = Math.max(200 - rawYIn, m.inflow > 0 ? 4 : 0);
    const hOut = Math.max(200 - rawYOut, m.outflow > 0 ? 4 : 0);
    const yIn = 200 - hIn;
    const yOut = 200 - hOut;
    const isCurrent = i === 5;
    return (
        <g key={i}>
            <rect className="hover:opacity-85 transition-opacity" fill="#069669" x={xCenter - 20} y={yIn} width="18" height={hIn} rx="2"/>
            <rect className="hover:opacity-85 transition-opacity" fill="#ba1a1a" fillOpacity="0.85" x={xCenter + 2} y={yOut} width="18" height={hOut} rx="2"/>
            
            {isCurrent && <circle cx={xCenter} cy={getY(m.inflow - m.outflow)} r="4" fill="#0051d5" stroke="#ffffff" strokeWidth="2"/>}
            <text fill={isCurrent ? "#0b1c30" : "#45464d"} fontFamily="Inter" fontSize="11" fontWeight={isCurrent ? "600" : "500"} textAnchor="middle" x={xCenter} y="218">
                {m.label} {isCurrent && '(CUR)'}
            </text>
        </g>
    );
})}
</svg>
</div>

</div>

<div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between min-w-0">
<div>
<div className="flex items-center justify-between pb-space-xs">
<div>
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider block">Capital Breakdown</span>
<h2 className="font-headline-md text-headline-md text-on-surface">Category Spending Distribution</h2>
</div>
<span className="font-label-sm text-label-sm text-outline font-numeric-table">₹{outflow}</span>
</div>

<div className="flex items-center justify-center my-space-md">
<div className="relative w-36 h-36 flex items-center justify-center">
<svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">

<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#131b2e" strokeDasharray="28 72" strokeDashoffset="0" strokeWidth="3.8"/>

<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#ba1a1a" strokeDasharray="21 79" strokeDashoffset="-28" strokeWidth="3.8"/>

<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#0051d5" strokeDasharray="16 84" strokeDashoffset="-49" strokeWidth="3.8"/>

<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#316bf3" strokeDasharray="14 86" strokeDashoffset="-65" strokeWidth="3.8"/>

<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#76777d" strokeDasharray="12 88" strokeDashoffset="-79" strokeWidth="3.8"/>

<circle cx="18" cy="18" fill="transparent" r="15.915" stroke="#069669" strokeDasharray="9 91" strokeDashoffset="-91" strokeWidth="3.8"/>
</svg>
<div className="absolute flex flex-col items-center justify-center text-center">
<span className="font-label-caps text-[9px] text-outline uppercase tracking-wider">Top Spend</span>
<span className="font-numeric-table font-semibold text-body-md text-on-surface">{sortedCategories.length > 0 ? sortedCategories[0][0] : "None"}</span>
<span className="font-numeric-table text-[10px] text-on-surface-variant">{sortedCategories.length > 0 && outflowNum > 0 ? ((sortedCategories[0][1] / outflowNum) * 100).toFixed(1) : 0}%</span>
</div>
</div>
</div>

<div className="space-y-space-xs">
                            {sortedCategories.slice(0, 5).map(([cat, amt]) => {
                                const pct = outflowNum > 0 ? ((amt / outflowNum) * 100).toFixed(1) : 0;
                                return (
                                    <div key={cat} className="flex items-center justify-between text-body-sm font-body-sm mb-2">
                                        <div className="flex items-center gap-1.5 min-w-0">
                                            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
                                            <span className="text-on-surface truncate">{cat}</span>
                                        </div>
                                        <div className="flex items-center gap-2 font-numeric-table text-label-sm">
                                            <span className="text-on-surface font-medium">₹{amt.toLocaleString()}</span>
                                            <span className="text-outline w-8">{pct}%</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {sortedCategories.length === 0 && (
                                <div className="text-center py-4 text-on-surface-variant text-body-sm">No spending data available.</div>
                            )}
</div>
<div className="pt-space-sm mt-space-sm border-t-0 flex items-center justify-between text-label-sm text-outline">
<span>Data driven by</span>
<span>Firebase Realtime DB</span>
</div>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between min-w-0">
<div>
<div className="flex items-center justify-between pb-space-sm">
<div>
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider block">Transactions</span>
<h3 className="font-headline-md text-headline-md text-on-surface">Recent Transactions</h3>
</div>
<div className="flex items-center gap-2">

<Link to="/expense/transactions" className="h-7 px-2 flex items-center bg-surface-container-low hover:bg-surface-container text-on-surface-variant rounded text-label-sm font-label-sm transition-colors">
                View Full Sheet
              </Link>
</div>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm select-none">
<thead>
<tr className="bg-surface-container-low/70 text-outline font-label-caps text-label-caps uppercase">
<th className="py-2 px-3 font-semibold">Posting Date</th>
<th className="py-2 px-3 font-semibold">Entity / Merchant</th>
<th className="py-2 px-3 font-semibold">Category</th>
<th className="py-2 px-3 font-semibold">Ledger Node</th>
<th className="py-2 px-3 font-semibold text-center">Flow</th>
<th className="py-2 px-3 font-semibold text-right">Gross (INR)</th>
</tr>
</thead>
<tbody className="divide-y-0 font-numeric-table">
                                    {transactions.slice(0, 6).map(tx => (
                                        <tr key={tx.id} className="hover:bg-surface-container-low transition-colors">
                                            <td className="py-2 px-3 text-outline text-label-sm whitespace-nowrap">{tx.date} {tx.time && ', ' + tx.time}</td>
                                            <td className="py-2 px-3 font-medium text-on-surface font-body-sm flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                                <div className="flex flex-col leading-tight">
                                                    <span>{tx.purpose || 'Unknown'}</span>
                                                    {tx.description && <span className="text-[10px] text-outline font-normal">{tx.description}</span>}
                                                </div>
                                            </td>
                                            <td className="py-2 px-3">
                                                <span className="px-1.5 py-0.5 bg-surface-container rounded text-[10px] text-on-surface-variant">{tx.category || 'General'}</span>
                                            </td>
                                            <td className="py-2 px-3 text-on-surface-variant text-label-sm">{tx.payment_method || 'Bank'}</td>
                                            <td className="py-2 px-3 text-center">
                                                <span className={`px-1 py-0.2 rounded text-[10px] font-semibold ${tx.type === 'credit' ? 'bg-tertiary-fixed text-on-tertiary-fixed' : 'bg-error-container text-on-error-container'}`}>
                                                    {tx.type === 'credit' ? 'CR' : 'DR'}
                                                </span>
                                            </td>
                                            <td className={`py-2 px-3 text-right font-semibold ${tx.type === 'credit' ? 'text-on-tertiary-container' : 'text-error'}`}>
                                                {tx.type === 'credit' ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {transactions.length === 0 && (
                                        <tr><td colSpan="6" className="text-center py-8 text-on-surface-variant text-body-sm">No recent transactions</td></tr>
                                    )}
</tbody>
</table>
</div>
</div>
<div className="flex items-center justify-between pt-space-sm text-outline font-label-sm text-label-sm">
<span>Showing recent transactions</span>
</div>
</div>

<div className="lg:col-span-4 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between min-w-0">
<div>
<div className="flex items-center justify-between pb-space-sm">
<div>
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider block">Budgets</span>
<h3 className="font-headline-md text-headline-md text-on-surface">Budget Allocations</h3>
</div>
<span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded font-label-sm text-[10px]">Active Cap: ₹{budgetCap.toLocaleString()}</span>
</div>

<div className="space-y-space-md mt-space-xs">
                            {sortedCategories.slice(0, 4).map(([cat, amt]) => {
                                // Dynamic budget caps - assuming each category cap is amt + some arbitrary buffer for display purposes
                                // Normally this would be pulled from a real Budget schema
                                const fakeCap = Math.max(amt, 10000) * 1.5; 
                                const pct = Math.min((amt / fakeCap) * 100, 100).toFixed(1);
                                const isWarning = pct > 85;
                                return (
                                    <div key={cat} className="p-space-sm bg-surface-container-low rounded-lg">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <span className="font-body-sm font-semibold text-on-surface">{cat}</span>
                                            <span className={`px-1.5 py-0.2 rounded font-label-sm text-[10px] uppercase font-semibold ${isWarning ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface-variant'}`}>
                                                {pct}% {isWarning ? 'Warning' : 'Locked'}
                                            </span>
                                        </div>
                                        <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full ${isWarning ? 'bg-error' : 'bg-primary-container'}`} style={{width: `${pct}%`}}></div>
                                        </div>
                                        <div className="flex items-center justify-between mt-1 text-label-sm font-numeric-table text-outline">
                                            <span className={isWarning ? 'text-error font-medium' : ''}>{isWarning ? 'Spent: ' : 'Disbursed: '}₹{amt.toLocaleString()}</span>
                                            <span>Cap: ₹{fakeCap.toLocaleString()}</span>
                                        </div>
                                    </div>
                                );
                            })}
                            {sortedCategories.length === 0 && (
                                <div className="text-center py-4 text-on-surface-variant text-body-sm">No active budgets.</div>
                            )}
</div>
</div>
<div className="pt-space-sm mt-space-sm border-t-0 flex items-center justify-between text-outline font-label-sm text-[11px]">
<Link to="/expense/budgets" className="text-secondary font-medium cursor-pointer hover:underline">Manage Budgets</Link>
<span className="material-symbols-outlined text-[16px] text-outline">tune</span>
</div>
</div>
</div>
</div>
</div>
        </>
    );
};

export default DesktopView;
