import React from 'react';
import { BsCart } from 'react-icons/bs';

const Product = ({ product, addToCart }) => {
    return (
        <div className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-details">
                <h3>{product.name}</h3>
                <p className="product-description">{product.description}</p>
                <div className="product-footer">
                    <span className="product-price">${product.price.toFixed(2)}</span>
                    <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product._id)}
                        disabled={product.stock <= 0}
                    >
                        <BsCart /> {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product; 