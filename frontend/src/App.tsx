import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BookList from './components/BookList';

function App() {
  return (
    <div className="container py-4">
      <header className="pb-3 mb-4 border-bottom">
        <h1 className="display-5 fw-bold">Online Bookstore</h1>
      </header>

      <main>
        <BookList />
      </main>

      <footer className="pt-3 mt-4 text-muted border-top">
        &copy; 2025 Bookstore App
      </footer>
    </div>
  );
}

export default App;
