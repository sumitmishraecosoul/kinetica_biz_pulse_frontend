import axios from 'axios';

// Deep Intelligence API configuration
const DEEP_INTELLIGENCE_API_URL = process.env.NEXT_PUBLIC_DEEP_INTELLIGENCE_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: DEEP_INTELLIGENCE_API_URL,
  timeout: 30000, // 30 seconds timeout for AI responses
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log('Deep Intelligence API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Deep Intelligence API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('Deep Intelligence API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Deep Intelligence API Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  query: string;
  conversation_history?: ChatMessage[];
  filters?: {
    year?: string[];
    month?: string[];
    business?: string[];
    channel?: string[];
    brand?: string[];
    category?: string[];
    customer?: string[];
  };
}

export interface ChatResponse {
  response: string;
  timestamp: string;
  context: string;
  charts?: any[];
  data?: any;
}

export const deepIntelligenceAPI = {
  // Health check
  healthCheck: async (): Promise<{ status: string }> => {
    const response = await apiClient.get('/health');
    return response.data;
  },

  // Chat with AI
  chat: async (request: ChatRequest): Promise<ChatResponse> => {
    try {
      const response = await apiClient.post('/chat', request);
      return response.data;
    } catch (error: any) {
      console.error('Deep Intelligence API Error:', error);
      throw new Error(error.response?.data?.detail || error.message || 'Failed to get AI response');
    }
  },

  // Get filter options for the current data
  getFilterOptions: async (): Promise<{
    years: string[];
    months: string[];
    businesses: string[];
    channels: string[];
    brands: string[];
    categories: string[];
    customers: string[];
  }> => {
    // This would be a new endpoint in the FastAPI backend
    // For now, return default options
    return {
      years: ['2023', '2024', '2025'],
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      businesses: ['Brillo, Goddards & KMPL', 'Cali Cali', 'Food', 'Green Aware', 'Household & Beauty', 'Kinetica'],
      channels: ['Convenience', 'Grocery', 'International', 'Online', 'Sports & Others', 'Wholesale'],
      brands: ['Asda', 'Babykind', 'Bensons', 'Bonne Maman', 'Brillo', 'BV Honey', 'Koka', 'McDonnells'],
      categories: ['Pickles', 'Plastic sacks', 'Polish', 'Pots', 'Preserves', 'Protein Bar', 'Protein Milk', 'Shopping bags', 'Snacking'],
      customers: ['Aldi ROI', 'Amazon', 'Australia', 'Austria', 'Bahrain', 'Barry Group', 'Belgium', 'BWG', 'Canada']
    };
  },

  // Get data summary for context
  getDataSummary: async (): Promise<{
    totalRows: number;
    yearRange: string;
    businessSegments: number;
    channels: number;
    customers: number;
    brands: number;
    categories: number;
  }> => {
    // This would be a new endpoint in the FastAPI backend
    // For now, return mock data
    return {
      totalRows: 96000,
      yearRange: '2023 - 2025',
      businessSegments: 6,
      channels: 6,
      customers: 50,
      brands: 25,
      categories: 15
    };
  }
};
