import { Book, Genre, User, LoginData, RegisterData } from '../types';

const API_BASE_URL = 'http://localhost:3001/api';

// ADD NEW INTERFACES
export interface TransactionItem {
  book_id: number;
  quantity: number;
  title?: string;
  price?: number;
}

export interface Transaction {
  id: number;
  user_id: number;
  total_amount: number;
  created_at: string;
  items?: TransactionItem[];
}

export interface TransactionsResponse {
  data: Transaction[];
  total: number;
  page: number;
  limit: number;
}

export const api = {
  // ... existing functions (login, register, books, etc.)
  
  // CREATE TRANSACTION - NEW
  async createTransaction(items: TransactionItem[]): Promise<Transaction> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create transaction');
    }
    
    return response.json();
  },

  // GET TRANSACTIONS LIST - NEW
  async getTransactions(params: { 
    page: number; 
    limit: number; 
    searchId?: string; 
    sortBy?: string;
  }): Promise<TransactionsResponse> {
    const token = localStorage.getItem('token');
    const { page, limit, searchId, sortBy } = params;
    
    let url = `${API_BASE_URL}/transactions?page=${page}&limit=${limit}`;
    
    if (searchId) url += `&search=${searchId}`;
    if (sortBy) url += `&sort=${sortBy}`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }
    
    return response.json();
  },

  // GET TRANSACTION DETAIL - NEW
  async getTransactionDetail(id: number): Promise<Transaction> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch transaction detail');
    }
    
    return response.json();
  },
};
