import api from './client';

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  isbn: string;
  description?: string;
  coverImage?: string;
  stock: number;
  condition: 'NEW' | 'GOOD' | 'FAIR';
  genreId?: string;
  genre?: {
    id: string;
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface GetBooksParams {
  page?: number;
  limit?: number;
  search?: string;
  orderByTitle?: 'asc' | 'desc';
  orderByPublishDate?: 'asc' | 'desc';
  condition?: 'NEW' | 'GOOD' | 'FAIR';
}

export interface CreateBookData {
  title: string;
  author: string;
  publisher: string;
  publishDate: string;
  isbn: string;
  description?: string;
  coverImage?: string;
  stock: number;
  condition: 'NEW' | 'GOOD' | 'FAIR';
  genreId?: string;
}

// Get all books with filters
export const getAllBooks = async (params?: GetBooksParams) => {
  const response = await api.get<PaginatedResponse<Book>>('/books', { params });
  return response.data;
};

// Get books by genre
export const getBooksByGenre = async (genreId: string, params?: GetBooksParams) => {
  const response = await api.get<PaginatedResponse<Book>>(`/books/genre/${genreId}`, { params });
  return response.data;
};

// Get book by ID
export const getBookById = async (id: string) => {
  const response = await api.get<Book>(`/books/${id}`);
  return response.data;
};

// Create new book
export const createBook = async (data: CreateBookData) => {
  const response = await api.post<Book>('/books', data);
  return response.data;
};

// Update book
export const updateBook = async (id: string, data: Partial<CreateBookData>) => {
  const response = await api.put<Book>(`/books/${id}`, data);
  return response.data;
};

// Delete book
export const deleteBook = async (id: string) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};
