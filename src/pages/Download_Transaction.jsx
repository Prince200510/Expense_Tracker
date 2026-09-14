import React, { useState, useEffect } from 'react';
import { ref, onValue } from "firebase/database";
import { database } from '../services/firebase';
import { AiOutlineDownload } from 'react-icons/ai';
import jsPDF from 'jspdf';
import 'jspdf-autotable';



const Download_Transaction = () => {
    const [month, setMonth] = useState('');
    const [historydata, setHistoryData] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const expenseDataRef = ref(database, 'expense_data_history/');
        const unsubscribe = onValue(expenseDataRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const expenseList = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setHistoryData(expenseList.reverse());
            }
        });

        return () => unsubscribe();
    }, []);

    const download = () => {
        const filteredData = historydata.filter(expense => {
            if (!month) return true;
            const expenseMonth = expense.date.split('/')[1];
            return expenseMonth === month;
        });

        if (filteredData.length === 0) {
            setMessage('No transaction found');
            return;
        }

        const doc = new jsPDF();
        const startX = 10;
        const startY = 10;
        const pageWidth = doc.internal.pageSize.getWidth();
        const maxWidth = pageWidth - 2 * startX;
        doc.setFont("times", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(10);
        doc.text("Name: Prince Maurya", startX, startY);
        doc.setTextColor(255, 0, 0);
        const noteText = "note: This is personal transaction, this is not official any bank statement";
        doc.text(noteText, startX, startY + 4, { maxWidth: maxWidth });
        doc.setTextColor(0, 0, 0);
        doc.text(`Transactions for Month: ${month}`, startX, startY + 8);


        const currentDate = new Date();
        const currentDateString = currentDate.toLocaleString();
        doc.text("--------------------------------------------------------------------------------------------------------------------------------------------------------------",10,21);
        doc.text(`Generated on: ${currentDateString}`, 10, 25);

        doc.autoTable({
            head: [['Payment Method', 'Amount', 'CR/DR','Title', 'Date', 'Time', 'Description']],
            
            body: filteredData.map(expense => [
                
                expense.payment_method || '-',
                `${expense.amount || expense.expense_amount || 0}`,
                (expense.type || expense.data || '').toUpperCase(),
                expense.purpose || expense.title || '-',
                expense.date,
                expense.time,
                expense.description || '-'
            ]),
            startY: 30,
            didParseCell: function (data) {
                if (data.column.index === 1) { // Assuming amount is in the 2nd column
                    const expense = filteredData[data.row.index];
                    const typeStr = expense.type || expense.data;
                    if (typeStr === 'credit') {
                        data.cell.styles.textColor = [1, 255, 0]; // Green color for credit
                    } else {
                        data.cell.styles.textColor = [255, 0, 0]; // Red color for non-credit
                    }
                }
            }
        });
        doc.save(`transactions_${month}.pdf`);
    };

    return (
        <>
            <h2>Download Transaction</h2>
            <div className="add-expense-data">
                <select value={month} onChange={(e) => setMonth(e.target.value)} style={{ marginRight: '20px' }}>
                    <option value="">Select month</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                </select>
                <button onClick={download}><AiOutlineDownload /> Download</button>
            </div>
            <p>{message}</p>
        </>
    );
};

export default Download_Transaction;
