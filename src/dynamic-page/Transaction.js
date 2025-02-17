import react, {useState, useEffect} from 'react';
import { getDatabase, ref, set, get, push, onValue, update } from "firebase/database";
import { initializeApp} from "firebase/app";
import gpayImg from '../dynamic-page/img/gpay.jpg';
import phonePeImg from '../dynamic-page/img/phonepe.jpeg';
import paytmImg from '../dynamic-page/img/paytm.jpeg';
import cashImg from '../dynamic-page/img/cash.jpeg';
import bankImg from '../dynamic-page/img/bank.jpeg';
import atmImg from '../dynamic-page/img/atm.jpeg';
import { AiOutlineFieldTime } from 'react-icons/ai';
import './Transaction.css';

const firebaseConfig = {
    apiKey: "AIzaSyD1XsSEliGNIDSssSme2DNuFpSllCYKcgc",
    authDomain: "expense-1abe9.firebaseapp.com",
    projectId: "expense-1abe9",
    storageBucket: "expense-1abe9.appspot.com",
    messagingSenderId: "263700836599",
    appId: "1:263700836599:web:a3073a338efe5fba0d63f2",
    measurementId: "G-7JC08M5B4S"
  };
  
  const firebaseApp = initializeApp(firebaseConfig);
  const database = getDatabase(firebaseApp);

const Transaction = () => {
    const [month, setMonth] = useState('');
    const [historydata, sethistorydata] = useState([]);
    const [filteredData, setFilteredData] = useState([]);

    const getAmountDetails = (data) => {
        const isCredit = data === 'credit';
        return {
            amountStyle: {
                color: isCredit ? 'green' : 'red',
            },
            amountSign: isCredit ? '+' : '-'
        };
    };

    const normalizePaymentMethod = (method) => {
        switch (method) {
            case 'Gpay':
                return 'gpay';
            case 'Phone pe':
                return 'phone_pe'; 
            case 'Paytm':
                return 'paytm';
            case 'Cash':
                return 'cash';
            case 'Yono Bank':
                return 'bank';
            case 'Withdrawl from ATM':
                return 'atm';
            default:
                return 'bank'; 
        }
    };
    const paymentMethodLogos = {
        gpay: gpayImg,
        phone_pe: phonePeImg,
        paytm: paytmImg,
        cash: cashImg,
        bank: bankImg,
        atm: atmImg
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
            sethistorydata(expenseList.reverse());
          }
        });
    
    
        return () => unsubscribe();
      }, []);
      const search = () => {
        const filtered = historydata.filter(expense => {
            if (!month) return true; // If no month is selected, show all data
            const expenseMonth = expense.date.split('/')[1]; // Extract month from date
            return expenseMonth === month;
        });
        setFilteredData(filtered);
    };

    return (
        <>
            <h2>Transaction</h2>
            <div class="add-expense-data">
                <select value={month} onChange={(e) => setMonth(e.target.value)} style={{marginRight: '20px'}}>
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
                <button onClick={search}>Search</button>
                </div>
                                       
                <div className="history-data">
                    <table>
                        <thead>
                            <tr>
                                <th>Payment-Type</th>
                                <th>Payment-Method</th>
                                <th>Amount</th>
                                <th>Title</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Description</th>
                            </tr>
                        </thead>
                        <tbody>
                        {filteredData.length > 0 ? (
                            filteredData.map(expense => {
                                const { amountStyle, amountSign } = getAmountDetails(expense.data);
                                return (
                                    <tr key={expense.id}>
                                        <td><img src={paymentMethodLogos[normalizePaymentMethod(expense.payment_method)] || 'path/to/default-logo.png'} alt={expense.payment_method}/></td>
                                        <td>{expense.payment_method}</td>
                                        <td><span style={amountStyle}>{amountSign}₹ {expense.expense_amount}</span></td>
                                        <td>{expense.title}</td>
                                        <td>{expense.date}</td>
                                        <td>{expense.time}</td>
                                        <td>{expense.description}</td>
                                    </tr>
                                );
                            })
                            ) : (
                                <tr>
                                    <td colSpan="7"><p>No transactions Found</p></td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
        </>
    )
}

export default Transaction;