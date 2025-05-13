import React from 'react';
import { BsTrash, BsPlus, BsDash } from 'react-icons/bs';

const Cart = ({ cart, updateQuantity, removeItem }) => {
    // Calculate total price
    const calculateTotal = () => {
        let total = 0;
        cart.items.forEach(item => {
            if (item.productId) {
                total += item.productId.price * item.quantity;
            }
        });
        return total.toFixed(2);
    };

    return (
        <div className="cart-container">
            <h2>Your Cart</h2>
            {cart.items.length === 0 ? (
                <div className="empty-cart">Your cart is empty</div>
            ) : (
                <>
                    {cart.items.map((item) => (
                        item.productId && (
                            <div className="cart-item" key={item.productId._id}>
                                <img 
                                    src={item.productId.imageUrl} 
                                    alt={item.productId.name} 
                                    className="cart-item-image" 
                                />
                                <div className="cart-item-details">
                                    <h3>{item.productId.name}</h3>
                                    <p>${item.productId.price.toFixed(2)}</p>
                                </div>
                                <div className="cart-item-quantity">
                                    <button 
                                        onClick={() => updateQuantity(item.productId._id, Math.max(1, item.quantity - 1))}
                                        className="quantity-btn"
                                    >
                                        <BsDash />
                                    </button>
                                    <span>{item.quantity}</span>
                                    <button 
                                        onClick={() => updateQuantity(item.productId._id, item.quantity + 1)}
                                        className="quantity-btn"
                                        disabled={item.quantity >= item.productId.stock}
                                    >
                                        <BsPlus />
                                    </button>
                                </div>
                                <div className="cart-item-total">
                                    ${(item.productId.price * item.quantity).toFixed(2)}
                                </div>
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeItem(item.productId._id)}
                                >
                                    <BsTrash />
                                </button>
                            </div>
                        )
                    ))}
                    <div className="cart-summary">
                        <div className="cart-total">
                            <span>Total:</span>
                            <span>${calculateTotal()}</span>
                        </div>
                        <button className="checkout-btn">Proceed to Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Cart; 