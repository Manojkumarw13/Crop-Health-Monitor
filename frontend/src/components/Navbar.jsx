import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaLeaf, FaRobot, FaCloudSun, FaHistory } from 'react-icons/fa';

const Navbar = () => {
    const location = useLocation();
    
    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="glass-panel" style={{ 
            margin: '1rem 2rem', 
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: '1rem',
            zIndex: 100
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                <FaLeaf /> <span>AgriAI</span>
            </div>
            
            <div className="nav-links" style={{ display: 'flex', gap: '2rem' }}>
                <NavLink to="/" icon={<FaLeaf />} text="Home" active={isActive('/')} />
                <NavLink to="/scan" icon={<FaLeaf />} text="Scan" active={isActive('/scan')} />
                <NavLink to="/recommend" icon={<FaLeaf />} text="Recommend" active={isActive('/recommend')} />
                <NavLink to="/weather" icon={<FaCloudSun />} text="Weather" active={isActive('/weather')} />
                <NavLink to="/history" icon={<FaHistory />} text="History" active={isActive('/history')} />
            </div>
        </nav>
    );
};

const NavLink = ({ to, icon, text, active }) => (
    <Link to={to} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        textDecoration: 'none',
        color: active ? 'var(--primary)' : 'var(--text-main)',
        fontWeight: active ? '600' : '400',
        transition: 'color 0.2s'
    }}>
        {icon} {text}
    </Link>
);

export default Navbar;
