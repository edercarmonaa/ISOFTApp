const env = typeof process !== 'undefined' && process.env ? process.env : {};

export const API_BASE_URL = env.API_BASE_URL || 'https://api.example.com';

export const getApiUrl = (path) => `${API_BASE_URL}${path}`;
