import React, { useState, useEffect } from 'react';
import { AiOutlineLock, AiOutlineUser, AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { ref, get } from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { database } from '../services/firebase';

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    
    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setErrorMessage('');
        
        if (!username || !password) {
            setErrorMessage('Please enter both username and password.');
            return;
        }

        setIsLoading(true);
        const trimmedUsername = username.trim();
        const userRef = ref(database, `Login/${trimmedUsername}`);
        
        try {
            const snapshot = await get(userRef);
            if (snapshot.exists()) {
                const userData = snapshot.val();
                if (userData && String(userData.password).toLowerCase() === String(password).toLowerCase()) {
                    // Set local storage token
                    const token = btoa(JSON.stringify({ user: trimmedUsername, time: Date.now() }));
                    localStorage.setItem('vault_auth_token', token);
                    localStorage.setItem('vault_user', trimmedUsername);
                    
                    setIsAuthenticated(true);
                    navigate('/Expense');
                } else {
                    setErrorMessage('Invalid credentials. Please try again.');
                }
            } else {
                setErrorMessage('Account not found. Please verify your username.');
            }
        } catch (err) {
            console.error('Error logging in: ', err);
            setErrorMessage('Secure connection failed. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#0A0A0A] font-sans overflow-hidden">
            {/* Left Side - Visual Abstract Background */}
            <div className="hidden md:flex md:w-[55%] relative">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0" 
                    style={{ backgroundImage: "url('/login-bg.jpg')" }}
                ></div>
                {/* Gradient Overlay for blending */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#0A0A0A]/50 to-[#0A0A0A] z-10"></div>
                
                {/* Branding */}
                <div className="relative z-20 p-12 flex flex-col justify-between h-full w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                            <span className="material-symbols-outlined text-white text-[24px]">account_balance</span>
                        </div>
                        <span className="text-white font-bold text-2xl tracking-tight">VaultERP</span>
                    </div>
                    <div className="max-w-md">
                        <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 tracking-tight">
                            Command your wealth with precision.
                        </h1>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Access your private financial intelligence dashboard. Secure, real-time, and built for total portfolio dominion.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form Panel */}
            <div className="w-full md:w-[45%] flex items-center justify-center p-6 sm:p-12 relative z-20">
                <div className="w-full max-w-[420px] bg-[#121212]/80 backdrop-blur-xl border border-white/5 p-8 sm:p-10 rounded-3xl shadow-2xl">
                    <div className="md:hidden flex items-center gap-3 mb-10">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center shadow-lg">
                            <span className="material-symbols-outlined text-white text-[18px]">account_balance</span>
                        </div>
                        <span className="text-white font-bold text-xl tracking-tight">VaultERP</span>
                    </div>

                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome back</h2>
                        <p className="text-sm text-gray-400">Authenticate to decrypt your ledger</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                                    <AiOutlineUser className="text-lg" />
                                </div>
                                <input 
                                    type="text" 
                                    value={username} 
                                    onChange={(e) => setUsername(e.target.value)} 
                                    className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                                    placeholder="Enter your username"
                                    autoComplete="username"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Secure Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-emerald-400 transition-colors">
                                    <AiOutlineLock className="text-lg" />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    className="w-full bg-[#0A0A0A] border border-white/10 text-white text-sm rounded-xl py-3.5 pl-11 pr-12 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all shadow-inner"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-white transition-colors focus:outline-none"
                                >
                                    {showPassword ? <AiOutlineEyeInvisible className="text-lg" /> : <AiOutlineEye className="text-lg" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs py-2.5 px-3.5 rounded-lg flex items-start gap-2 animate-pulse">
                                <span className="material-symbols-outlined text-[16px] shrink-0 mt-0.5">error</span>
                                <span>{error}</span>
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-white hover:bg-gray-100 text-black font-semibold text-sm rounded-xl py-3.5 mt-4 transition-all flex items-center justify-center gap-2 shadow-lg shadow-white/5 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Establish Secure Connection
                                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                                </>
                            )}
                        </button>
                    </form>
                    
                    <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[14px] text-emerald-500">verified_user</span>
                            End-to-End Encrypted
                        </div>
                        <div className="font-mono">v2.1.0-secure</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;