import { Routes, Route, Navigate  } from 'react-router-dom';
import Dashboard from './Dashboard';
import Transactions from './Transactions';
import Download_Transaction from './Download_Transaction';
import Save_note from './Save_note';
import DashboardLayout from '../layouts/DashboardLayout';

import Budgets from './Budgets';
import Reports from './Reports';

const Expense = ({ setIsAuthenticated }) => {
    return (
        <DashboardLayout setIsAuthenticated={setIsAuthenticated}>
            <Routes>
                <Route path="/" element={<Navigate to="main" />} />
                <Route path="main" element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="budgets" element={<Budgets />} />
                <Route path="reports" element={<Reports />} />
                <Route path="download" element={<Download_Transaction />} />
                <Route path="savenote" element={<Save_note />} />
            </Routes>
        </DashboardLayout>
    );
};

export default Expense;
