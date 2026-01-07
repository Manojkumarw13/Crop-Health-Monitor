import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Scan from './pages/Scan';
import Recommend from './pages/Recommend';
import Weather from './pages/Weather';
import History from './pages/History';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-background"></div>
      <Navbar />
      <div style={{ paddingBottom: '4rem' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/scan" element={<Scan />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
