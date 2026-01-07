import React, { useState, useEffect } from 'react';
import { getWeather, getRandomImage } from '../api';
import { FaMapMarkerAlt, FaTemperatureHigh, FaWind, FaTint } from 'react-icons/fa';

const Weather = () => {
    const [coords, setCoords] = useState({ lat: 20.5937, lon: 78.9629 }); // Default India
    const [weather, setWeather] = useState(null);
    const [bg, setBg] = useState(null);

    useEffect(() => {
        // Try to get user location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude });
            });
        }
        
        // Fetch background
        getRandomImage('sky clouds weather').then(data => {
            if(data?.urls) setBg(data.urls.regular);
        });
    }, []);

    useEffect(() => {
        const fetchWeather = async () => {
            if (coords.lat && coords.lon) {
                try {
                    const data = await getWeather(coords.lat, coords.lon);
                    setWeather(data);
                } catch (e) {
                    console.error(e);
                }
            }
        };
        fetchWeather();
    }, [coords]);

    return (
        <div className="page-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            {bg && (
                 <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    backgroundImage: `url(${bg})`, backgroundSize: 'cover', opacity: 0.15, zIndex: -1 
                }} />
            )}

            <h1 style={{ marginBottom: '2rem' }}>Local Weather</h1>

            {weather ? (
                <div className="glass-panel" style={{ padding: '3rem', minWidth: '300px', maxWidth: '500px', width: '100%', textAlign: 'center' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        <FaMapMarkerAlt />
                        <span>{coords.lat.toFixed(2)}, {coords.lon.toFixed(2)}</span>
                    </div>

                    <div style={{ fontSize: '5rem', fontWeight: 'bold', lineHeight: 1 }}>
                        {weather.temperature}°C
                    </div>
                    <div style={{ fontSize: '1.5rem', textTransform: 'capitalize', color: 'var(--primary)', marginBottom: '3rem' }}>
                        {weather.description}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <WeatherStat icon={<FaTint />} label="Humidity" value={`${weather.humidity}%`} />
                        <WeatherStat icon={<FaWind />} label="Status" value={weather.description} />
                    </div>

                </div>
            ) : (
                <div style={{ padding: '2rem' }}>Loading Weather Data...</div>
            )}
        </div>
    );
};

const WeatherStat = ({ icon, label, value }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ color: 'var(--primary)' }}>{icon}</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{label}</div>
        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{value}</div>
    </div>
);

export default Weather;
