import React, { useState, useEffect } from 'react';
import { Book } from '../models/Book';
import PageSizeSelector from './PageSizeSelector';
import Pagination from './Pagination';

const BookList: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [booksPerPage, setBooksPerPage] = useState<number>(5);

  // Sorting state using arrows on titles
  const [sortField, setSortField] = useState<keyof Book>('title');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      // Try both HTTPS and HTTP versions
      try {
        const response = await fetch('https://localhost:5000/api/book', {
          method: 'GET',
          mode: 'cors',
          credentials: 'same-origin',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setBooks(data);
        setError(null);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
      const valueA = a[sortField];
      const valueB = b[sortField];

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return sortDirection === 'asc'
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }
      return 0; // Fallback if values are not strings
    };

    fetchBooks();
  }, [sortField, sortDirection]);

  // Sort books
  const sortedBooks = [...books].sort((a, b) => {
    const valueA = a[sortField];
    const valueB = b[sortField];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortDirection === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // For numeric values
    return sortDirection === 'asc'
      ? (valueA as number) - (valueB as number)
      : (valueB as number) - (valueA as number);
  });

  // Get current books for pagination
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Change books per page
  const changePageSize = (size: number) => {
    setBooksPerPage(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Handle sorting
  const handleSort = (field: keyof Book) => {
    if (field === sortField) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to ascending
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Render sort indicator
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
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Book Collection</h2>
        <PageSizeSelector
          booksPerPage={booksPerPage}
          onChangePageSize={changePageSize}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('title')}
                style={{ cursor: 'pointer' }}
              >
                Title {renderSortIndicator('title')}
              </th>
              <th
                onClick={() => handleSort('author')}
                style={{ cursor: 'pointer' }}
              >
                Author {renderSortIndicator('author')}
              </th>
              <th
                onClick={() => handleSort('publisher')}
                style={{ cursor: 'pointer' }}
              >
                Publisher {renderSortIndicator('publisher')}
              </th>
              <th
                onClick={() => handleSort('isbn')}
                style={{ cursor: 'pointer' }}
              >
                ISBN {renderSortIndicator('isbn')}
              </th>
              <th
                onClick={() => handleSort('classification')}
                style={{ cursor: 'pointer' }}
              >
                Classification {renderSortIndicator('classification')}
              </th>
              <th
                onClick={() => handleSort('category')}
                style={{ cursor: 'pointer' }}
              >
                Category {renderSortIndicator('category')}
              </th>
              <th
                onClick={() => handleSort('pageCount')}
                style={{ cursor: 'pointer' }}
              >
                Pages {renderSortIndicator('pageCount')}
              </th>
              <th
                onClick={() => handleSort('price')}
                style={{ cursor: 'pointer' }}
              >
                Price {renderSortIndicator('price')}
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBooks.map((book) => (
              <tr key={book.bookId}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.classification}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        booksPerPage={booksPerPage}
        totalBooks={books.length}
        currentPage={currentPage}
        paginate={paginate}
      />
    </div>
  );
};

export default BookList;
