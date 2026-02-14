import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

interface Expense {
  id?: string;
  amount: number;
  category: string;
  vendor: string;
  date: string;
  description: string;
  photoUrl?: string;
}

export const expenseService = {
  getAll: () => api.get<Expense[]>('/expenses'),
  
  create: (expense: Expense) => api.post<Expense>('/expenses', expense),
  
  update: (id: string, expense: Expense) => api.put<Expense>(`/expenses/${id}`, expense),
  
  delete: (id: string) => api.delete(`/expenses/${id}`),
  
  processReceipt: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post<Expense>('/expenses/process-receipt', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  
  getStats: () => api.get('/expenses/stats'),
};

export default api;
