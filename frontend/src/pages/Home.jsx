import React, { useEffect, useState } from 'react';
import { FaLeaf, FaCloudSun, FaSearch, FaRobot } from 'react-icons/fa';
import FeatureCard from '../components/FeatureCard';
import ChatInterface from '../components/ChatInterface';
import { getRandomImage } from '../api';

const Home = () => {
    const [bgImage, setBgImage] = useState(null);

    useEffect(() => {
        const fetchBg = async () => {
            const data = await getRandomImage('farm agriculture nature');
            if (data && data.urls) {
                setBgImage(data.urls.regular);
            }
        };
        fetchBg();
    }, []);

    return (
        <div className="page-container" style={{ position: 'relative' }}>
             {/* Hero Section */}
            <div style={{ 
                textAlign: 'center', 
                padding: '4rem 0', 
                marginBottom: '4rem',
                position: 'relative'
            }}>
                <h1 style={{ fontSize: '4rem', background: 'linear-gradient(to right, #4ade80, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
                    Smart Farming
                </h1>
                <p style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                    AI-Powered Insights for Healthy Crops
                </p>
            </div>

            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '2rem',
                marginBottom: '4rem'
            }}>
                <FeatureCard 
                    title="Disease Detection" 
                    description="Upload a photo of your crop to instantly identify diseases and get treatment advice."
                    icon={<FaSearch />}
                    to="/scan"
                />
                <FeatureCard 
                    title="Crop Recommendation" 
                    description="Get data-driven suggestions on the best crops to plant for your soil conditions."
                    icon={<FaLeaf />}
                    to="/recommend"
                />
                <FeatureCard 
                    title="Weather Forecast" 
                    description="Real-time weather updates and alerts to plan your farming activities."
                    icon={<FaCloudSun />}
                    to="/weather"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
                <div className="glass-panel" style={{ padding: '2rem' }}>
                    <h2>Why AI?</h2>
                    <p style={{ lineHeight: '1.8', color: '#cbd5e1' }}>
                        Our advanced machine learning models analyze leaf patterns to detect early signs of diseases that are invisible to the naked eye. combined with real-time weather data and soil analysis, we provide a comprehensive health check for your farm.
                    </p>
                    <ul style={{ lineHeight: '2', color: '#cbd5e1', listStyle: 'none', padding: 0 }}>
                        <li>✓ 95% Accuracy in Disease Detection</li>
                        <li>✓ Instant Analysis</li>
                        <li>✓ 24/7 AI Agronomist Support</li>
                    </ul>
                </div>
                <ChatInterface />
            </div>
        </div>
    );
};

export default Home;
