import React, { useState } from 'react';
import { getRecommendation } from '../api';
import { FaSeedling } from 'react-icons/fa';

const Recommend = () => {
    const [formData, setFormData] = useState({
        n: 90, p: 40, k: 40, temp: 25, hum: 80, ph: 7, rain: 200
    });
    const [loading, setLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = await getRecommendation(formData);
            setPrediction(data.recommended_crop);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Crop Recommendation</h1>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>
                <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ gridColumn: '1 / -1', marginBottom: '1rem' }}>
                        <h3 style={{ margin: 0 }}>Soil & Climatic Conditions</h3>
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
                            {loading ? 'Analyzing...' : 'Get Recommendation'}
                        </button>
                    </div>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    {prediction ? (
                        <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', width: '100%', borderColor: 'var(--primary)' }}>
                            <FaSeedling size={64} color="var(--primary)" style={{ marginBottom: '1rem' }} />
                            <h3>Best Crop to Plant</h3>
                            <div style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary)', textTransform: 'capitalize' }}>
                                {prediction}
                            </div>
                            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
                                Based on your soil composition and weather conditions, {prediction} will yield the best results.
                            </p>
                        </div>
                    ) : (
                        <div style={{ opacity: 0.5, textAlign: 'center' }}>
                            <FaSeedling size={100} />
                            <p>Enter data to reveal the magic crop</p>
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
