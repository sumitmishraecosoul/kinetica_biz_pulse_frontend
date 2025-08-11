import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Dashboard API endpoints
export const dashboardAPI = {
  // Get dashboard overview
  getOverview: (params?: any) => 
    api.get('/dashboard/overview', { params }),

  // Get business areas
  getBusinessAreas: (params?: any) => 
    api.get('/dashboard/business-areas', { params }),

  // Get channels
  getChannels: (params?: any) => 
    api.get('/dashboard/channels', { params }),

  // Get performance data
  getPerformanceData: (params?: any) => 
    api.get('/dashboard/performance-data', { params }),

  // Get filter options
  getFilterOptions: () => 
    api.get('/dashboard/filter-options'),

  // Get data health
  getDataHealth: () => 
    api.get('/dashboard/data-health'),
};

// Health check
export const healthAPI = {
  check: () => 
    axios.get(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/health'),
};

export default api;

