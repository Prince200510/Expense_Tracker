import React from 'react';

const MobileView = ({ analytics, transactions, timeFilter, setTimeFilter }) => {
    // Note: surplusNum here acts as Current Balance in the new design
    const surplusNum = analytics?.netSurplus || 0;
    const inflowNum = analytics?.totalInflow || 0;
    const outflowNum = analytics?.totalOutflow || 0;
    
    const balance = surplusNum.toLocaleString('en-IN');
    const income = inflowNum.toLocaleString('en-IN');
    const expenses = outflowNum.toLocaleString('en-IN');
    
    // Calculate running balance based on newest-first transactions
    let runningBalance = surplusNum;
    const transactionsWithBalance = (transactions || []).map(tx => {
        const balanceAtTime = runningBalance;
        const isIncome = tx.type === 'credit';
        const amount = Number(tx.amount || 0);
        if (isIncome) {
            runningBalance -= amount;
        } else {
            runningBalance += amount;
        }
        return { ...tx, balanceAtTime };
    });

    const cycleTimeFilter = () => {
        const filters = ['7D', '30D', '3M', '6M', '1Y', 'YTD'];
        const currentIndex = filters.indexOf(timeFilter || '30D');
        const nextIndex = (currentIndex + 1) % filters.length;
        if(setTimeFilter) setTimeFilter(filters[nextIndex]);
    };
    
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#F8F9FA] pb-28 md:hidden">
            {/* HERO SECTION - Purple Gradient */}
            <div className="relative w-full rounded-b-[40px] overflow-hidden bg-gradient-to-br from-[#A88BFA] via-[#8B5CF6] to-[#7C3AED] px-6 pt-8 pb-32">
                {/* Decorative glowing circles */}
                <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                <div className="absolute top-20 -right-20 w-48 h-48 bg-purple-400/20 rounded-full blur-2xl pointer-events-none"></div>
                
                {/* Header Actions (Date Pill & Notifications) */}
                <div className="relative z-10 flex items-center justify-between mt-12 mb-8">
                    <div className="flex-1"></div>
                    <button onClick={cycleTimeFilter} className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white text-[13px] font-medium shadow-sm active:scale-95 transition-transform">
                        <span>{timeFilter || 'This Month'}</span>
                        <span className="material-symbols-outlined text-[16px]">expand_more</span>
                    </button>
                    <div className="flex-1 flex justify-end">
                        <button onClick={() => alert('No new notifications')} className="relative w-9 h-9 rounded-full bg-white/10 border border-white/20 backdrop-blur-md flex items-center justify-center text-white active:scale-95 transition-transform">
                            <span className="material-symbols-outlined text-[18px]">notifications</span>
                            <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.8)] border border-purple-500"></span>
                        </button>
                    </div>
                </div>

                {/* Balance Display */}
                <div className="relative z-10 flex flex-col items-center mt-2 text-white">
                    <span className="text-[13px] font-medium text-white/80 uppercase tracking-wider mb-1">Current Balance</span>
                    <div className="flex items-start gap-1">
                        <span className="text-3xl font-light mt-1.5">₹</span>
                        <span className="text-5xl font-bold tracking-tight">{balance}</span>
                    </div>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-medium text-white/90">
                        <span className="material-symbols-outlined text-[14px]">trending_up</span>
                        <span>Solid surplus this period</span>
                    </div>
                </div>
            </div>

            {/* OVERLAPPING CONTENT CARD */}
            <div className="px-5 -mt-20 relative z-20">
                <div className="bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-50 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                            <span className="text-gray-800 font-bold text-[17px]">Your Money</span>
                            <span className="material-symbols-outlined text-[16px] text-gray-400">info</span>
                        </div>
                        <button onClick={() => window.location.href = '/expense/reports'} className="text-[13px] font-medium text-gray-400 flex items-center gap-0.5 hover:text-gray-600 transition-colors">
                            Details
                            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Income Block */}
                        <div className="flex flex-col p-4 rounded-2xl bg-blue-50/50 border border-blue-100/50">
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3 text-blue-500 shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500 text-[12px] font-medium">Income</span>
                                <span className="material-symbols-outlined text-[14px] text-gray-400">info</span>
                            </div>
                            <span className="text-gray-900 font-bold text-[18px] mt-0.5">₹{income}</span>
                        </div>
                        
                        {/* Expenses Block */}
                        <div className="flex flex-col p-4 rounded-2xl bg-red-50/50 border border-red-100/50">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mb-3 text-red-500 shadow-sm">
                                <span className="material-symbols-outlined text-[20px]">account_balance</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-gray-500 text-[12px] font-medium">Expenses</span>
                                <span className="material-symbols-outlined text-[14px] text-gray-400">info</span>
                            </div>
                            <span className="text-gray-900 font-bold text-[18px] mt-0.5">₹{expenses}</span>
                        </div>
                    </div>


                </div>
            </div>

            {/* TRANSACTIONS LIST */}
            <div className="px-5 mt-8 flex flex-col gap-5">
                <div className="flex items-center justify-between">
                    <h3 className="text-gray-800 font-bold text-[18px]">Transactions</h3>
                    <div className="flex items-center gap-3">
                        <button onClick={cycleTimeFilter} className="text-gray-400 hover:text-gray-600 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">filter_list</span>
                        </button>
                        <button onClick={cycleTimeFilter} className="px-3 py-1.5 rounded-full bg-purple-100 text-purple-600 text-[11px] font-bold uppercase tracking-wider">
                            For {timeFilter || 'the Period'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    {/* Date Header */}
                    <div className="flex items-center justify-between px-1">
                        <span className="text-gray-500 font-medium text-[13px]">Recent Activity</span>
                        <span className="text-gray-800 font-bold text-[13px]">Total ₹{expenses}</span>
                    </div>

                    {/* Transaction Items */}
                    <div className="flex flex-col gap-3">
                        {transactionsWithBalance && transactionsWithBalance.length > 0 ? (
                            transactionsWithBalance.slice(0, 5).map(tx => {
                                const isIncome = tx.type === 'credit';
                                return (
                                    <div key={tx.id || Math.random()} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] border border-gray-100">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${isIncome ? 'bg-blue-50 text-blue-500' : 'bg-red-50 text-red-500'}`}>
                                                <span className="material-symbols-outlined text-[24px]">
                                                    {isIncome ? 'payments' : 'shopping_bag'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-gray-900 font-bold text-[15px]">{tx.description || tx.category || 'Transaction'}</span>
                                                <div className="flex items-center gap-1.5 mt-0.5">
                                                    <span className="material-symbols-outlined text-[14px] text-gray-400">tag</span>
                                                    <span className="text-gray-500 text-[12px]">{tx.category || 'General'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className={`font-bold text-[15px] ${isIncome ? 'text-green-500' : 'text-red-500'}`}>
                                                {isIncome ? '+' : '-'}₹{Number(tx.amount || 0).toLocaleString('en-IN')}
                                            </span>
                                            <span className="text-gray-400 text-[12px] mt-0.5 font-medium">Bal: ₹{Number(tx.balanceAtTime || 0).toLocaleString('en-IN')}</span>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="p-6 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 border-dashed">
                                No recent activity
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileView;
