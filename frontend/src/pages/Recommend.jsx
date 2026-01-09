import React, { useState } from 'react';
import { getRecommendation } from '../api';
import { FaSeedling } from 'react-icons/fa';

const Recommend = () => {
    const [formData, setFormData] = useState({
        n: 90, p: 40, k: 40, temp: 25, hum: 80, ph: 7, rain: 200
    });
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await getRecommendation(formData);
            setResult(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Soil Health Monitor</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Soil & Climatic Input</h3>
                    </div>

                    <FormInput label="Nitrogen (N)" name="n" value={formData.n} onChange={handleChange} />
                    <FormInput label="Phosphorus (P)" name="p" value={formData.p} onChange={handleChange} />
                    <FormInput label="Potassium (K)" name="k" value={formData.k} onChange={handleChange} />
                    <FormInput label="pH Level" name="ph" value={formData.ph} step="0.1" onChange={handleChange} />
                    
                    <FormInput label="Temperature (°C)" name="temp" value={formData.temp} onChange={handleChange} />
                    <FormInput label="Humidity (%)" name="hum" value={formData.hum} onChange={handleChange} />
                    <FormInput label="Rainfall (mm)" name="rain" value={formData.rain} className="full-width" onChange={handleChange} />

                    <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                        <button type="submit" className="btn-primary" style={{ width: '100%' }} disabled={loading}>
                            {loading ? 'Analyzing...' : 'Check Soil Health'}
                        </button>
                    </div>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {result ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', width: '100%', borderColor: result.grade.includes('Good') ? '#10b981' : result.grade.includes('Average') ? '#f59e0b' : '#ef4444' }}>
                            <FaSeedling size={64} color={result.grade.includes('Good') ? '#10b981' : result.grade.includes('Average') ? '#f59e0b' : '#ef4444'} style={{ marginBottom: '1rem' }} />
                            <h3>Soil Grade</h3>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--text-main)', textTransform: 'capitalize' }}>
                                {result.grade}
                            </div>
                            <div style={{ fontSize: '1.5rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
                                Score: {result.total_score} / {result.max_score}
                            </div>
                            
                            <div style={{ marginTop: '2rem', width: '100%', textAlign: 'left' }}>
                                <h4>Parameter Breakdown</h4>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                                    {Object.entries(result.details).map(([key, status]) => (
                                        <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                            <span style={{ textTransform: 'capitalize' }}>{key}</span>
                                            <span style={{ 
                                                fontWeight: 'bold', 
                                                color: status === 'Good' ? '#10b981' : status === 'Average' ? '#f59e0b' : '#ef4444' 
                                            }}>
                                                {status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div style={{ opacity: 0.5, textAlign: 'center' }}>
                            <FaSeedling size={100} />
                            <p>Enter soil parameters to assess health</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const FormInput = ({ label, name, value, onChange, step = "1", className = "" }) => (
    <div style={{ gridColumn: className === 'full-width' ? '1 / -1' : 'auto' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-muted)' }}>{label}</label>
        <input 
            type="number" 
            name={name} 
            value={value} 
            onChange={onChange}
            step={step}
            required
        />
    </div>
);

export default Recommend;
