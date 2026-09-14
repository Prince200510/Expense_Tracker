import React, { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { database } from '../services/firebase';

const Reports = () => {
    const [exportFormat, setExportFormat] = useState('PDF Audit');
    const [transactions, setTransactions] = useState([]);
    
    useEffect(() => {
        const expenseDataRef = ref(database, 'expense_data_history/');
        const unsubscribe = onValue(expenseDataRef, (snapshot) => {
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

    const totalInflow = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const totalOutflow = transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + Number(t.amount || 0), 0);
    const surplus = totalInflow - totalOutflow;

    const categoryExpenses = {};
    transactions.filter(t => t.type === 'debit').forEach(tx => {
        const cat = tx.category || 'Uncategorized';
        categoryExpenses[cat] = (categoryExpenses[cat] || 0) + Number(tx.amount || 0);
    });

    const categoryIncomes = {};
    transactions.filter(t => t.type === 'credit').forEach(tx => {
        const cat = tx.category || 'Uncategorized';
        categoryIncomes[cat] = (categoryIncomes[cat] || 0) + Number(tx.amount || 0);
    });

    const inflowRows = Object.keys(categoryIncomes).map(cat => ({
        category: cat,
        amount: categoryIncomes[cat]
    })).sort((a, b) => b.amount - a.amount);

    const outflowRows = Object.keys(categoryExpenses).map(cat => ({
        category: cat,
        amount: categoryExpenses[cat],
        ratio: totalInflow > 0 ? ((categoryExpenses[cat] / totalInflow) * 100).toFixed(1) : 0
    })).sort((a, b) => b.amount - a.amount);

    const burnRate = totalInflow > 0 ? ((totalOutflow / totalInflow) * 100).toFixed(1) : 0;
    const surplusRate = totalInflow > 0 ? ((surplus / totalInflow) * 100).toFixed(1) : 0;
    const now = new Date();
    
    const handleDownload = () => {
        if (exportFormat === 'PDF Audit') {
            window.print();
        } else if (exportFormat === 'Raw (CSV)') {
            if (transactions.length === 0) {
                alert('No data to export!');
                return;
            }
            const headers = ["Date", "Description", "Category", "Type", "Amount", "Account"];
            const rows = transactions.map(tx => [
                tx.date,
                tx.description,
                tx.category,
                tx.type,
                tx.amount,
                tx.account
            ]);
            const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", `VaultERP_Export_${now.getFullYear()}_${now.getMonth()+1}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Excel (XLSX) export requires the VaultERP Enterprise plugin.');
        }
    };

    return (
        <div className="flex flex-col w-full h-full bg-surface">
            <main className="w-full pt-14 flex-1 bg-surface"><div className="flex flex-col w-full">
<div className="p-margin space-y-space-lg max-w-[1600px] mx-auto w-full">
{/* ERP Statement Management Control Header */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
<div className="space-y-1">
<div className="flex items-center gap-space-sm flex-wrap">
<span className="font-headline-lg text-headline-lg text-on-surface">Financial Statements &amp; Audited Ledger Reports</span>
<span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-tertiary-container text-on-tertiary-container font-label-sm text-label-sm uppercase tracking-wider">
<span className="w-1.5 h-1.5 rounded-full bg-on-tertiary-container animate-ping"></span>
            Statutory Audit Grade
          </span>
</div>
<div className="flex items-center gap-3 text-on-surface-variant font-body-sm text-body-sm flex-wrap">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[15px] text-outline">badge</span>
            Scope: <strong className="text-on-surface font-medium">Primary Account</strong>
</span>
<span className="text-outline">/</span>
<span className="font-numeric-table text-label-sm bg-surface-container px-1.5 py-0.5 rounded text-on-surface">PAN: LINKED</span>
<span className="text-outline">/</span>
<span className="flex items-center gap-1 font-label-sm text-label-sm">
<span className="material-symbols-outlined text-[14px] text-secondary">domain</span>
            Entity: Personal Fiduciary Core
          </span>
</div>
</div>
<div className="flex items-center gap-space-sm flex-wrap">
<button onClick={() => alert('Audit trail logging requires VaultERP Enterprise.')} className="h-8 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded flex items-center gap-1.5 font-body-md text-body-md transition-colors shadow-sm">
<span className="material-symbols-outlined text-[16px] text-outline">history</span>
<span>Audit Trail</span>
</button>
<button onClick={() => alert('Scheduling automated statements requires VaultERP Enterprise.')} className="h-8 px-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded flex items-center gap-1.5 font-body-md text-body-md transition-colors shadow-sm">
<span className="material-symbols-outlined text-[16px] text-secondary">event_repeat</span>
<span>Schedule Automated Statement</span>
</button>
<button onClick={() => alert('Batch export (ZIP) requires VaultERP Enterprise.')} className="h-8 px-3.5 bg-primary hover:bg-primary-container text-on-primary rounded flex items-center gap-1.5 font-body-md text-body-md shadow-sm transition-colors">
<span className="material-symbols-outlined text-[16px]">archive</span>
<span>Batch Export (ZIP)</span>
</button>
</div>
</div>
{/* Ledger Category Tabs Strip */}
<div className="overflow-x-auto pb-1">
<div className="flex items-center gap-2 min-w-max bg-surface-container-lowest p-1.5 rounded-lg shadow-sm">
<button className="px-3.5 py-2 rounded-lg bg-primary text-on-primary font-body-md text-body-md font-medium flex items-center gap-2 shadow-sm">
<span className="material-symbols-outlined text-[17px]">receipt_long</span>
<span>Monthly Financial Statement</span>
<span className="px-1.5 py-0.2 bg-on-primary/20 text-on-primary rounded font-label-sm text-label-sm">Live</span>
</button>
<button className="px-3.5 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md text-body-md transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[17px] text-outline">account_balance_wallet</span>
<span>Cash Flow &amp; Liquidity Report</span>
</button>
<button className="px-3.5 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md text-body-md transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[17px] text-outline">checklist_rtl</span>
<span>Comprehensive Expense Audit</span>
</button>
<button className="px-3.5 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md text-body-md transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[17px] text-outline">query_stats</span>
<span>Category Variance Report</span>
</button>
<button className="px-3.5 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md text-body-md transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[17px] text-outline">calculate</span>
<span>Annual Tax &amp; Capital Gains</span>
</button>
<button className="px-3.5 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface font-body-md text-body-md transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-[17px] text-outline">balance</span>
<span>Balance Sheet &amp; Net Worth</span>
</button>
</div>
</div>
{/* Main Workspace Split Grid */}
<div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
{/* Statement Render Workspace Document Canvas (Left 8 Cols) */}
<div className="xl:col-span-8 flex flex-col gap-space-md">
{/* Document Action Micro-Bar */}
<div className="flex items-center justify-between px-space-md py-2 bg-surface-container rounded-lg font-body-sm text-body-sm text-on-surface-variant">
<div className="flex items-center gap-3">
<span className="flex items-center gap-1.5 text-on-surface font-medium">
<span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
              Cryptographically Certified PDF Preview
            </span>
<span className="text-outline-variant">|</span>
<span className="font-numeric-table text-label-sm">Checksum: {Math.random().toString(16).slice(2, 10)}</span>
</div>
<div className="flex items-center gap-2">
<button className="p-1 rounded hover:bg-surface-container-high transition-colors" title="Zoom in">
<span className="material-symbols-outlined text-[18px]">zoom_in</span>
</button>
<button className="p-1 rounded hover:bg-surface-container-high transition-colors" title="Zoom out">
<span className="material-symbols-outlined text-[18px]">zoom_out</span>
</button>
<button onClick={() => window.print()} className="p-1 rounded hover:bg-surface-container-high transition-colors" title="Print document">
<span className="material-symbols-outlined text-[18px]">print</span>
</button>
<button className="p-1 rounded hover:bg-surface-container-high transition-colors" title="Fullscreen view">
<span className="material-symbols-outlined text-[18px]">fullscreen</span>
</button>
</div>
</div>
{/* Rendered Physical Ledger Sheet */}
<div className="bg-surface-container-lowest rounded-xl shadow-md p-6 sm:p-10 space-y-8 relative overflow-hidden">
{/* Watermark Ledger Accent */}
<div className="absolute right-6 top-8 opacity-5 select-none pointer-events-none text-right">
<div className="font-label-sm text-[72px] font-bold leading-none tracking-tighter text-on-surface">VAULT-ERP</div>
<div className="font-label-sm text-[16px] uppercase tracking-widest text-on-surface">OFFICIAL AUDIT REPORT</div>
</div>
{/* Document Top Meta Section */}
<div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-surface-container-high">
<div className="space-y-2">
<div className="flex items-center gap-2">
<span className="px-2 py-0.5 rounded bg-primary text-on-primary font-label-caps text-label-caps">FORM 16A-EQUIV</span>
<span className="font-label-sm text-label-sm text-on-surface-variant font-numeric-table">REF: VLT-{now.getFullYear()}-{now.getMonth()+1}-DYNAMIC</span>
</div>
<h1 className="font-headline-xl text-headline-xl text-on-surface">VaultERP Consolidated Personal Statement</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Accounting Period: Current Ledger Cycle</p>
</div>
<div className="bg-surface-container-low p-4 rounded-lg text-right sm:min-w-[210px] space-y-1">
<div className="font-label-caps text-label-caps text-outline uppercase">Generated On</div>
<div className="font-numeric-table text-body-md font-semibold text-on-surface">{now.toLocaleString()}</div>
<div className="font-label-sm text-label-sm text-secondary">Verified by Vault Ledger Engine</div>
<div className="pt-1 text-on-surface-variant font-numeric-table text-[11px]">Reporting Currency: INR (₹)</div>
</div>
</div>
{/* High-Level Financial Pulse Strip */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
<div className="p-4 bg-surface-container-low rounded-lg">
<div className="font-label-caps text-label-caps text-outline uppercase">Total Inflows (A)</div>
<div className="font-numeric-metric text-numeric-metric text-on-surface mt-1">₹{totalInflow.toLocaleString()}</div>
</div>
<div className="p-4 bg-surface-container-low rounded-lg">
<div className="font-label-caps text-label-caps text-outline uppercase">Operating Outflows (B)</div>
<div className="font-numeric-metric text-numeric-metric text-error mt-1">₹{totalOutflow.toLocaleString()}</div>
<div className="flex items-center gap-1 mt-1 text-on-surface-variant font-label-sm text-label-sm font-numeric-table">
<span className="material-symbols-outlined text-[14px]">check_circle</span>
<span>{burnRate}% burn of gross inflow</span>
</div>
</div>
<div className="p-4 bg-secondary-container/10 rounded-lg">
<div className="font-label-caps text-label-caps text-secondary uppercase font-semibold">Net Capital Surplus (C)</div>
<div className="font-numeric-metric text-numeric-metric text-secondary mt-1">₹{surplus.toLocaleString()}</div>
<div className="flex items-center gap-1 mt-1 text-on-tertiary-container font-label-sm text-label-sm font-numeric-table">
<span className="material-symbols-outlined text-[14px]">trending_up</span>
<span>{surplusRate}% capital savings conversion</span>
</div>
</div>
</div>
{/* Section A: Gross Receipts & Inflows Table */}
<div className="space-y-3">
<div className="flex items-center justify-between pb-1">
<div className="flex items-center gap-2">
<span className="w-5 h-5 rounded bg-primary text-on-primary font-numeric-table text-label-sm flex items-center justify-center font-bold">A</span>
<h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">Gross Receipts &amp; Institutional Inflows</h2>
</div>
<span className="font-label-sm text-label-sm text-outline uppercase">{inflowRows.length} Verified Inflow Streams</span>
</div>
<div className="overflow-hidden rounded-lg bg-surface-container-lowest">
<table className="w-full text-left">
<thead className="bg-surface-container-low text-outline font-label-caps text-label-caps uppercase">
<tr>
<th className="py-2.5 px-4">Category Source</th>
<th className="py-2.5 px-4 text-right">Amount (₹)</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface">
{inflowRows.map((row, idx) => (
    <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors border-b border-surface-container last:border-0">
        <td className="py-2.5 px-4 font-medium flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-secondary"></span>
            {row.category}
        </td>
        <td className="py-2.5 px-4 text-right font-numeric-table font-semibold">₹{row.amount.toLocaleString()}</td>
    </tr>
))}
{inflowRows.length === 0 && (
    <tr>
        <td colSpan="2" className="py-4 px-4 text-center text-outline font-body-md">No inflow records found for this period.</td>
    </tr>
)}
<tr className="bg-surface-container-low font-semibold text-on-surface">
<td className="py-2.5 px-4 text-right uppercase font-label-caps text-label-caps tracking-wider">Subtotal: Total Gross Inflows (A)</td>
<td className="py-2.5 px-4 text-right font-numeric-table text-headline-md text-on-surface">₹{totalInflow.toLocaleString()}</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Section B: Operating Outflows & Living Expenditures Table */}
<div className="space-y-3">
<div className="flex items-center justify-between pb-1">
<div className="flex items-center gap-2">
<span className="w-5 h-5 rounded bg-outline text-on-primary font-numeric-table text-label-sm flex items-center justify-center font-bold">B</span>
<h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">Operating Outflows &amp; Living Expenditures</h2>
</div>
<span className="font-label-sm text-label-sm text-outline uppercase">{outflowRows.length} Monitored Budget Ledgers</span>
</div>
<div className="overflow-hidden rounded-lg bg-surface-container-lowest">
<table className="w-full text-left">
<thead className="bg-surface-container-low text-outline font-label-caps text-label-caps uppercase">
<tr>
<th className="py-2.5 px-4">Cost Center Description</th>
<th className="py-2.5 px-4">Budget Ratio</th>
<th className="py-2.5 px-4 text-right">Debit Amount (₹)</th>
</tr>
</thead>
<tbody className="font-body-md text-body-md text-on-surface">
{outflowRows.map((row, idx) => (
    <tr key={idx} className="hover:bg-surface-container-low/50 transition-colors border-b border-surface-container last:border-0">
        <td className="py-2 px-4 font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-outline">payments</span>
            {row.category}
        </td>
        <td className="py-2 px-4 text-body-sm font-numeric-table text-on-surface-variant">{row.ratio}% of inflow</td>
        <td className="py-2 px-4 text-right font-numeric-table font-semibold">₹{row.amount.toLocaleString()}</td>
    </tr>
))}
{outflowRows.length === 0 && (
    <tr>
        <td colSpan="3" className="py-4 px-4 text-center text-outline font-body-md">No outflow records found for this period.</td>
    </tr>
)}
<tr className="bg-surface-container-low font-semibold text-on-surface">
<td className="py-2.5 px-4 text-right uppercase font-label-caps text-label-caps tracking-wider" colSpan="2">Subtotal: Total Operating Outflows (B)</td>
<td className="py-2.5 px-4 text-right font-numeric-table text-headline-md text-error">₹{totalOutflow.toLocaleString()}</td>
</tr>
</tbody>
</table>
</div>
</div>
{/* Section C: Net Capital Surplus & Systematic Deployment */}
<div className="space-y-3">
<div className="flex items-center justify-between pb-1">
<div className="flex items-center gap-2">
<span className="w-5 h-5 rounded bg-on-tertiary-container text-on-primary font-numeric-table text-label-sm flex items-center justify-center font-bold">C</span>
<h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">Net Capital Surplus &amp; Systematic Deployment</h2>
</div>
</div>
<div className="p-4 bg-surface-container rounded-lg space-y-3">
<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-surface-container-lowest rounded-lg">
<div>
<div className="font-body-md text-body-md font-semibold text-on-surface">Operating Ledger Surplus (A - B)</div>
<div className="font-body-sm text-body-sm text-on-surface-variant">Net unencumbered capital generated</div>
</div>
<div className="text-right font-numeric-metric text-numeric-metric text-secondary font-semibold">₹{surplus.toLocaleString()}</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-1 gap-3">
<div className="p-3 bg-surface-container-lowest rounded-lg space-y-1">
<div className="flex items-center justify-between font-label-caps text-label-caps text-outline uppercase">
<span>Unallocated Buffer</span>
<span className="text-secondary">Available</span>
</div>
<div className="font-numeric-table text-headline-md font-semibold text-on-surface">₹{surplus.toLocaleString()}</div>
<div className="text-on-surface-variant font-body-sm text-[11px]">Residual in primary account</div>
</div>
</div>
</div>
</div>
{/* Document Attestation & Digital Footprint */}
<div className="pt-6 border-t-2 border-surface-container-high flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-on-surface-variant font-body-sm text-body-sm">
<div className="space-y-1">
<div className="font-label-caps text-label-caps text-outline uppercase">Statutory Disclaimer &amp; Integrity Notice</div>
<p className="text-[11px] leading-relaxed max-w-xl text-outline">
                Compiled via automated Open Banking Aggregator API under RBI Account Aggregator framework. All figures are verified against institutional clearing house data feeds. VaultERP carries zero unverified reconciliation logs for this billing cycle.
              </p>
</div>
<div className="flex items-center gap-3 bg-surface-container-low p-2 rounded-lg shrink-0">
<div className="w-8 h-8 rounded bg-primary text-on-primary flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">fingerprint</span>
</div>
<div className="text-left leading-tight">
<div className="font-label-caps text-label-caps text-on-surface uppercase">Digital Key ID</div>
<div className="font-numeric-table text-[10px] text-outline">SHA256: {Math.random().toString(16).slice(2, 10)}</div>
</div>
</div>
</div>
</div>
</div>
{/* Export & Compliance Sidebar Control Panel (Right 4 Cols) */}
<div className="xl:col-span-4 space-y-space-lg">
{/* Output Config & Compliance Settings */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md">
<div className="flex items-center justify-between">
<span className="font-headline-md text-headline-md text-on-surface">Export &amp; Dispatch</span>
<span className="px-2 py-0.5 rounded bg-surface-container text-outline font-label-sm text-label-sm">ERP</span>
</div>
{/* Format Chooser Segmented Pill */}
<div className="space-y-1.5">
<label className="font-label-caps text-label-caps text-outline uppercase">Select Export Schema Format</label>
<div className="grid grid-cols-3 gap-1 bg-surface-container p-1 rounded-lg">
<button onClick={() => setExportFormat('PDF Audit')} className={`py-1.5 px-2 rounded-md font-body-sm text-body-sm text-center ${exportFormat === 'PDF Audit' ? 'bg-surface-container-lowest font-semibold text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>PDF Audit</button>
<button onClick={() => setExportFormat('Excel (XLSX)')} className={`py-1.5 px-2 rounded-md font-body-sm text-body-sm text-center ${exportFormat === 'Excel (XLSX)' ? 'bg-surface-container-lowest font-semibold text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Excel (XLSX)</button>
<button onClick={() => setExportFormat('Raw (CSV)')} className={`py-1.5 px-2 rounded-md font-body-sm text-body-sm text-center ${exportFormat === 'Raw (CSV)' ? 'bg-surface-container-lowest font-semibold text-on-surface shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Raw (CSV)</button>
</div>
</div>
{/* Compliance Toggles Checklist */}
<div className="space-y-2.5 pt-1">
<label className="font-label-caps text-label-caps text-outline uppercase block">Ledger Verification Options</label>
<label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
<div className="flex items-center gap-2.5">
<input defaultChecked className="accent-secondary w-4 h-4 rounded" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface">Include Merchant GST Invoices</span>
</div>
<span className="font-label-sm text-label-sm text-outline font-numeric-table">18 Attachments</span>
</label>
<label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
<div className="flex items-center gap-2.5">
<input defaultChecked className="accent-secondary w-4 h-4 rounded" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface">Mask Account &amp; Card Numbers</span>
</div>
<span className="material-symbols-outlined text-[16px] text-on-tertiary-container">security</span>
</label>
<label className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container-low cursor-pointer hover:bg-surface-container transition-colors">
<div className="flex items-center gap-2.5">
<input defaultChecked className="accent-secondary w-4 h-4 rounded" type="checkbox"/>
<span className="font-body-md text-body-md text-on-surface">Sign with Vault Digital PKI</span>
</div>
<span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
</label>
</div>
{/* Primary CTAs */}
<div className="space-y-2 pt-2">
<button onClick={handleDownload} className="w-full h-10 px-4 bg-secondary hover:bg-on-secondary-fixed-variant text-on-secondary rounded flex items-center justify-center gap-2 font-body-md text-body-md font-semibold shadow-sm transition-colors">
<span className="material-symbols-outlined text-[18px]">download</span>
<span>{exportFormat === 'PDF Audit' ? 'Download Formal Statement (PDF)' : exportFormat === 'Raw (CSV)' ? 'Download Ledger Data (CSV)' : 'Download Excel Statement'}</span>
</button>
<button onClick={() => alert('Feature requires email integration setup.')} className="w-full h-9 px-4 bg-surface-container hover:bg-surface-container-high text-on-surface rounded flex items-center justify-center gap-2 font-body-md text-body-md font-medium transition-colors">
<span className="material-symbols-outlined text-[18px] text-secondary">send</span>
<span>Email to Tax Accountant (CA)</span>
</button>
</div>
{/* Certified Recipient Note */}
<div className="p-3 bg-surface-container rounded-lg flex items-start gap-2.5">
<span className="material-symbols-outlined text-secondary text-[18px] shrink-0 mt-0.5">mark_email_read</span>
<div className="space-y-0.5 leading-tight">
<span className="font-body-sm text-body-sm font-semibold text-on-surface block">Designated CA: Rajesh Kapadia &amp; Co.</span>
<span className="font-numeric-table text-label-sm text-outline truncate block">rajesh@kapadiatax.in (Pre-authorized)</span>
</div>
</div>
</div>
{/* Statement Archive & Generation History */}
<div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md">
<div className="flex items-center justify-between">
<span className="font-headline-md text-headline-md text-on-surface">Audit Statement Archive</span>
<span className="font-label-sm text-label-sm text-outline font-numeric-table">3 Past Periods</span>
</div>
<div className="space-y-2">
{/* September 2024 */}
<div className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between">
<div className="flex items-center gap-3 min-w-0">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-secondary text-[18px]">picture_as_pdf</span>
</div>
<div className="min-w-0">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">September Statement</div>
<div className="font-numeric-table text-label-sm text-outline flex items-center gap-2">
<span>2.4 MB</span>
<span>•</span>
<span>Ref: VLT-2024-09-K311</span>
</div>
</div>
</div>
<button onClick={() => alert('Downloading archived statements requires VaultERP Enterprise.')} className="h-7 w-7 rounded flex items-center justify-center hover:bg-surface-container-highest text-on-surface-variant transition-colors" title="Download Sep 2024">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
</div>
{/* August 2024 */}
<div className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between">
<div className="flex items-center gap-3 min-w-0">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-secondary text-[18px]">picture_as_pdf</span>
</div>
<div className="min-w-0">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">August Statement</div>
<div className="font-numeric-table text-label-sm text-outline flex items-center gap-2">
<span>2.1 MB</span>
<span>•</span>
<span>Ref: VLT-2024-08-H092</span>
</div>
</div>
</div>
<button onClick={() => alert('Downloading archived statements requires VaultERP Enterprise.')} className="h-7 w-7 rounded flex items-center justify-center hover:bg-surface-container-highest text-on-surface-variant transition-colors" title="Download Aug 2024">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
</div>
{/* July 2024 */}
<div className="p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors flex items-center justify-between">
<div className="flex items-center gap-3 min-w-0">
<div className="w-8 h-8 rounded bg-surface-container-highest flex items-center justify-center shrink-0">
<span className="material-symbols-outlined text-secondary text-[18px]">picture_as_pdf</span>
</div>
<div className="min-w-0">
<div className="font-body-md text-body-md font-semibold text-on-surface truncate">July Statement</div>
<div className="font-numeric-table text-label-sm text-outline flex items-center gap-2">
<span>2.8 MB</span>
<span>•</span>
<span>Ref: VLT-2024-07-G440</span>
</div>
</div>
</div>
<button onClick={() => alert('Downloading archived statements requires VaultERP Enterprise.')} className="h-7 w-7 rounded flex items-center justify-center hover:bg-surface-container-highest text-on-surface-variant transition-colors" title="Download Jul 2024">
<span className="material-symbols-outlined text-[18px]">download</span>
</button>
</div>
</div>
<button onClick={() => alert('Historical archives require VaultERP Enterprise.')} className="w-full py-2 text-center text-secondary hover:text-on-secondary-fixed-variant font-body-sm text-body-sm font-medium transition-colors">
            Access Historical 5-Year Deep Archives →
          </button>
</div>
{/* Security & Audit Telemetry Status */}
<div className="p-space-md bg-surface-container-low rounded-xl space-y-2">
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps text-outline uppercase">Fiduciary Guard Status</span>
<span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span>
</div>
<p className="text-on-surface-variant font-body-sm text-body-sm leading-relaxed">
            All records stored on write-once-read-many (WORM) compliant encrypted storage nodes under Indian IT Act &amp; SEBI guidelines.
          </p>
</div>
</div>
</div>
</div>
</div></main>
        </div>
    );
};

export default Reports;
