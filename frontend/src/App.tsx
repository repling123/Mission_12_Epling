import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import BookList from './components/BookList';
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Cart from './assets/Cart';
import { CartProvider } from './assets/context/CartContext';

const App: React.FC = () => {
  return (
    <CartProvider>
      <div className="container py-4">
        <header className="pb-3 mb-4 border-bottom">
          <h1 className="display-5 fw-bold">Online Bookstore</h1>
        </header>
        <Routes>
          <Route path="/" element={<BookList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; 2025 Bookstore App
        </footer>
      </div>
    </CartProvider>
  );
};

export default App;
