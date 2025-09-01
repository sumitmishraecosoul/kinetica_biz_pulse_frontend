import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || `http://localhost:${process.env.NEXT_PUBLIC_API_PORT || 5000}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Auth API endpoints
export const authAPI = {
  // Sign in
  signin: (credentials: { email: string; password: string }) =>
    api.post('/auth/signin', credentials),

  // Sign up
  signup: (userData: { email: string; password: string; roles?: string[]; scopes?: any }) =>
    api.post('/auth/signup', userData),

  // Refresh token
  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh', { refreshToken }),

  // Logout
  logout: async () => {
    try {
      // Clear all localStorage items
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_roles');
        localStorage.removeItem('user_id');
        localStorage.removeItem('user_email');
      }
      
      await api.post('/auth/logout');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout error:', error);
      // Even if API call fails, redirect to login
      window.location.href = '/login';
    }
  },
};

// Token refresh function
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await authAPI.refreshToken(refreshToken);
    const { token, refreshToken: newRefreshToken } = response.data.data;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', newRefreshToken);
    
    return token;
  } catch (error) {
    // Clear tokens and redirect to login
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw error;
  }
};

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token) {
      config.headers = config.headers || {};
      (config.headers as any)['Authorization'] = `Bearer ${token}`;
    }

    console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
      hasToken: !!token
    });
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const token = await refreshToken();
        processQueue(null, token);
        originalRequest.headers['Authorization'] = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

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
  getFilterOptions: (params?: any) => 
    api.get('/dashboard/filter-options', { params }),

  // Get data health
  getDataHealth: () => 
    api.get('/dashboard/data-health'),

  // Aggregates (optional)
  getAggregates: (params?: any) => 
    api.get('/dashboard/aggregates', { params }),

  // Categories performance
  getCategories: (params?: any) => 
    api.get('/dashboard/categories', { params }),

  // Trend analysis
  getTrend: (params?: any) => 
    api.get('/dashboard/trend', { params }),

  // Top performers
  getTopPerformers: (params?: any) => 
    api.get('/dashboard/top-performers', { params }),

  // Risk analysis
  getRisk: (params?: any) => 
    api.get('/dashboard/risk', { params }),

  // Variance analysis
  getVariance: (params?: any) => 
    api.get('/dashboard/variance', { params }),

  // Customer analysis endpoints
  getCustomerPerformance: (params?: any) => 
    api.get('/dashboard/customers', { params }),

  getCustomerOverview: (params?: any) => 
    api.get('/dashboard/customer-overview', { params }),

  getTopCustomers: (params?: any) => 
    api.get('/dashboard/top-customers', { params }),

  getCustomerChannels: (params?: any) => 
    api.get('/dashboard/customer-channels', { params }),

  // Brand analysis endpoints
  getBrandPerformance: (params?: any) => 
    api.get('/dashboard/performance-data', { params }),

  getBrandOverview: (params?: any) => 
    api.get('/dashboard/overview', { params }),

  getTopBrands: (params?: any) => 
    api.get('/dashboard/top-performers', { params }),

  getBrandVariance: (params?: any) => 
    api.get('/dashboard/variance', { params }),
};

// Health check
export const healthAPI = {
  check: () => 
    axios.get(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/health'),
};

export default api;

