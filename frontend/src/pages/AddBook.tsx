import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createBook, updateBook, getBookById } from '../api/books';
import type { CreateBookData } from '../api/books';
import { showAlert } from '../components/Alerts';
import Loader from '../components/Loader';
import { ArrowLeft, Save } from 'lucide-react';

export default function AddBook() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [formData, setFormData] = useState<CreateBookData>({
    title: '',
    author: '',
    publisher: '',
    publishDate: '',
    isbn: '',
    description: '',
    coverImage: '',
    stock: 0,
    condition: 'NEW',
    genreId: '',
  });

  useEffect(() => {
    if (isEditMode && id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      setFetching(true);
      const book = await getBookById(id!);
      setFormData({
        title: book.title,
        author: book.author,
        publisher: book.publisher,
        publishDate: book.publishDate.split('T')[0], // Format date for input
        isbn: book.isbn,
        description: book.description || '',
        coverImage: book.coverImage || '',
        stock: book.stock,
        condition: book.condition,
        genreId: book.genreId || '',
      });
    } catch (err: any) {
      showAlert(
        'Error Loading Book',
        'error',
        5000,
        {
          description: err.response?.data?.message || 'Unable to load book data.',
          actions: [
            { label: 'Back to List', variant: 'primary', onClick: () => navigate('/books/manage') },
            { label: 'Retry', variant: 'secondary', onClick: fetchBook },
          ],
        }
      );
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stock' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.author || !formData.publisher || !formData.isbn) {
      showAlert(
        'Validation Error',
        'error',
        4000,
        { description: 'Please fill in all required fields (Title, Author, Publisher, ISBN).' }
      );
      return;
    }

    try {
      setLoading(true);

      if (isEditMode && id) {
        await updateBook(id, formData);
        showAlert(
          'Book Updated',
          'success',
          4000,
          {
            description: `"${formData.title}" has been successfully updated.`,
            actions: [
              { label: 'View List', variant: 'primary', onClick: () => navigate('/books/manage') },
              { label: 'Continue Editing', variant: 'secondary', onClick: () => {} },
            ],
          }
        );
      } else {
        await createBook(formData);
        showAlert(
          'Book Created',
          'success',
          4000,
          {
            description: `"${formData.title}" has been successfully added to the library.`,
            actions: [
              { label: 'View List', variant: 'primary', onClick: () => navigate('/books/manage') },
              { label: 'Add Another', variant: 'secondary', onClick: () => {
                setFormData({
                  title: '',
                  author: '',
                  publisher: '',
                  publishDate: '',
                  isbn: '',
                  description: '',
                  coverImage: '',
                  stock: 0,
                  condition: 'NEW',
                  genreId: '',
                });
              }},
            ],
          }
        );
      }
    } catch (err: any) {
      showAlert(
        isEditMode ? 'Update Failed' : 'Create Failed',
        'error',
        6000,
        {
          description: err.response?.data?.message || `Unable to ${isEditMode ? 'update' : 'create'} book. Please try again.`,
          actions: [
            { label: 'Retry', variant: 'primary', onClick: () => handleSubmit(e) },
            { label: 'Dismiss', variant: 'secondary', onClick: () => {} },
          ],
        }
      );
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/books/manage')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Books
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? 'Edit Book' : 'Add New Book'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditMode ? 'Update book information' : 'Fill in the details to add a new book'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter book title"
            />
          </div>

          {/* Author & Publisher */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label htmlFor="publisher" className="block text-sm font-medium text-gray-700 mb-1">
                Publisher <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="publisher"
                name="publisher"
                value={formData.publisher}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter publisher name"
              />
            </div>
          </div>

          {/* ISBN & Publish Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-1">
                ISBN <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="isbn"
                name="isbn"
                value={formData.isbn}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
                placeholder="978-0-123456-78-9"
              />
            </div>

            <div>
              <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
                Publish Date
              </label>
              <input
                type="date"
                id="publishDate"
                name="publishDate"
                value={formData.publishDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Stock & Condition */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                Stock
              </label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="NEW">New</option>
                <option value="GOOD">Good</option>
                <option value="FAIR">Fair</option>
              </select>
            </div>
          </div>

          {/* Cover Image & Genre ID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="coverImage" className="block text-sm font-medium text-gray-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                id="coverImage"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label htmlFor="genreId" className="block text-sm font-medium text-gray-700 mb-1">
                Genre ID
              </label>
              <input
                type="text"
                id="genreId"
                name="genreId"
                value={formData.genreId}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optional genre ID"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter book description..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditMode ? 'Update Book' : 'Create Book'}
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate('/books/manage')}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
