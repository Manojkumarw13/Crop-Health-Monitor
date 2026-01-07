import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || 'YOUR_UNSPLASH_KEY'; // User needs to set this

const api = axios.create({
  baseURL: API_URL,
});

export const getHealthCheck = async () => {
  try {
    const response = await api.get('/');
    return response.data;
  } catch (error) {
    console.error("Health check failed", error);
    return null;
  }
};

export const getWeather = async (lat, lon) => {
  const response = await api.get(`/weather?lat=${lat}&lon=${lon}`);
  return response.data;
};

export const getRecommendation = async (data) => {
    // data: {n, p, k, temp, hum, ph, rain}
    const response = await api.post('/recommend', null, { params: data });
    return response.data;
};

export const scanPlant = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const scanNdvi = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/scan/ndvi', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data; // returns { ndvi_image: url }
};

export const getHistory = async () => {
    const response = await api.get('/history');
    return response.data;
};

export const chatAgronomist = async (message) => {
    const response = await api.post('/chat', { message });
    return response.data;
};

export const getRandomImage = async (query) => {
  // Uses Unsplash API
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'YOUR_UNSPLASH_KEY') {
     console.warn("No Unsplash Key provided. Using placeholder.");
     return `https://source.unsplash.com/1600x900/?${query}`; // Deprecated but might work for demo, or better rely on static if possible.
     // Better fallback if strict key is needed:
     // return null;
  }
  try {
      const response = await axios.get(`https://api.unsplash.com/photos/random`, {
          params: { query, orientation: 'landscape' },
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` }
      });
      return response.data;
  } catch (error) {
      console.error("Unsplash Error", error);
      return null;
  }
};

export default api;
