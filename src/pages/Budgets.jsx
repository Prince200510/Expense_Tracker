import React, { useState, useEffect } from 'react';
import { ref, onValue, set } from "firebase/database";
import { database } from '../services/firebase';
import { parseTxDate } from '../utils/analytics';

const Budgets = () => {
    const [transactions, setTransactions] = useState([]);
    const [budgetAllocations, setBudgetAllocations] = useState({});
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [dateFilterType, setDateFilterType] = useState('current');
    const [customStartDate, setCustomStartDate] = useState('');
    const [customEndDate, setCustomEndDate] = useState('');
    
    useEffect(() => {
        const budgetRef = ref(database, 'budget_allocations/');
        const unsubscribeBudget = onValue(budgetRef, (snapshot) => {
            if (snapshot.exists()) {
                setBudgetAllocations(snapshot.val());
            } else {
                setBudgetAllocations({});
            }
        });
        return () => unsubscribeBudget();
    }, []);

    useEffect(() => {
        const expenseRef = ref(database, 'expense_data_history/');
        const unsubscribe = onValue(expenseRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const expenseList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setTransactions(expenseList.reverse());
            } else {
                setTransactions([]);
            }
        });
        return () => unsubscribe();
    }, []);

    const today = new Date();
    const currentMonthStr = today.toLocaleString('default', { month: 'long' });
    const currentYearStr = today.getFullYear();
    const currentMonthIndex = today.getMonth();
    const daysInMonth = new Date(currentYearStr, currentMonthIndex + 1, 0).getDate();
    
    const currentDay = today.getDate();
    let daysInPeriod = daysInMonth;
    let daysPassed = currentDay;
    let computedDaysRemaining = daysInMonth - currentDay;

    if (dateFilterType === 'custom' && customStartDate && customEndDate) {
        const s = new Date(customStartDate);
        const e = new Date(customEndDate);
        if(s <= e) {
            daysInPeriod = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
            const now = new Date();
            if (now < s) {
                computedDaysRemaining = daysInPeriod;
                daysPassed = 0;
            } else if (now > e) {
                computedDaysRemaining = 0;
                daysPassed = daysInPeriod;
            } else {
                computedDaysRemaining = Math.round((e - now) / (1000 * 60 * 60 * 24));
                daysPassed = daysInPeriod - computedDaysRemaining;
            }
        }
    }

    const currentMonthTransactions = transactions.filter(tx => {
        if (!tx.date) return false;
        const txDate = parseTxDate(tx.date);
        
        if (dateFilterType === 'custom' && customStartDate && customEndDate) {
            const s = new Date(customStartDate);
            const e = new Date(customEndDate);
            s.setHours(0,0,0,0);
            e.setHours(23,59,59,999);
            return txDate >= s && txDate <= e;
        }
        
        return txDate.getMonth() === currentMonthIndex && txDate.getFullYear() === currentYearStr;
    });

    const totalInflow = currentMonthTransactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const totalOutflow = currentMonthTransactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    
    const pool = totalInflow; // strict deposit money display
    const spent = totalOutflow;
    const remaining = Math.max(0, pool - spent);
    const consumedPercent = pool > 0 ? ((spent / pool) * 100).toFixed(1) : 0;
    
    const dailyBurnRate = daysPassed > 0 ? (spent / daysPassed) : 0;
    const safeBurnRate = computedDaysRemaining > 0 ? (remaining / computedDaysRemaining) : remaining;
    const projectedMonthEnd = spent + (dailyBurnRate * computedDaysRemaining);
    const projectedBuffer = pool - projectedMonthEnd;

    // Categorical spending
    const categorySpending = {};
    currentMonthTransactions.filter(t => t.type === 'debit').forEach(tx => {
        const cat = tx.category || 'Other';
        categorySpending[cat] = (categorySpending[cat] || 0) + Number(tx.amount || 0);
    });

    const allCategories = Array.from(new Set([...Object.keys(categorySpending), ...Object.keys(budgetAllocations)]));
    const envelopeCards = allCategories.map((cat, idx) => {
        const spentCat = categorySpending[cat] || 0;
        const allocated = budgetAllocations[cat] || 0;
        const remainingCat = Math.max(0, allocated - spentCat);
        const percent = ((spentCat / allocated) * 100).toFixed(1);
        const isDeficit = spentCat > allocated;
        
        let statusClass = "bg-primary-container text-on-primary-container";
        let statusIcon = "check_circle";
        let statusText = "HEALTHY";
        if (percent > 100) {
            statusClass = "bg-error text-on-error";
            statusIcon = "warning";
            statusText = "DEFICIT";
        } else if (percent > 80) {
            statusClass = "bg-tertiary-container text-on-tertiary-container";
            statusIcon = "trending_up";
            statusText = "WARNING";
        }
        
        const envId = `ENV-${(idx + 1).toString().padStart(3, '0')}`;

        return {
            id: envId,
            category: cat,
            spent: spentCat,
            allocated,
            remaining: remainingCat,
            percent,
            isDeficit,
            statusClass,
            statusIcon,
            statusText
        };
    }).sort((a, b) => b.spent - a.spent);

    return (
        <div className="flex flex-col w-full h-full bg-surface">
            <main className="w-full pt-14 flex-1 bg-surface"><div className="flex flex-col w-full pb-16">
{/* Top Command & Filter Deck */}
<div className="p-margin bg-surface-container-lowest shadow-sm flex flex-col gap-space-lg">
<div className="flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div className="flex flex-col gap-0.5">
<div className="flex items-center gap-2">
<span className="font-label-caps text-label-caps uppercase tracking-wider text-secondary font-semibold">Institutional Variance Telemetry</span>
<span className="w-1 h-1 rounded-full bg-outline-variant"></span>
<span className="font-label-sm text-label-sm text-on-surface-variant font-numeric-table">CY-{currentYearStr}-M{currentMonthIndex + 1}</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-semibold flex items-center gap-3">
          Budget Performance &amp; Variance Analysis
          <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant rounded text-label-sm font-numeric-table font-medium">{computedDaysRemaining} Days Remaining</span>
</h1>
</div>
{/* Action Suite */}
<div className="flex items-center flex-wrap gap-space-sm">
<div className="relative flex items-center gap-2">
<select 
    value={dateFilterType}
    onChange={(e) => setDateFilterType(e.target.value)}
    className="appearance-none h-8 pl-3 pr-8 bg-surface-container-low text-on-surface font-body-sm font-medium rounded cursor-pointer focus:outline-none shadow-sm">
<option value="current">Cycle: {currentMonthStr} {currentYearStr}</option>
<option value="custom">Custom Date Range...</option>
</select>
<span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-outline text-[16px] pointer-events-none">expand_more</span>
{dateFilterType === 'custom' && (
    <div className="flex items-center gap-1 bg-surface-container-low rounded px-2 shadow-sm h-8 ml-2 border border-outline-variant/30">
        <input type="date" value={customStartDate} onChange={e => setCustomStartDate(e.target.value)} className="bg-transparent text-on-surface font-body-sm text-[12px] focus:outline-none" />
        <span className="text-on-surface-variant font-body-sm">to</span>
        <input type="date" value={customEndDate} onChange={e => setCustomEndDate(e.target.value)} className="bg-transparent text-on-surface font-body-sm text-[12px] focus:outline-none" />
    </div>
)}
</div>
<button onClick={() => setIsBudgetModalOpen(true)} className="h-8 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded font-body-sm font-medium shadow-sm transition-colors flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
<span>Adjust Allocations</span>
</button>
<button onClick={() => {
    if(envelopeCards.length === 0) {
        alert('No data to export!');
        return;
    }
    const headers = ["Category", "Allocated", "Spent", "Remaining", "Status"];
    const rows = envelopeCards.map(env => [
        env.category, 
        env.allocated, 
        env.spent, 
        env.remaining, 
        env.statusText
    ]);
    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "budget_variance_sheet.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}} className="h-8 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface rounded font-body-sm font-medium shadow-sm transition-colors flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px] text-outline">file_download</span>
<span>Export Variance Sheet</span>
</button>
<button className="h-8 px-3.5 bg-primary text-on-primary hover:bg-on-primary-fixed-variant rounded font-body-sm font-medium shadow-sm transition-colors flex items-center gap-1.5">
<span className="material-symbols-outlined text-[16px]">add_box</span>
<span>+ Create Budget Envelope</span>
</button>
</div>
</div>
{/* Master Budget Metric Strip (ERP Ledger Style) */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
{/* KPI 1 */}
<div className="p-space-md bg-surface rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="absolute right-0 top-0 w-24 h-24 bg-surface-variant/20 rounded-full blur-2xl pointer-events-none"></div>
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Overall Monthly Cap</span>
<span className="material-symbols-outlined text-[18px] text-outline">account_balance_wallet</span>
</div>
<div className="mt-2 flex items-baseline gap-2">
<span className="font-numeric-metric text-numeric-metric font-bold text-on-surface tracking-tight">₹{pool.toLocaleString()}</span>
<span className="font-label-sm text-label-sm text-outline font-numeric-table">TOTAL POOL</span>
</div>
<div className="mt-2 flex items-center justify-between text-body-sm text-on-surface-variant pt-2">
<span>Target baseline</span>
<span className="font-numeric-table font-medium text-on-surface">{envelopeCards.length} Active Envelopes</span>
</div>
</div>
{/* KPI 2 */}
<div className="p-space-md bg-surface rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Total Spent to Date</span>
<span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm font-numeric-table font-semibold">{consumedPercent}% Consumed</span>
</div>
<div className="mt-2 flex items-baseline gap-2">
<span className="font-numeric-metric text-numeric-metric font-bold text-on-surface tracking-tight">₹{spent.toLocaleString()}</span>
<span className="font-label-sm text-label-sm text-outline font-numeric-table flex items-center gap-0.5">
<span className="material-symbols-outlined text-[12px]">{consumedPercent > 100 ? 'warning' : 'check_circle'}</span>
{consumedPercent > 100 ? 'Overspent' : 'On Track'}
</span>
</div>
<div className="mt-2 w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
<div className="bg-secondary h-full rounded-full" style={{width: `${consumedPercent}%`}}></div>
</div>
</div>
{/* KPI 3 */}
<div className="p-space-md bg-surface rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Safe Spending Runway</span>
<span className="material-symbols-outlined text-[18px] text-on-tertiary-container">speed</span>
</div>
<div className="mt-2 flex items-baseline gap-2">
<span className="font-numeric-metric text-numeric-metric font-bold text-on-surface tracking-tight">₹{remaining.toLocaleString()}</span>
<span className="font-label-sm text-label-sm text-on-tertiary-container font-numeric-table font-medium">REMAINING</span>
</div>
<div className="mt-2 flex items-center justify-between text-body-sm text-on-surface-variant pt-2">
<span>Safe Burn Rate</span>
<span className="font-numeric-table font-semibold text-on-surface">₹{safeBurnRate.toFixed(0).toLocaleString()} / day</span>
</div>
</div>
{/* KPI 4 */}
<div className="p-space-md bg-surface rounded-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Projected Month-End</span>
<span className={`px-1.5 py-0.5 rounded font-label-sm font-numeric-table font-semibold ${projectedBuffer >= 0 ? "bg-tertiary-fixed text-on-tertiary-fixed" : "bg-error text-on-error"}`}>{projectedBuffer >= 0 ? '+' : '-'}₹{Math.abs(projectedBuffer).toLocaleString()} Buffer</span>
</div>
<div className="mt-2 flex items-baseline gap-2">
<span className="font-numeric-metric text-numeric-metric font-bold text-on-surface tracking-tight">₹{projectedMonthEnd.toLocaleString()}</span>
<span className="font-label-sm text-label-sm text-on-tertiary-container font-numeric-table">{pool > 0 ? ((projectedMonthEnd / pool) * 100).toFixed(1) : 0}% of Cap</span>
</div>
<div className="mt-2 flex items-center justify-between text-body-sm text-on-surface-variant pt-2">
<span>Fiduciary Status</span>
<span className={`font-numeric-table font-medium flex items-center gap-1 ${projectedBuffer >= 0 ? 'text-on-tertiary-container' : 'text-error'}`}>
<span className={`w-1.5 h-1.5 rounded-full ${projectedBuffer >= 0 ? 'bg-on-tertiary-container' : 'bg-error'}`}></span> {projectedBuffer >= 0 ? 'Surplus Controlled' : 'Deficit Risk'}
          </span>
</div>
</div>
</div>
</div>
{/* Main Workstation Canvas */}
<div className="p-margin flex flex-col gap-space-xl">
{/* Macro Health Telemetry Meter */}
<div className="p-space-md bg-surface-container-lowest rounded-lg shadow-sm flex flex-col gap-space-sm">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
<div className="flex items-center gap-2">
<span className="font-label-caps text-label-caps uppercase text-outline">Envelope Distribution Status</span>
<span className="text-body-sm font-body-sm text-on-surface-variant font-medium">(Categorical Envelope Variance)</span>
</div>
</div>
{/* Segmented Bar Visualization */}
<div className="w-full h-3 rounded-full flex overflow-hidden gap-1 bg-surface-container-high">
    {envelopeCards.map((env, i) => {
        const width = pool > 0 ? ((env.spent / pool) * 100) : 0;
        let color = "bg-primary";
        if (i % 4 === 1) color = "bg-error";
        if (i % 4 === 2) color = "bg-secondary";
        if (i % 4 === 3) color = "bg-tertiary";
        return width > 0 ? <div key={i} className={`${color} h-full`} style={{width: `${width}%`}} title={`${env.category} (${width.toFixed(1)}%)`}></div> : null;
    })}
</div>
<div className="flex justify-between text-label-sm text-outline font-numeric-table pt-1">
<span>0%</span>
<span>25% Cap (₹{(pool * 0.25).toLocaleString()})</span>
<span>50% Cap (₹{(pool * 0.50).toLocaleString()})</span>
<span>75% Cap (₹{(pool * 0.75).toLocaleString()})</span>
<span>100% (₹{pool.toLocaleString()})</span>
</div>
</div>
{/* Dynamic Envelopes */}
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-space-md pt-space-xs">
    {envelopeCards.length === 0 ? (
        <div className="col-span-full py-10 text-center text-outline font-body-lg">No debit transactions this month to display budgets.</div>
    ) : envelopeCards.map(env => (
        <div key={env.id} className="p-space-md bg-surface-container-lowest rounded-lg border border-outline-variant/30 shadow-sm flex flex-col gap-space-sm">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-space-sm">
                    <div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center">
                        <span className="material-symbols-outlined text-[18px]">category</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="font-body-md text-body-md font-semibold text-on-surface">{env.category}</span>
                        <span className="font-label-sm text-label-sm text-outline font-numeric-table tracking-wide uppercase">{env.id} • VARIABLE EXPENDITURE</span>
                    </div>
                </div>
                <div className={`px-2 py-0.5 rounded font-label-sm font-numeric-table font-semibold flex items-center gap-1 ${env.statusClass}`}>
                    <span className="material-symbols-outlined text-[14px]">{env.statusIcon}</span>
                    {env.percent}% {env.statusText}
                </div>
            </div>
            
            <div className="flex items-end justify-between mt-2">
                <div className="flex flex-col">
                    <span className="font-label-sm text-label-sm text-outline font-semibold uppercase tracking-wider">Spent / Allocated</span>
                    <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className={`font-headline-md text-headline-md font-semibold font-numeric-table tracking-tight ${env.isDeficit ? 'text-error' : 'text-on-surface'}`}>₹{env.spent.toLocaleString()}</span>
                        <span className="font-body-md text-body-md text-outline font-numeric-table">/ ₹{env.allocated.toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="font-label-sm text-label-sm text-outline font-semibold uppercase tracking-wider">{env.isDeficit ? 'Deficit' : 'Remaining Runway'}</span>
                    <span className={`font-body-lg text-body-lg font-semibold font-numeric-table tracking-tight mt-0.5 ${env.isDeficit ? 'text-error' : 'text-primary'}`}>
                        {env.isDeficit ? '-' : ''}₹{env.isDeficit ? Math.abs(env.remaining).toLocaleString() : env.remaining.toLocaleString()}
                    </span>
                </div>
            </div>
            
            <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-1">
                <div className={`${env.isDeficit ? 'bg-error' : 'bg-primary'} h-full rounded-full`} style={{width: `${Math.min(env.percent, 100)}%`}}></div>
            </div>
        </div>
    ))}
</div>
</div>
</div>

            {/* Adjust Allocations Modal */}
            {isBudgetModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-scrim/40 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
                    <div className="bg-surface w-full max-w-md rounded-xl shadow-2xl flex flex-col overflow-hidden border border-outline-variant/30" style={{ backgroundColor: 'white', maxHeight: '90vh' }}>
                        <div className="flex items-center justify-between px-space-lg py-space-md border-b border-outline-variant/30 bg-surface-container-low" style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
                            <h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 font-bold text-xl">
                                <span className="material-symbols-outlined text-secondary">tune</span>
                                Adjust Category Budgets
                            </h2>
                            <button onClick={() => setIsBudgetModalOpen(false)} className="p-1 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors">
                                <span className="material-symbols-outlined text-[20px]">close</span>
                            </button>
                        </div>
                        <div className="p-space-lg flex flex-col gap-space-md overflow-y-auto" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {Array.from(new Set([...Object.keys(budgetAllocations), ...Object.keys(categorySpending)])).map(cat => (
                                <div key={cat} className="flex flex-col gap-1">
                                    <label className="font-label-sm text-sm uppercase text-outline tracking-wider font-semibold">{cat}</label>
                                    <input 
                                        type="number"
                                        value={budgetAllocations[cat] || ''}
                                        onChange={(e) => {
                                            const val = e.target.value === '' ? '' : Number(e.target.value);
                                            setBudgetAllocations(prev => ({ ...prev, [cat]: val }));
                                        }}
                                        className="w-full h-10 px-3 bg-surface-container rounded border border-outline-variant/60 text-on-surface font-body-md focus:outline-none focus:border-secondary transition-colors"
                                        placeholder="0"
                                        style={{ width: '100%', height: '40px', padding: '0 10px', border: '1px solid #ccc', borderRadius: '4px' }}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end gap-space-sm p-space-lg border-t border-outline-variant/30" style={{ padding: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #ccc' }}>
                            <button onClick={() => setIsBudgetModalOpen(false)} className="px-4 h-10 rounded font-body-md font-medium text-on-surface hover:bg-surface-container transition-colors" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: '#f5f5f5', cursor: 'pointer' }}>Cancel</button>
                            <button onClick={() => {
                                set(ref(database, 'budget_allocations'), budgetAllocations);
                                setIsBudgetModalOpen(false);
                            }} className="px-6 h-10 rounded bg-secondary text-on-secondary font-body-md font-semibold shadow-sm hover:bg-on-secondary-fixed-variant transition-colors" style={{ padding: '8px 16px', borderRadius: '4px', border: 'none', backgroundColor: 'blue', color: 'white', cursor: 'pointer' }}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
</main>
        </div>
    );
};

export default Budgets;
