import React from 'react';
import ReactDOM from 'react-dom/client';
import LoginPage from './LoginPage';
import Dashboard from "./Dashboard";
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import ResetPass from "./ResetPass";
import DonutChart from "./Dashboard"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<DonutChart />} />
            <Route path="/reset-password" element={<ResetPass />} />
        </Routes>
    </Router>
);
