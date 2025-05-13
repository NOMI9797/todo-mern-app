import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Product from './components/Product';
import Cart from './components/Cart';
import Header from './components/Header';

// Use environment variable or default to localhost for development
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:50010';

// Temporary user ID - In a real app this would come from authentication
const TEMP_USER_ID = 'user123';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [cart, setCart] = useState({ items: [] });
    const [showCart, setShowCart] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // Get all products and user's cart on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [productsRes, cartRes] = await Promise.all([
                    axios.get(`${API_URL}/api/products`),
                    axios.get(`${API_URL}/api/cart/${TEMP_USER_ID}`)
                ]);
                setProducts(productsRes.data);
                setCart(cartRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);
    
    // Add product to cart
    const addToCart = async (productId) => {
        try {
            const response = await axios.post(`${API_URL}/api/cart`, {
                userId: TEMP_USER_ID,
                productId,
                quantity: 1
            });
            setCart(response.data);
        } catch (err) {
            console.error('Error adding to cart:', err);
        }
    };
    
    // Update item quantity in cart
    const updateQuantity = async (productId, quantity) => {
        try {
            const response = await axios.put(`${API_URL}/api/cart/${TEMP_USER_ID}/${productId}`, {
                quantity
            });
            setCart(response.data);
        } catch (err) {
            console.error('Error updating cart:', err);
        }
    };
    
    // Remove item from cart
    const removeItem = async (productId) => {
        try {
            const response = await axios.delete(`${API_URL}/api/cart/${TEMP_USER_ID}/${productId}`);
            setCart(response.data);
        } catch (err) {
            console.error('Error removing from cart:', err);
        }
    };
    
    // Toggle cart visibility
    const toggleCart = () => {
        setShowCart(!showCart);
    };
    
    // Count total items in cart
    const getCartItemsCount = () => {
        return cart.items.reduce((total, item) => total + item.quantity, 0);
    };
    
    // Filter products by category
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Get unique categories from products
    const categories = ['All', ...new Set(products.map(product => product.category))];
    
    // Filter products based on selected category
    const filteredProducts = selectedCategory === 'All' 
        ? products 
        : products.filter(product => product.category === selectedCategory);

    if (loading) {
        return <div className="loading">Loading products...</div>;
    }

    return (
        <div className="shop-container">
            <Header 
                cartItemsCount={getCartItemsCount()} 
                toggleCart={toggleCart} 
            />
            
            <main className="main-content">
                <div className="sidebar">
                    <h3>Categories</h3>
                    <ul className="category-list">
                        {categories.map(category => (
                            <li 
                                key={category}
                                className={selectedCategory === category ? 'active' : ''}
                                onClick={() => setSelectedCategory(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div className="products-grid">
                    <h2>{selectedCategory} Products</h2>
                    {filteredProducts.length === 0 ? (
                        <div className="no-products">No products found</div>
                    ) : (
                        <div className="products-container">
                            {filteredProducts.map(product => (
                                <Product 
                                    key={product._id} 
                                    product={product} 
                                    addToCart={addToCart} 
                                />
                            ))}
                        </div>
                    )}
                </div>
                
                {showCart && (
                    <div className="cart-sidebar">
                        <div className="cart-close" onClick={toggleCart}>×</div>
                        <Cart 
                            cart={cart} 
                            updateQuantity={updateQuantity} 
                            removeItem={removeItem} 
                        />
                    </div>
                )}
            </main>
        </div>
    );
};

export default Home;
