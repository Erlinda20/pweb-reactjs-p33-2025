import api from './client';

// Frontend Book shape used across UI
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

// Backend book shape (Prisma model fields)
type BackendBook = {
  id: string;
  title: string;
  writer: string;
  publisher: string;
  publication_year: number | null;
  description?: string | null;
  price?: number | null;
  stock_quantity: number | null;
  genre_id?: string | null;
  genre?: { id: string; name: string } | null;
  created_at?: string;
  updated_at?: string;
};

// Map backend book to frontend Book UI shape
function mapBook(b: BackendBook): Book {
  return {
    id: b.id,
    title: b.title,
    author: b.writer,
    publisher: b.publisher,
    publishDate: b.publication_year ? String(b.publication_year) : '',
    isbn: '',
    description: b.description ?? undefined,
    coverImage: undefined,
    stock: b.stock_quantity ?? 0,
    // Backend doesn't have condition; default to GOOD for UI badge
    condition: 'GOOD',
    genreId: b.genre_id ?? undefined,
    genre: b.genre ?? undefined as any,
    createdAt: b.created_at,
    updatedAt: b.updated_at,
  };
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

// Get all books with filters (adapts frontend params to backend API and maps response)
export const getAllBooks = async (params?: GetBooksParams) => {
  const backendParams: Record<string, any> = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
  };

  if (params?.search) backendParams.title = params.search;
  // Sorting mapping
  if (params?.orderByTitle) {
    backendParams.sort_by = 'title';
    backendParams.order = params.orderByTitle;
  } else if (params?.orderByPublishDate) {
    backendParams.sort_by = 'publication_year';
    backendParams.order = params.orderByPublishDate;
  }

  const response = await api.get('/books', { params: backendParams });
  const payload = response.data?.data as { books: BackendBook[]; pagination: any };

  const books = (payload?.books ?? []).map(mapBook);
  const p = payload?.pagination ?? {};
  const meta = {
    total: p.total ?? books.length,
    page: p.page ?? backendParams.page,
    limit: p.limit ?? backendParams.limit,
    totalPages: p.total_pages ?? 1,
  };

  const result: PaginatedResponse<Book> = { data: books, meta };
  return result;
};

// Get books by genre
export const getBooksByGenre = async (genreId: string, params?: GetBooksParams) => {
  const backendParams: Record<string, any> = {
    page: params?.page ?? 1,
    limit: params?.limit ?? 10,
  };
  if (params?.search) backendParams.title = params.search;
  const response = await api.get(`/books/genre/${genreId}`, { params: backendParams });
  const payload = response.data?.data as { books: BackendBook[]; pagination: any };
  const books = (payload?.books ?? []).map(mapBook);
  const p = payload?.pagination ?? {};
  const meta = {
    total: p.total ?? books.length,
    page: p.page ?? backendParams.page,
    limit: p.limit ?? backendParams.limit,
    totalPages: p.total_pages ?? 1,
  };
  const result: PaginatedResponse<Book> = { data: books, meta };
  return result;
};

// Get book by ID
export const getBookById = async (id: string) => {
  const response = await api.get(`/books/${id}`);
  const raw = response.data?.data as BackendBook;
  return mapBook(raw);
};

// Create new book
export const createBook = async (data: CreateBookData) => {
  // Map UI data to backend payload
  const payload = {
    title: data.title,
    writer: data.author,
    publisher: data.publisher,
    publication_year: data.publishDate ? new Date(data.publishDate).getFullYear() : null,
    description: data.description ?? null,
    stock_quantity: data.stock,
    genre_id: data.genreId ?? null,
  };
  const response = await api.post('/books', payload);
  const raw = response.data?.data as BackendBook;
  return mapBook(raw);
};

// Update book
export const updateBook = async (id: string, data: Partial<CreateBookData>) => {
  const payload: Record<string, any> = {};
  if (data.title !== undefined) payload.title = data.title;
  if (data.author !== undefined) payload.writer = data.author;
  if (data.publisher !== undefined) payload.publisher = data.publisher;
  if (data.publishDate !== undefined) payload.publication_year = data.publishDate ? new Date(data.publishDate).getFullYear() : null;
  if (data.description !== undefined) payload.description = data.description ?? null;
  if (data.stock !== undefined) payload.stock_quantity = data.stock;
  if (data.genreId !== undefined) payload.genre_id = data.genreId ?? null;

  const response = await api.patch(`/books/${id}`, payload);
  const raw = response.data?.data as BackendBook;
  return mapBook(raw);
};

// Delete book
export const deleteBook = async (id: string) => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};
