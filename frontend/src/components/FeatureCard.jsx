import React from 'react';
import { Link } from 'react-router-dom';

const FeatureCard = ({ title, description, icon, to, image }) => {
  return (
    <Link to={to} style={{ textDecoration: 'none' }}>
        <div className="glass-panel feature-card" style={{ 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            height: '100%',
            transition: 'transform 0.3s',
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {image && (
                <div style={{ 
                    position: 'absolute', 
                    top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundImage: `url(${image})`, 
                    backgroundSize: 'cover', 
                    opacity: 0.2, 
                    zIndex: -1 
                }} />
            )}
            <div style={{ fontSize: '2rem', color: 'var(--primary)' }}>{icon}</div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)' }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{description}</p>
        </div>
    </Link>
  );
};

export default FeatureCard;
