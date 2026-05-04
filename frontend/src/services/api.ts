import axios from 'axios';
import { Order, OrderWithDetails, ApiResponse, Payment, User } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ordersApi = {
  getAll: async (params?: {
    userId?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await api.get<ApiResponse<Order[]>>('/orders', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get<OrderWithDetails>(`/orders/${id}`);
    return response.data;
  },

  updateStatus: async (id: string, data: { status?: string; deliveryStatus?: string }) => {
    const response = await api.patch<Order>(`/orders/${id}/status`, data);
    return response.data;
  },

  create: async (orderData: Partial<Order>) => {
    const response = await api.post<Order>('/orders', orderData);
    return response.data;
  },
};

export const analyticsApi = {
  getStats: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
  
  getTopClients: async () => {
    const response = await api.get('/manager/top-clients');
    return response.data;
  },
};

export default api;