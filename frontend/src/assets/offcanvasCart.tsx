import React from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../assets/context/CartContext';

interface OffcanvasCartProps {
  show: boolean;
  onHide: () => void;
}

const OffcanvasCart: React.FC<OffcanvasCartProps> = ({ show, onHide }) => {
  const navigate = useNavigate();
  const { cart, totalPrice } = useCart();

  return (
    <Offcanvas show={show} onHide={onHide} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Shopping Cart</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div>
            {cart.map((item) => (
              <div
                key={item.bookId}
                className="d-flex align-items-center mb-3 border-bottom pb-2"
              >
                <div className="flex-grow-1">
                  <h6>{item.title}</h6>
                  <p className="mb-1">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                  <p>Subtotal: ${(item.quantity * item.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
            <div className="mt-3">
              <h5>Total: ${totalPrice.toFixed(2)}</h5>
              <Button
                variant="primary"
                className="w-100 mt-2"
                onClick={() => {
                  onHide();
                  navigate('/cart');
                }}
              >
                View Full Cart
              </Button>
            </div>
          </div>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default OffcanvasCart;
