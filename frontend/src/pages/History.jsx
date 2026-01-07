import React, { useEffect, useState } from 'react';
import { getHistory } from '../api';
import { FaClock, FaBug, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

const History = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        getHistory().then(setLogs).catch(console.error);
    }, []);

    return (
        <div className="page-container">
            <h1 style={{ marginBottom: '2rem' }}>Scan History</h1>
            
            {logs.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>No scans recorded yet.</div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {logs.map(log => (
                        <div key={log.id} className="glass-panel" style={{ 
                            padding: '1.5rem', 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            animation: 'slideIn 0.3s'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                <div style={{ 
                                    padding: '1rem', 
                                    borderRadius: '50%', 
                                    background: log.disease_detected?.toLowerCase().includes('health') ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                                    color: log.disease_detected?.toLowerCase().includes('health') ? 'var(--primary)' : '#f43f5e'
                                }}>
                                    {log.disease_detected?.toLowerCase().includes('health') ? <FaCheckCircle size={24} /> : <FaExclamationTriangle size={24} />}
                                </div>
                                <div>
                                    <h3 style={{ margin: '0 0 0.5rem 0' }}>{log.disease_detected}</h3>
                                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <FaClock /> {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                                        </span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                            <FaBug /> Confidence: {(log.confidence * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default History;
