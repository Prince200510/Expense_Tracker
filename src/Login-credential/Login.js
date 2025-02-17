import React, { useState, useEffect } from 'react';
import "./Login.css";
import { AiOutlineLock, AiOutlineUser } from 'react-icons/ai';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { Link, useNavigate, Route, Routes } from 'react-router-dom';

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

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    
    const handleSubmit = async () => {
        const trimmedUsername = username.trim();
        const userRef = ref(database, `Login/${trimmedUsername}`);
        get(userRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    if (userData && userData.password.toLowerCase() === password.toLowerCase()) {
                        setSuccessMessage('Login successful!');
                        setIsAuthenticated(true);
                        navigate('/Expense');
                        setUsername('');
                        setPassword('');
                    } else {
                        setErrorMessage('Password is incorrect.');
                    }
                } else {
                    setErrorMessage('Username is incorrect or not registered.');
                }
            })
            .catch((error) => {
                console.error('Error logging in: ', error);
                setErrorMessage('Error logging in. Please try again later.');
            });
    };
    return (
    <>
    <div className="login-container">
        <div className="parent-login">
            <h2>Login</h2>
            <input type='text' value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
            <h1><AiOutlineUser /></h1><br></br>
            <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password' /><br />
            <h2 className="password-icons"><AiOutlineLock /></h2>
            <button onClick={handleSubmit}>Login</button>
            {error && <p className="error-message">{error}</p>}
            {<p>{successMessage}</p>}
        </div>
    </div>
    </>
    )
};

export default Login;