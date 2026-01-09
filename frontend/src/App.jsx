import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Scan from './pages/Scan';
import Recommend from './pages/Recommend';
import Weather from './pages/Weather';
import History from './pages/History';
import ChatWidget from './components/ChatWidget';
import PremiumDashboard from './pages/PremiumDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* New Premium Dashboard Route - Standalone Layout */}
        <Route path="/" element={<PremiumDashboard />} />

        {/* Legacy Routes - Keep old Navbar and Styles */}
        <Route path="/scan" element={<LegacyLayout><Scan /></LegacyLayout>} />
        <Route path="/recommend" element={<LegacyLayout><Recommend /></LegacyLayout>} />
        <Route path="/weather" element={<LegacyLayout><Weather /></LegacyLayout>} />
        <Route path="/history" element={<LegacyLayout><History /></LegacyLayout>} />
      </Routes>
    </Router>
  );
}

// Wrapper for legacy pages to maintain existing look
const LegacyLayout = ({ children }) => (
  <>
    <div className="app-background"></div>
    <Navbar />
    <div style={{ paddingBottom: '4rem' }}>
      {children}
    </div>
    {/* Use old chat widget or new one? Using old for legacy consistency, or we could just remove it if new one is enough. Keeping old for now to be safe. */}
    <ChatWidget /> 
  </>
);

export default App;
