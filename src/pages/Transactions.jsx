import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { parseTxDate } from '../utils/analytics';
import { ref, onValue, remove } from "firebase/database";
import { database } from '../services/firebase';
import QuickAddModal from '../components/Dashboard/QuickAddModal';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editTx, setEditTx] = useState(null);

    const today = new Date();
    const currentMonth = today.toLocaleString('default', { month: 'short' });
    const currentYear = today.getFullYear();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const dateRangeStr = `01 ${currentMonth} ${currentYear} - ${daysInMonth} ${currentMonth} ${currentYear}`;

    // Dynamic states
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('All');
    const [sortOrder, setSortOrder] = useState('newest');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedIds, setSelectedIds] = useState(new Set());

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this transaction?")) {
            const txRef = ref(database, 'expense_data_history/' + id);
            try {
                await remove(txRef);
            } catch (err) {
                console.error(err);
            }
        }
    };
    
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
    const depositsCount = transactions.filter(t => t.type === 'credit').length;
    const debitsCount = transactions.filter(t => t.type === 'debit').length;

    const filteredTransactions = useMemo(() => {
        let filtered = transactions;
        if (activeTab === 'Income') filtered = filtered.filter(t => t.type === 'credit');
        if (activeTab === 'Expenses') filtered = filtered.filter(t => t.type === 'debit');
        if (activeTab === 'Transfers') filtered = filtered.filter(t => false); // assuming no transfers for now

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(tx => 
                (tx.purpose && tx.purpose.toLowerCase().includes(query)) ||
                (tx.description && tx.description.toLowerCase().includes(query)) ||
                (tx.category && tx.category.toLowerCase().includes(query)) ||
                (tx.payment_method && tx.payment_method.toLowerCase().includes(query))
            );
        }

        return [...filtered].sort((a, b) => {
            const dateA = a.date ? parseTxDate(a.date) : new Date(0);
            const dateB = b.date ? parseTxDate(b.date) : new Date(0);
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });
    }, [transactions, activeTab, searchQuery, sortOrder]);

    const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
    const paginatedTransactions = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return filteredTransactions.slice(start, start + itemsPerPage);
    }, [filteredTransactions, currentPage, itemsPerPage]);

    // selection logic
    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedIds(new Set(paginatedTransactions.map(t => t.id)));
        } else {
            setSelectedIds(new Set());
        }
    };
    const handleSelectRow = (id) => {
        const newSet = new Set(selectedIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedIds(newSet);
    };

    // Ensure we don't end up on an empty page
    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    return (
        <div className="flex flex-col w-full h-full bg-surface">
            <main className="w-full pt-14 flex-1 bg-surface"><div className="flex flex-col w-full">
{/* Top Level Ledger Header Section */}
<section className="w-full px-margin py-space-md bg-surface-container-lowest shadow-sm flex flex-col gap-space-md">
<div className="flex flex-wrap items-center justify-between gap-gutter">
<div className="flex flex-col">
<div className="flex items-center gap-space-sm">
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight">Transaction Ledger &amp; General Journal</h1>
<span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-label-sm font-semibold tracking-wide uppercase">Audit Validated</span>
</div>
<p className="font-body-sm text-body-sm text-outline mt-0.5 flex items-center gap-1.5">
<span>Total {transactions.length} entries</span>
</p>
</div>
{/* Institutional Action Buttons */}
<div className="flex items-center gap-space-sm">
{/* Export Dropdown */}
<div className="relative inline-block text-left">
<Link to="/expense/download" className="h-8 px-3 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-body-md text-body-md font-medium flex items-center gap-1.5 transition-colors shadow-sm">
<span className="material-symbols-outlined text-[16px] text-outline">file_download</span>
<span>Export</span>
</Link>
</div>

<button onClick={() => setIsAddModalOpen(true)} className="h-8 px-3.5 rounded bg-primary hover:bg-primary-container text-on-primary font-body-md text-body-md font-semibold flex items-center gap-1.5 shadow-sm transition-all transform active:scale-95" >
<span className="material-symbols-outlined text-[18px]">add_circle</span>
<span>+ Add Transaction</span>
</button>
</div>
</div>
{/* Summary Key Financial Stat Strip */}
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter pt-space-xs">
<div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-caps text-label-caps uppercase text-outline">Total Fiscal Inflow</span>
<span className="font-numeric-metric text-numeric-metric text-on-surface mt-0.5 tracking-tight font-semibold">₹ {totalInflow.toLocaleString()}</span>
</div>
<div className="flex flex-col items-end">
 
<span className="font-label-sm text-label-sm text-outline mt-1">{depositsCount} deposits</span>
</div>
</div>
<div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-caps text-label-caps uppercase text-outline">Total Fiscal Outflow</span>
<span className="font-numeric-metric text-numeric-metric text-error mt-0.5 tracking-tight font-semibold">₹ {totalOutflow.toLocaleString()}</span>
</div>
<div className="flex flex-col items-end">
 
<span className="font-label-sm text-label-sm text-outline mt-1">{debitsCount} debits</span>
</div>
</div>
<div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-caps text-label-caps uppercase text-outline">Net Realized Surplus</span>
<span className="font-numeric-metric text-numeric-metric text-on-tertiary-container mt-0.5 tracking-tight font-semibold">+₹ {surplus.toLocaleString()}</span>
</div>
<div className="flex flex-col items-end">

<span className="font-label-sm text-label-sm text-outline mt-1">Liquidity High</span>
</div>
</div>
<div className="bg-surface-container-low p-space-sm rounded-lg flex items-center justify-between">
<div className="flex flex-col">
<span className="font-label-caps text-label-caps uppercase text-outline">Audit / Uncategorized</span>
<span className="font-numeric-metric text-numeric-metric text-on-surface mt-0.5 tracking-tight font-semibold">0 <span className="text-body-md font-normal text-outline">Items</span></span>
</div>
<div className="flex flex-col items-end">
<span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-secondary font-label-sm text-label-sm font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-[13px] text-secondary">check_circle</span> 100% Verified
          </span>
<span className="font-label-sm text-label-sm text-outline mt-1">Zero pending</span>
</div>
</div>
</div>
</section>
{/* Comprehensive Institutional ERP Filter Toolbar */}
<section className="w-full px-margin py-space-sm bg-surface-container-lowest/80 backdrop-blur shadow-sm flex flex-col gap-space-sm mt-1">
{/* Top Filter Controls Grid */}
<div className="grid grid-cols-1 md:grid-cols-12 gap-space-sm items-center">
{/* Search Input */}
<div className="md:col-span-4 relative">
<span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-outline text-[16px]">filter_list</span>
<input 
    className="w-full h-8 pl-8 pr-3 bg-surface-container-low rounded text-body-md font-body-md text-on-surface placeholder:text-outline focus:outline-none focus:bg-surface-container-lowest shadow-inner transition-colors" 
    placeholder="Filter by merchant, note, reference ID, UTR..." 
    type="text"
    value={searchQuery}
    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
/>
</div>
{/* Date Range Selector with Quick Presets */}
<div className="md:col-span-4 flex items-center gap-1 bg-surface-container-low p-0.5 rounded">
<div className="flex items-center gap-1.5 px-2 flex-1 text-on-surface font-body-sm text-body-sm">
<span className="material-symbols-outlined text-[15px] text-outline">date_range</span>
<span className="font-numeric-table font-medium truncate">{dateRangeStr}</span>
</div>
<div className="flex items-center gap-0.5">
<button className="px-1.5 py-0.5 bg-surface-container-lowest rounded text-label-sm font-label-sm text-on-surface shadow-sm hover:bg-surface-container">{currentMonth}</button>
<button className="px-1.5 py-0.5 rounded text-label-sm font-label-sm text-outline hover:text-on-surface">YTD</button>
</div>
</div>
{/* Sort Presets */}
<div className="md:col-span-4">
<button 
    onClick={() => setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest')}
    className="w-full h-8 px-2.5 bg-surface-container-low rounded flex items-center justify-between text-on-surface font-body-sm text-body-sm hover:bg-surface-container transition-colors"
>
<div className="flex items-center gap-1.5 truncate">
<span className="material-symbols-outlined text-[15px] text-outline">sort</span>
<span className="truncate">Date: {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}</span>
</div>
<span className="material-symbols-outlined text-[14px] text-outline">swap_vert</span>
</button>
</div>
</div>
{/* Secondary Row: Ledger Segment Tabs & Quick Status Filters */}
<div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs">
<div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded">
    <button onClick={() => { setActiveTab('All'); setCurrentPage(1); }} className={`px-3 py-1 rounded font-label-caps text-label-caps font-semibold transition-colors ${activeTab === 'All' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>All Ledger ({transactions.length})</button>
    <button onClick={() => { setActiveTab('Income'); setCurrentPage(1); }} className={`px-3 py-1 rounded font-label-caps text-label-caps font-semibold transition-colors ${activeTab === 'Income' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Income ({depositsCount})</button>
    <button onClick={() => { setActiveTab('Expenses'); setCurrentPage(1); }} className={`px-3 py-1 rounded font-label-caps text-label-caps font-semibold transition-colors ${activeTab === 'Expenses' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Expenses ({debitsCount})</button>
    <button onClick={() => { setActiveTab('Transfers'); setCurrentPage(1); }} className={`px-3 py-1 rounded font-label-caps text-label-caps font-semibold transition-colors ${activeTab === 'Transfers' ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>Transfers &amp; Sweeps (0)</button>
</div>
{/* Active Filter Badges & Reset Trigger */}
<div className="flex items-center gap-2">
<span className="font-label-sm text-label-sm text-outline font-medium mr-1 uppercase">ACTIVE:</span>
<button onClick={() => { setSearchQuery(''); setActiveTab('All'); setSortOrder('newest'); setCurrentPage(1); }} className="text-secondary hover:underline font-label-sm text-label-sm ml-1">Reset All</button>
</div>
</div>
</section>
{/* Institutional High-Density Data Table Section */}
<section className="w-full px-margin py-space-sm flex-1 overflow-x-auto">
<div className="w-full bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden flex flex-col">
{/* Table Header & Batch Control Bar */}
<div className="w-full bg-surface-container-low px-space-md py-space-xs flex items-center justify-between">
<div className="flex items-center gap-space-sm font-body-sm text-body-sm text-on-surface-variant">
<input 
    className="rounded w-3.5 h-3.5 text-primary focus:ring-0 cursor-pointer" 
    type="checkbox"
    checked={paginatedTransactions.length > 0 && selectedIds.size === paginatedTransactions.length}
    onChange={handleSelectAll}
/>
<span className="font-medium">{selectedIds.size} of {paginatedTransactions.length} Selected in Page</span>
</div>
<div className="flex items-center gap-space-md font-label-sm text-label-sm text-outline">
<span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-on-tertiary-container"></span> Real-time ERP Synced</span>
<span>Ledger Currency: INR (₹)</span>
</div>
</div>
{/* Main Ledger Table */}
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low font-label-caps text-label-caps text-outline uppercase tracking-wider h-10 select-none">
<th className="w-10 px-space-md text-center">
    <input 
        className="rounded w-3.5 h-3.5 text-primary focus:ring-0 cursor-pointer" 
        type="checkbox"
        checked={paginatedTransactions.length > 0 && selectedIds.size === paginatedTransactions.length}
        onChange={handleSelectAll}
    />
</th>
<th className="px-space-sm py-2 font-semibold">Date &amp; Stamp</th>
<th className="px-space-md py-2 font-semibold">Merchant / Counterparty</th>
<th className="px-space-sm py-2 font-semibold">Category</th>
<th className="px-space-sm py-2 font-semibold">Account / Source</th>
<th className="px-space-sm py-2 font-semibold">Status</th>
<th className="px-space-md py-2 font-semibold text-right">Amount (₹)</th>
<th className="px-space-sm py-2 font-semibold text-center w-24">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-transparent font-body-md text-body-md">
                        {paginatedTransactions.length === 0 ? (
                            <tr><td colSpan="8" className="text-center py-4">No transactions found.</td></tr>
                        ) : (
                            paginatedTransactions.map((tx, idx) => (
                                <tr key={tx.id} className={`h-10 transition-colors group ${idx % 2 === 1 ? 'bg-surface-container-lowest' : ''} hover:bg-surface-container-low/60`}>
                                    <td className="px-space-md text-center">
                                        <input 
                                            className="rounded w-3.5 h-3.5 text-primary focus:ring-0 cursor-pointer" 
                                            type="checkbox"
                                            checked={selectedIds.has(tx.id)}
                                            onChange={() => handleSelectRow(tx.id)}
                                        />
                                    </td>
                                    <td className="px-space-sm whitespace-nowrap font-numeric-table text-label-sm text-on-surface-variant">
                                        {tx.date} {tx.time && `, ${tx.time}`}
                                    </td>
                                    <td className="px-space-md whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded bg-surface-container-high text-on-surface flex items-center justify-center font-bold text-[10px] tracking-tight">
                                                {tx.purpose ? tx.purpose.substring(0, 2).toUpperCase() : 'TX'}
                                            </div>
                                            <div className="flex flex-col leading-none">
                                                <span className="font-medium text-on-surface">{tx.purpose || 'Unknown'}</span>
                                                {tx.description && (
                                                    <span className="text-[10px] font-numeric-table text-outline mt-0.5">{tx.description}</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-space-sm whitespace-nowrap">
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface-container rounded text-label-sm font-label-sm text-on-surface">
                                            {tx.category || 'General'}
                                        </span>
                                    </td>
                                    <td className="px-space-sm whitespace-nowrap">
                                        <span className="px-1.5 py-0.5 rounded bg-surface-container-low text-on-surface-variant font-label-sm text-label-sm font-medium">
                                            {tx.payment_method || 'Bank'}
                                        </span>
                                    </td>
                                    <td className="px-space-sm whitespace-nowrap">
                                        <span className="px-2 py-0.5 rounded bg-surface-variant text-on-tertiary-container font-label-sm text-label-sm font-medium">Cleared</span>
                                    </td>
                                    <td className={`px-space-md whitespace-nowrap text-right font-numeric-table text-body-md font-semibold ${tx.type === 'credit' ? 'text-on-tertiary-container' : 'text-error'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}₹ {Number(tx.amount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-space-sm whitespace-nowrap text-center">
                                        <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setEditTx(tx); setIsAddModalOpen(true); }} className="p-1 text-outline hover:text-on-surface rounded"><span className="material-symbols-outlined text-[16px]">edit</span></button>
                                            <button onClick={() => handleDelete(tx.id)} className="p-1 text-outline hover:text-on-surface rounded"><span className="material-symbols-outlined text-[16px]">delete</span></button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
</table>
</div>
{/* Precision ERP Table Footer & Pagination */}
<div className="w-full bg-surface-container-low/70 px-space-md py-space-xs flex flex-wrap items-center justify-between gap-gutter select-none">
<div className="flex items-center gap-space-md font-body-sm text-body-sm text-outline">
<span>Showing <strong className="text-on-surface font-semibold font-numeric-table">{paginatedTransactions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</strong> of <strong className="text-on-surface font-semibold font-numeric-table">{filteredTransactions.length}</strong> records</span>
<div className="flex items-center gap-1.5 ml-2">
<span>Rows:</span>
<select 
    className="bg-surface-container-lowest text-on-surface font-body-sm text-body-sm rounded px-2 py-0.5 shadow-sm focus:outline-none"
    value={itemsPerPage}
    onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}
>
<option value={10}>10</option>
<option value={25}>25</option>
<option value={50}>50</option>
<option value={100}>100</option>
</select>
</div>
</div>
{/* Pagination Controls */}
<div className="flex items-center gap-1">
    <button 
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="h-7 px-2 bg-surface-container-lowest text-outline rounded hover:text-on-surface font-body-sm text-body-sm disabled:opacity-40 flex items-center shadow-sm"
    >
        <span className="material-symbols-outlined text-[16px]">chevron_left</span>
    </button>
    
    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        let pageNum;
        if (totalPages <= 5) {
            pageNum = i + 1;
        } else if (currentPage <= 3) {
            pageNum = i + 1;
        } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i;
        } else {
            pageNum = currentPage - 2 + i;
        }
        return (
            <button 
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`h-7 w-7 font-numeric-table text-label-sm font-semibold rounded shadow-sm ${currentPage === pageNum ? 'bg-primary text-on-primary' : 'bg-surface-container-lowest text-on-surface hover:bg-surface-container'}`}
            >
                {pageNum}
            </button>
        );
    })}

    {totalPages > 5 && currentPage < totalPages - 2 && (
        <>
            <span className="px-1 text-outline font-numeric-table text-label-sm">...</span>
            <button 
                onClick={() => setCurrentPage(totalPages)}
                className="h-7 w-7 bg-surface-container-lowest text-on-surface hover:bg-surface-container font-numeric-table text-label-sm rounded shadow-sm"
            >
                {totalPages}
            </button>
        </>
    )}

    <button 
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages || totalPages === 0}
        className="h-7 px-2 bg-surface-container-lowest text-on-surface rounded hover:bg-surface-container font-body-sm text-body-sm flex items-center shadow-sm disabled:opacity-40"
    >
        <span className="material-symbols-outlined text-[16px]">chevron_right</span>
    </button>
</div>
</div>
</div>
</section>
        </div>
        </main>
            <QuickAddModal isOpen={isAddModalOpen} onClose={() => { setIsAddModalOpen(false); setEditTx(null); }} editTx={editTx} />
        </div>
    );
};

export default Transactions;
