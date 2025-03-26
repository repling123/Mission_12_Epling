import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { useCart } from '../assets/context/CartContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { cart, totalPrice, removeFromCart, updateQuantity, clearCart } =
    useCart();

  return (
    <div className="container">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={`${item.bookId}-${Math.random()}`}>
                  {' '}
                  {/* Ensure unique key */}
                  <td>{item.title}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.bookId, parseInt(e.target.value))
                      }
                      style={{ width: '60px', textAlign: 'center' }}
                    />
                  </td>
                  <td>${(item.quantity * item.price).toFixed(2)}</td>
                  <td>
                    <Button
                      variant="danger"
                      onClick={() => removeFromCart(item.bookId)}
                    >
                      Remove
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-3">
        <h4>Total: ${totalPrice.toFixed(2)}</h4>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-3">
        <Button
          variant="secondary"
          className="me-2"
          onClick={() => navigate('/')}
        >
          Continue Shopping
        </Button>
        <Button variant="warning" onClick={clearCart}>
          Clear Cart
        </Button>
        <Button variant="primary">Checkout</Button>
      </div>
    </div>
  );
};

export default Cart;
