import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import { scanPlant, scanNdvi } from '../api';
import { FaHeartbeat, FaLayerGroup } from 'react-icons/fa';

const Scan = () => {
    const [mode, setMode] = useState('disease'); // 'disease' or 'ndvi'
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleUpload = async (file) => {
        setLoading(true);
        setError(null);
        setResult(null);

        try {
            let data;
            if (mode === 'disease') {
                data = await scanPlant(file);
            } else {
                data = await scanNdvi(file);
            }
            setResult(data);
        } catch (err) {
            setError("Failed to analyze image. Please try again.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Crop Analysis</h1>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button 
                    className={`btn-primary`} 
                    style={{ background: mode === 'disease' ? '' : 'rgba(255,255,255,0.1)', opacity: mode === 'disease' ? 1 : 0.7 }}
                    onClick={() => { setMode('disease'); setResult(null); }}
                >
                    <FaHeartbeat style={{ marginRight: '0.5rem' }} /> Disease Detection
                </button>
                <button 
                    className={`btn-primary`} 
                    style={{ background: mode === 'ndvi' ? '' : 'rgba(255,255,255,0.1)', opacity: mode === 'ndvi' ? 1 : 0.7 }}
                    onClick={() => { setMode('ndvi'); setResult(null); }}
                >
                    <FaLayerGroup style={{ marginRight: '0.5rem' }} /> NDVI Analysis
                </button>
            </div>

            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
                <FileUpload 
                    onFileSelect={handleUpload} 
                    isLoading={loading} 
                    label={mode === 'disease' ? "Upload Leaf Photo" : "Upload Field/Aerial Photo"}
                />

                {error && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', borderRadius: '8px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                {result && (
                    <div className="glass-panel" style={{ marginTop: '2rem', padding: '2rem', textAlign: 'center', animation: 'fadeIn 0.5s' }}>
                        {mode === 'disease' ? (
                            <>
                                <h2 style={{ color: 'var(--primary)' }}>Analysis Complete</h2>
                                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                                    Prediction: <strong>{result.disease}</strong>
                                </div>
                                <div style={{ color: 'var(--text-muted)' }}>
                                    Confidence: {(result.confidence * 100).toFixed(1)}%
                                </div>
                                <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#94a3b8' }}>
                                    Scan ID: {result.scan_id}
                                </div>
                            </>
                        ) : (
                            <>
                                <h2 style={{ color: 'var(--primary)' }}>NDVI Processing Complete</h2>
                                <p>Vegetation Index Map generated successfully.</p>
                                <div style={{ marginTop: '1rem', border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden' }}>
                                    <img 
                                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}${result.ndvi_image}`} 
                                        alt="NDVI Result" 
                                        style={{ maxWidth: '100%', display: 'block' }} 
                                    />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scan;
