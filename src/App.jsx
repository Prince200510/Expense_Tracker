import logo from './logo.svg';
import './App.css';
import { Link, useNavigate, useLocation, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Expense from './pages/Expense';
import React, {useState, useEffect} from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('vault_auth_token');
    if (!token) return false;
    
    try {
      const decoded = JSON.parse(atob(token));
      const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;
      if (Date.now() - decoded.time > THIRTY_DAYS) {
        localStorage.removeItem('vault_auth_token');
        localStorage.removeItem('vault_user');
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  });

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={
          isAuthenticated ? <Navigate to="/expense" replace /> : <Login setIsAuthenticated={setIsAuthenticated} />
        } />
        <Route path="/expense/*" element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Expense setIsAuthenticated={setIsAuthenticated} />
          </PrivateRoute>
        } />
        <Route path="*" element={
          isAuthenticated ? <Navigate to="/expense" replace /> : <Navigate to="/" replace />
        } />
      </Routes>
    </div>
  );
}

const PrivateRoute = ({ isAuthenticated, children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

export default App;
