import axios, { AxiosInstance } from 'axios';
import { DashboardData } from '../types/dashboard';

// Create axios instance with base URL
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`, response.status);
    return response;
  },
  (error) => {
    console.error('Response interceptor error:', error);
    
    if (error.response) {
      // Server responded with error status
      console.error('Error response:', error.response.data);
      console.error('Error status:', error.response.status);
    } else if (error.request) {
      // Request was made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Request setup error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export const healthCheck = async (): Promise<{ status: string }> => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Health check failed:', error);
    throw new Error('API health check failed');
  }
};

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    const response = await apiClient.get<DashboardData>('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    throw new Error('Failed to connect to Carvana Analytics API. Please ensure the backend service is running.');
  }
};

export interface BrandMetrics {
  brand_name: string;
  total_vehicles: number;
  average_price: number;
  total_sales_30_days: number;
  avg_days_to_sell: number;
  top_models: Array<{
    model: string;
    sales_count: number;
    avg_price: number;
  }>;
}

export const fetchBrandMetrics = async (brandName: string): Promise<BrandMetrics> => {
  try {
    const response = await apiClient.get<BrandMetrics>(`/brand/${encodeURIComponent(brandName)}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch brand metrics for ${brandName}:`, error);
    throw new Error(`Failed to fetch metrics for ${brandName}. Please try again.`);
  }
};

export default apiClient;
