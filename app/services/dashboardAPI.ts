import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Dashboard Charts API endpoints
export const dashboardChartsAPI = {
  // fGP Charts
  getFGPByBusiness: async (filters: any) => {
    const response = await axios.post(`${API_BASE_URL}/dashboard/fgp-by-business`, filters);
    return response.data;
  },

  getFGPByChannel: async (filters: any) => {
    const response = await axios.post(`${API_BASE_URL}/dashboard/fgp-by-channel`, filters);
    return response.data;
  },

  getFGPMonthlyTrend: async (filters: any) => {
    const response = await axios.post(`${API_BASE_URL}/dashboard/fgp-monthly-trend`, filters);
    return response.data;
  },

  // gSales Charts
  getGSalesByBusiness: async (filters: any) => {
    const response = await axios.post(`${API_BASE_URL}/dashboard/gsales-by-business`, filters);
    return response.data;
  },

  getGSalesByChannel: async (filters: any) => {
    const response = await axios.post(`${API_BASE_URL}/dashboard/gsales-by-channel`, filters);
    return response.data;
  },

  getGSalesMonthlyTrend: async (filters: any) => {
    const response = await axios.post(`${API_BASE_URL}/dashboard/gsales-monthly-trend`, filters);
    return response.data;
  }
};
