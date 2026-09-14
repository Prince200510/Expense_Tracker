export const calculateAnalytics = (transactions) => {
    let totalInflow = 0;
    let totalOutflow = 0;

    transactions.forEach(tx => {
        const amount = parseFloat(tx.amount) || 0;
        if (tx.type === 'credit') {
            totalInflow += amount;
        } else {
            totalOutflow += amount;
        }
    });

    const netSurplus = totalInflow - totalOutflow;
    const totalNetWorth = netSurplus;
    const savingsVelocity = totalInflow > 0 ? ((netSurplus / totalInflow) * 100).toFixed(1) : 0;

    return {
        totalInflow,
        totalOutflow,
        netSurplus,
        totalNetWorth,
        savingsVelocity
    };
};

export const parseTxDate = (dStr) => {
    if(!dStr) return new Date();
    if(dStr.includes('/')) {
        const [d, m, y] = dStr.split('/');
        return new Date(y, m - 1, d);
    }
    if(dStr.includes('-')) {
        const parts = dStr.split('-');
        if(parts[0].length === 4) return new Date(dStr);
        return new Date(parts[2], parts[1]-1, parts[0]);
    }
    return new Date(dStr);
};

export const filterTransactionsByPeriod = (transactions, period) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    let cutoff = new Date(today);

    switch (period) {
        case '7D':
            cutoff.setDate(today.getDate() - 7);
            break;
        case '30D':
            cutoff.setDate(today.getDate() - 30);
            break;
        case '3M':
            cutoff.setMonth(today.getMonth() - 3);
            break;
        case '6M':
            cutoff.setMonth(today.getMonth() - 6);
            break;
        case '1Y':
            cutoff.setFullYear(today.getFullYear() - 1);
            break;
        case 'YTD':
            cutoff = new Date(today.getFullYear(), 0, 1);
            break;
        default:
            cutoff.setMonth(today.getMonth() - 6); // default 6M
    }

    return transactions.filter(tx => {
        if (!tx.date) return false;
        const txDate = parseTxDate(tx.date);
        return txDate >= cutoff && txDate <= today;
    });
};

