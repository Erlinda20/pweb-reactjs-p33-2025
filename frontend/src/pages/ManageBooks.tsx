import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllBooks, deleteBook } from '../api/books';
import type { Book, GetBooksParams } from '../api/books';
import { showAlert } from '../components/Alerts';
import Loader from '../components/Loader';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ManageBooks() {
  const navigate = useNavigate();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [condition, setCondition] = useState<'NEW' | 'GOOD' | 'FAIR' | ''>('');
  const [sortBy, setSortBy] = useState<'title' | 'date'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const limit = 10;

  useEffect(() => {
    fetchBooks();
  }, [currentPage, search, condition, sortBy, sortOrder]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: GetBooksParams = {
        page: currentPage,
        limit,
        search: search || undefined,
        condition: condition || undefined,
      };

      if (sortBy === 'title') {
        params.orderByTitle = sortOrder;
      } else {
        params.orderByPublishDate = sortOrder;
      }

      const response = await getAllBooks(params);
      setBooks(response.data);
      setTotal(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch books');
      showAlert(
        'Error Loading Books',
        'error',
        5000,
        {
          description: err.response?.data?.message || 'Unable to load books. Please try again.',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    showAlert(
      'Confirm Delete',
      'error',
      15000,
      {
        description: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
        actions: [
          {
            label: 'Delete',
            variant: 'primary',
            onClick: async () => {
              try {
                setDeleting(id);
                await deleteBook(id);
                showAlert(
                  'Book Deleted',
                  'success',
                  4000,
                  {
                    description: `"${title}" has been successfully deleted.`,
                  }
                );
                fetchBooks();
              } catch (err: any) {
                showAlert(
                  'Delete Failed',
                  'error',
                  6000,
                  {
                    description: err.response?.data?.message || 'Unable to delete book. Please try again.',
                    actions: [
                      {
                        label: 'Retry',
                        variant: 'primary',
                        onClick: () => handleDelete(id, title),
                      },
                      {
                        label: 'Dismiss',
                        variant: 'secondary',
                        onClick: () => {},
                      },
                    ],
                  }
                );
              } finally {
                setDeleting(null);
              }
            },
          },
          {
            label: 'Cancel',
            variant: 'secondary',
            onClick: () => {},
          },
        ],
      }
    );
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  if (loading && books.length === 0) return <Loader />;
  if (error && books.length === 0) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
            <p className="text-gray-600 mt-1">Total: {total} books</p>
          </div>
          <button
            onClick={() => navigate('/books/add')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Add New Book
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Search */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title, author, ISBN..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                <select
                  value={condition}
                  onChange={(e) => {
                    setCondition(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Conditions</option>
                  <option value="NEW">New</option>
                  <option value="GOOD">Good</option>
                  <option value="FAIR">Fair</option>
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="title">Title</option>
                  <option value="date">Publish Date</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => {
                    setSortOrder(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>
            </div>
          </form>
        </div>

        {/* Books List */}
        {books.length === 0 ? (
          <EmptyState message="No books found" />
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Book
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ISBN
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Condition
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Stock
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {books.map((book) => (
                      <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {book.coverImage && (
                              <img
                                src={book.coverImage}
                                alt={book.title}
                                className="w-12 h-16 object-cover rounded mr-3"
                              />
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">{book.title}</div>
                              <div className="text-sm text-gray-500">{book.publisher}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{book.author}</td>
                        <td className="px-6 py-4 text-sm text-gray-500 font-mono">{book.isbn}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              book.condition === 'NEW'
                                ? 'bg-green-100 text-green-800'
                                : book.condition === 'GOOD'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {book.condition}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">{book.stock}</td>
                        <td className="px-6 py-4 text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => navigate(`/books/edit/${book.id}`)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(book.id, book.title)}
                              disabled={deleting === book.id}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete"
                            >
                              {deleting === book.id ? (
                                <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Showing page <span className="font-medium">{currentPage}</span> of{' '}
                  <span className="font-medium">{totalPages}</span>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
