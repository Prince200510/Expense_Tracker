import './Expense.css';
import { Routes, Route, Link, Navigate  } from 'react-router-dom';
import Mainpage from './Mainpage';
import Transaction from './Transaction';
import Download_Transaction from './Download_Transaction';
import Save_note from './Save_note';
import { AiFillDashboard, AiOutlineTransaction, AiOutlineDownload, AiOutlineSave } from 'react-icons/ai';

const Expense = () => {
    return (
        <>
            <div className="expense-body-container">
                <div className="expense-container">
                    <div className="user-details">
                        <div className="user-profile">
                            <div className="user-img">
                                <img src='../img.jpg' alt="User" />
                            </div>
                            <div className="user-info">
                                <h2>Prince Maurya</h2>
                                <p>Your Money</p>
                            </div>
                        </div>
                        <hr></hr>
                        <div className="user-nav-bar">
                            <div className="nav-bar">
                                <ul>
                                    <li><Link to="main"><AiFillDashboard /> Dashboard</Link></li>
                                    <li><Link to="transaction"><AiOutlineTransaction /> View Transaction</Link></li>
                                    <li><Link to="download"><AiOutlineDownload /> Download Transaction</Link></li>
                                    <li><Link to="savenote"><AiOutlineSave /> Save note</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="expense-details">
                        <Routes>
                            <Route path="/" element={<Navigate to="main" />} />
                            <Route path="main" element={<Mainpage />} />
                            <Route path="transaction" element={<Transaction />} />
                            <Route path="download" element={<Download_Transaction />} />
                            <Route path="savenote" element={<Save_note />} />
                        </Routes>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Expense;
