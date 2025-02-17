import logo from './logo.svg';
import './App.css';
import { Link, useNavigate, useLocation, Route, Routes } from 'react-router-dom';
import Login from './Login-credential/Login';
import Expense from './dynamic-page/Expense';
import React, {useState, useEffect} from 'react';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/expense/*" element={
          <PrivateRoute isAuthenticated={isAuthenticated}>
            <Expense />
          </PrivateRoute>
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
