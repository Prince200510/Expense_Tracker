import React, {useState, useEffect} from 'react';
import './Expense.css';
import { AiOutlineFieldTime } from 'react-icons/ai';
import { getDatabase, ref, set, get, push, onValue, update } from "firebase/database";
import { initializeApp} from "firebase/app";
import Swal from 'sweetalert2'
import gpayImg from '../dynamic-page/img/gpay.jpg';
import phonePeImg from '../dynamic-page/img/phonepe.jpeg';
import paytmImg from '../dynamic-page/img/paytm.jpeg';
import cashImg from '../dynamic-page/img/cash.jpeg';
import bankImg from '../dynamic-page/img/bank.jpeg';
import atmImg from '../dynamic-page/img/atm.jpeg';

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

const Mainpage = () => {
    const [amount, setAmount] = useState(null);
    const [title, settitle] = useState('');
    const [expense_amount, setexpense_amount] = useState(null);
    const [description, setdescription] = useState('');
    const [payment_method, setpayment_method] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [add_title, setaddtitle] = useState('');
    const [add_amount, setaddamount] = useState(null);
    const [add_description, setadd_description] = useState('');
    const [add_method, setadd_method] = useState('');

    useEffect(() => {
        const amountDataRef = ref(database, 'amount');
        
        const unsubscribe = onValue(amountDataRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                console.log("Fetched data:", data); 
                const formattedAmount = parseFloat(data).toFixed(2);
                setAmount(formattedAmount);
            } else {
                console.log("No data available");
                setAmount(null);
            }
        }, (error) => {
            console.error("Error fetching data: ", error);
        });

        return () => unsubscribe();
    }, []);

      useEffect(() => {
        const expenseDataRef = ref(database, 'expense_data_history/');
        const unsubscribe = onValue(expenseDataRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const expenseList = Object.keys(data).map(key => ({
              id: key,
              ...data[key]
            }));
            setExpenses(expenseList.reverse());
          }
        });
    
    
        return () => unsubscribe();
      }, []);
      
    const expense_submit = async () => {
        if (!title || !expense_amount || !description || !payment_method) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill all the details',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
    
        const formatDateAndTime = () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); 
            const year = now.getFullYear();
            const date = `${day}/${month}/${year}`;
        
            const time = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        
            return { date, time };
        };
        
        const { date, time } = formatDateAndTime();
    
        try {
            const totalAmountRef = ref(database, 'amount');
            const snapshot = await get(totalAmountRef);
    
            if (snapshot.exists()) {
                const currentAmount = snapshot.val();
                console.log("Current amount fetched:", currentAmount); 
                if (isNaN(currentAmount)) {
                    throw new Error('Current amount is not a valid number');
                }
    
                const expenseAmount = parseFloat(expense_amount);
                const newAmount = currentAmount - expenseAmount;
                const formattedAmount_1 = parseFloat(newAmount).toFixed(2);
                console.log("Expense amount:", expenseAmount);
                console.log("New amount calculated:", newAmount); 
    
                if (formattedAmount_1 < 0) {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Not enough funds. Please adjust the expense amount.',
                        icon: 'error',
                        confirmButtonText: 'Ok'
                    });
                    return; 
                }
    
                const expenseDetails = {
                    title: title,
                    expense_amount: expenseAmount, 
                    description: description,
                    payment_method: payment_method,
                    total_amount: formattedAmount_1,
                    date: date,
                    time: time
                };
                const expenseDataRef = ref(database, 'expense_data_history');
                await push(expenseDataRef, expenseDetails);
    
                await set(totalAmountRef, formattedAmount_1);
    
                Swal.fire({
                    title: 'Success!',
                    text: 'Expense data stored successfully',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
    
                setexpense_amount('');
                settitle('');
                setdescription('');
                setpayment_method('');
            } else {
                throw new Error('Total amount not found in the database');
            }
    
        } catch (error) {
            console.error("Error storing data: ", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to store expense data',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
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
    const add_money = async () => {
        if (!add_title || !add_amount || !add_description || !add_method) {
            Swal.fire({
                title: 'Error!',
                text: 'Please fill all the details',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
            return;
        }
    
        const formatDateAndTime = () => {
            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0'); 
            const year = now.getFullYear();
            const date = `${day}/${month}/${year}`;
        
            const time = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true
            });
        
            return { date, time };
        };
        
        const { date, time } = formatDateAndTime();
    
        try {
            const totalAmountRef = ref(database, 'amount');
            const snapshot = await get(totalAmountRef);
    
            if (snapshot.exists()) {
                const currentAmount = snapshot.val();
                console.log("Current amount fetched:", currentAmount);
              
                if (isNaN(currentAmount)) {
                    throw new Error('Current amount is not a valid number');
                }
                const parsedcurrentamount = parseFloat(currentAmount);
                const amountToAdd = parseFloat(add_amount); 
                const newAmount = parsedcurrentamount + amountToAdd;
                const formattedAmount = parseFloat(newAmount).toFixed(2);
                console.log("Amount to add:", amountToAdd);
                console.log("New amount calculated:", newAmount);
    
           
                const expenseDetails = {
                    title: add_title, 
                    expense_amount: amountToAdd, 
                    description: add_description,
                    payment_method: add_method,
                    total_amount: formattedAmount,
                    date: date,
                    time: time,
                    data: 'credit'
                };
                const expenseDataRef = ref(database, 'expense_data_history');
                await push(expenseDataRef, expenseDetails);
                await set(totalAmountRef, formattedAmount);
    
                Swal.fire({
                    title: 'Success!',
                    text: 'Amount added successfully',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                });
    
                setaddamount('');
                setaddtitle('');
                setadd_description('');
                setadd_method('');
            } else {
                throw new Error('Total amount not found in the database');
            }
    
        } catch (error) {
            console.error("Error storing data: ", error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to store data',
                icon: 'error',
                confirmButtonText: 'Ok'
            });
        }
    };

    const getAmountDetails = (data) => {
        const isCredit = data === 'credit';
        return {
            amountStyle: {
                color: isCredit ? 'green' : 'red',
            },
            amountSign: isCredit ? '+' : '-'
        };
    };

    return(
        <>  
        <h2>Incomes</h2>
            <div class="income-container">
                <p>Total Income:</p>
                <span>{amount !== null ? amount : 'Loading...'}</span>
            </div>
            <div class="expense-body-details">
                <div class="add-expense-data">
                    <input type="text" placeholder='Title' value={title} onChange={(e) => settitle(e.target.value)}></input><br></br>
                    <input type="text" placeholder='Amount' value={expense_amount} onChange={(e) => setexpense_amount(e.target.value)}></input><br></br>
                    <input type="text" placeholder='Description' value={description} onChange={(e) => setdescription(e.target.value)} maxLength={25}></input><br></br>
                    <select  value={payment_method} onChange={(e) => setpayment_method(e.target.value)}>
                        <option>Select Option</option>
                        <option>Cash</option>
                        <option>Gpay</option>
                        <option>Phone pe</option>
                        <option>Paytm</option>
                        <option>Yono Bank</option>
                        <option>Deposit in Bank</option>
                        <option>Withdraw from Bank</option>
                        <option>Withdrawal from ATM</option>
                        <option>Others</option>
                    </select><br></br>
                    <button onClick={expense_submit}>+ Add Expense</button>
                </div>
                <div class="expense-history">
                    <div class="scroll-down">
                    {expenses.map(expense => {
                        const { amountStyle, amountSign } = getAmountDetails(expense.data);
                            return (
                                <div className="expense-data" key={expense.id}>
                                    <div className="expense-icons">
                                        <img
                                            src={paymentMethodLogos[normalizePaymentMethod(expense.payment_method)] || 'path/to/default-logo.png'}
                                            alt={expense.payment_method}
                                        />
                                    </div>
                                    <div className="expense-title">
                                        <p>{expense.title}</p>
                                        <div className="expense-money">
                                            <span style={amountStyle}>
                                                {amountSign}₹ {expense.expense_amount}
                                            </span>
                                            <h2 className="icon"><AiOutlineFieldTime /></h2>
                                            <h3>{expense.date} | {expense.time}</h3>
                                            <p style={{ color: "grey" }}>{expense.description}</p>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
                <div class="expense-history-phone">
                    <div class="scroll-down">
                    {expenses.map(expense => {
                        const { amountStyle, amountSign } = getAmountDetails(expense.data);
                            return (
                                <div className="expense-data" key={expense.id}>
                                    <div class="expense-data-phone">
                                        <div class="parent-expense-data-phone">
                                            <div class="phone-icon">
                                                <img src={paymentMethodLogos[normalizePaymentMethod(expense.payment_method)] || 'path/to/default-logo.png'} alt={expense.payment_method}/>
                                            </div>
                                            <div class="phone-data">
                                                <h3>{expense.title}</h3>
                                                <p>{expense.payment_method}</p>
                                            </div>
                                            <div class="expense-data-desc">
                                                <p style={{ color: "grey" }}>{expense.description}</p>
                                                <p>{expense.date} | {expense.time} | Balance: ₹ {parseFloat(expense.total_amount).toFixed(2)} | <span style={amountStyle}>
                                                    ₹ {parseFloat(expense.expense_amount).toFixed(2)} {amountSign}
                                                </span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                <div class="add-money">
                    <input type="text" placeholder='Title' value={add_title} onChange={(e) => setaddtitle(e.target.value)}></input>
                    <input type="text" placeholder='Add Money' value={add_amount} onChange={(e) => setaddamount(e.target.value)}></input>
                    <select value={add_method} onChange={(e) => setadd_method(e.target.value)}>
                        <option>Select Option</option>
                        <option>Cash</option>
                        <option>Gpay</option>
                        <option>Phone pe</option>
                        <option>Paytm</option>
                        <option>Yono Bank</option>
                        <option>Deposit in Bank</option>
                        <option>Withdraw from Bank</option>
                        <option>Withdrawal from ATM</option>
                        <option>Others</option>
                    </select><br></br>
                    <input type="text" placeholder='Description' maxLength={25} value={add_description} onChange={(e) => setadd_description(e.target.value)}></input>
                    <button onClick={add_money}>+ Add Money</button>
                </div>
        </>
    )
}

export default Mainpage;