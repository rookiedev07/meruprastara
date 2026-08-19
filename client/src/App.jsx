import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { MeruProvider } from './context/MeruContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import RecursionTreePage from './pages/RecursionTreePage';
import BenchmarkPage from './pages/BenchmarkPage';
import HistoricalPage from './pages/HistoricalPage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';

function App() {
  return (
    <MeruProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
          <Navbar />
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/tree" element={<RecursionTreePage />} />
              <Route path="/benchmark" element={<BenchmarkPage />} />
              <Route path="/history" element={<HistoricalPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </MeruProvider>
  );
}

export default App;
