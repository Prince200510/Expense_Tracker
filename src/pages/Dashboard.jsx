import React, { useState, useEffect } from 'react';
import { ref, onValue, push } from "firebase/database";
import { database } from '../services/firebase';
import { calculateAnalytics, parseTxDate, filterTransactionsByPeriod } from '../utils/analytics';
import DesktopView from '../components/Dashboard/DesktopView';
import MobileView from '../components/Dashboard/MobileView';

const Dashboard = () => {
    const [allTransactions, setAllTransactions] = useState([]);
    const [timeFilter, setTimeFilter] = useState('6M');
    const [isLoaded, setIsLoaded] = useState(false);

    const transactions = React.useMemo(() => filterTransactionsByPeriod(allTransactions, timeFilter), [allTransactions, timeFilter]);
    const analytics = React.useMemo(() => calculateAnalytics(transactions), [transactions]);

    useEffect(() => {
        const expenseDataRef = ref(database, 'expense_data_history/');
        const unsubscribe = onValue(expenseDataRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const expenseList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setAllTransactions(expenseList.reverse());
                setIsLoaded(true);

                // --- AUTO ROLLOVER LOGIC ---
                // Automatically save surplus at the end of past months
                const today = new Date();
                const currentMonth = today.getMonth();
                const currentYear = today.getFullYear();
                
                const monthlyNet = {};
                expenseList.forEach(tx => {
                    if (!tx.date) return;
                    const txDate = parseTxDate(tx.date);
                    const txMonth = txDate.getMonth();
                    const txYear = txDate.getFullYear();
                    
                    if (txYear > currentYear || (txYear === currentYear && txMonth >= currentMonth)) {
                        return;
                    }
                    
                    const key = `${txYear}-${txMonth}`;
                    if (!monthlyNet[key]) {
                        monthlyNet[key] = { inflow: 0, outflow: 0, hasAutoSave: false, monthNum: txMonth, yearNum: txYear };
                    }
                    
                    if (tx.purpose === 'Auto System Saved') {
                        monthlyNet[key].hasAutoSave = true;
                    }
                    
                    if (tx.type === 'credit') {
                        monthlyNet[key].inflow += Number(tx.amount || 0);
                    } else if (tx.type === 'debit') {
                        monthlyNet[key].outflow += Number(tx.amount || 0);
                    }
                });
                
                for (const key in monthlyNet) {
                    const mData = monthlyNet[key];
                    const net = mData.inflow - mData.outflow;
                    if (net > 0 && !mData.hasAutoSave) {
                        const lastDay = new Date(mData.yearNum, mData.monthNum + 1, 0);
                        const dateStr = lastDay.toLocaleDateString('en-GB'); 
                        const timeStr = "23:59";
                        
                        const newTx = {
                            amount: net.toString(),
                            purpose: "Auto System Saved",
                            type: "debit",
                            date: dateStr,
                            time: timeStr,
                            category: "Savings",
                            payment_method: "System",
                            description: "End of month surplus automatically saved"
                        };
                        
                        push(expenseDataRef, newTx);
                    }
                }
                // --- END AUTO ROLLOVER ---

            } else {
                setAllTransactions([]);
                setIsLoaded(true);
            }
        });

        return () => unsubscribe();
    }, []);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center h-full w-full py-20">
                <span className="material-symbols-outlined animate-spin text-4xl text-secondary">autorenew</span>
            </div>
        );
    }

    return (
        <>
            <div className="hidden md:flex w-full h-full">
                <DesktopView transactions={transactions} analytics={analytics} timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
            </div>
            <div className="flex md:hidden w-full h-full">
                <MobileView transactions={transactions} analytics={analytics} timeFilter={timeFilter} setTimeFilter={setTimeFilter} />
            </div>
        </>
    );
};

export default Dashboard;