const fs = require('fs');
let out = fs.readFileSync('scratch/out.jsx', 'utf8');

const prefix = `import React from 'react';
import { calculateAnalytics } from '../../utils/analytics';

const DesktopView = ({ analytics, transactions }) => {
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
    const budgetCap = 200000;
    const unallocatedBuffer = budgetCap - outflowNum;
    const spentPercent = ((outflowNum / budgetCap) * 100).toFixed(1);

    const categorySpending = {};
    transactions.forEach(tx => {
        if (tx.type === 'debit') {
            const cat = tx.category || 'General';
            categorySpending[cat] = (categorySpending[cat] || 0) + (parseFloat(tx.amount) || 0);
        }
    });
    const sortedCategories = Object.entries(categorySpending).sort((a, b) => b[1] - a[1]);

    return (
        <div className="flex flex-col w-full">
`;

const suffix = `
        </div>
    );
};

export default DesktopView;
`;

// Simple dynamic replacements inside the JSX string for testing:
out = out.replace(/₹14,285,420/g, '₹{netWorth}');
out = out.replace(/₹4,85,000/g, '₹{inflow}');
out = out.replace(/₹1,64,280/g, '₹{outflow}');
out = out.replace(/\+₹3,20,720/g, '₹{surplus}');
out = out.replace(/₹45,720/g, '₹{unallocatedBuffer.toLocaleString()}');
out = out.replace(/66\.1%/g, '{savingsVelocity}%');

fs.writeFileSync('scratch/DesktopView_Full.jsx', prefix + out + suffix);
console.log('File written!');
