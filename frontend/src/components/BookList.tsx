import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book } from '../models/Book';
import PageSizeSelector from './PageSizeSelector';
import Pagination from './Pagination';
import Dropdown from 'react-bootstrap/Dropdown';
import Toast from 'react-bootstrap/Toast';
import OffcanvasCart from '../assets/offcanvasCart';
import { useCart } from '../assets/context/CartContext';

const BookList: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const [showOffcanvasCart, setShowOffcanvasCart] = useState(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage, setBooksPerPage] = useState<number>(5);
  const [totalBooks, setTotalBooks] = useState<number>(0);

  // Sorting State
  const [sortField, setSortField] = useState<keyof Book>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch Categories from Backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          'https://localhost:5000/api/book/categories'
        );
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch Books (Supports Filtering & Pagination)
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const categoryQuery = selectedCategory
          ? `category=${selectedCategory}&`
          : '';
        const response = await fetch(
          `https://localhost:5000/api/book?${categoryQuery}page=${currentPage}&pageSize=${booksPerPage}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBooks(data.books);
        setTotalBooks(data.totalBooks);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [selectedCategory, currentPage, booksPerPage]);

  // Add Book to Cart
  const handleAddToCart = (book: Book) => {
    addToCart({
      bookId: book.bookId,
      title: book.title,
      price: book.price,
      quantity: 1,
    });

    // Show Toast Notification
    setToastMessage(`${book.title} added to cart`);
    setShowToast(true);
  };

  // Sorting Logic
  const handleSort = (field: keyof Book) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Apply Sorting
  const sortedBooks = [...books].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    return sortDirection === 'asc'
      ? (valueA as number) - (valueB as number)
      : (valueB as number) - (valueA as number);
  });

  // Update Pagination
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
  const changePageSize = (size: number) => {
    setBooksPerPage(size);
    setCurrentPage(1);
  };

  // Render Sorting Indicator
  const renderSortIndicator = (field: keyof Book) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  if (loading)
    return (
      <div className="text-center my-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );

  if (error)
    return (
      <div className="alert alert-danger" role="alert">
        {error}
      </div>
    );

  return (
    <div className="container-fluid">
      <div className="row mb-3">
        <div className="col-12">
          <h2>Book Collection</h2>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12">
          <strong>Cart:</strong>{' '}
          {cart.reduce((sum, item) => sum + item.quantity, 0)} items - $
          {cart
            .reduce((sum, item) => sum + item.quantity * item.price, 0)
            .toFixed(2)}
          <button
            className="btn btn-warning ms-3"
            onClick={() => setShowOffcanvasCart(true)}
          >
            View Cart
          </button>
          <button
            className="btn btn-primary ms-2"
            onClick={() => navigate('/cart')}
          >
            Checkout
          </button>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-12">
          <PageSizeSelector
            booksPerPage={booksPerPage}
            onChangePageSize={changePageSize}
          />
        </div>
      </div>

      {/* Offcanvas Cart Component */}
      <OffcanvasCart
        show={showOffcanvasCart}
        onHide={() => setShowOffcanvasCart(false)}
      />

      {/* Category Dropdown */}
      <div className="mb-3">
        <Dropdown>
          <Dropdown.Toggle variant="success" id="category-dropdown">
            {selectedCategory || 'All Categories'}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item
              onClick={() => {
                setSelectedCategory('');
                setCurrentPage(1);
              }}
            >
              All Categories
            </Dropdown.Item>
            {categories.map((cat) => (
              <Dropdown.Item
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
              >
                {cat}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>

      {/* Book Table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th onClick={() => handleSort('title')}>
                Title {renderSortIndicator('title')}
              </th>
              <th onClick={() => handleSort('author')}>
                Author {renderSortIndicator('author')}
              </th>
              <th onClick={() => handleSort('category')}>
                Category {renderSortIndicator('category')}
              </th>
              <th onClick={() => handleSort('price')}>
                Price {renderSortIndicator('price')}
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book) => (
              <tr key={book.bookId}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => handleAddToCart(book)}
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Component */}
      <Pagination
        booksPerPage={booksPerPage}
        totalBooks={totalBooks}
        currentPage={currentPage}
        paginate={paginate}
      />

      {/* Toast Notification */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
        }}
      >
        <Toast.Header>
          <strong className="me-auto">Bookstore</strong>
          <small>Just now</small>
        </Toast.Header>
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default BookList;
