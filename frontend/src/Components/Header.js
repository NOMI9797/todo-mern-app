import React from 'react';
import { BsCart3 } from 'react-icons/bs';

const Header = ({ cartItemsCount, toggleCart }) => {
    return (
        <header className="app-header">
            <div className="logo">
                <h1>ShopEasy</h1>
            </div>
            <nav className="nav-menu">
                <ul>
                    <li><a href="#" className="active">Home</a></li>
                    <li><a href="#">Products</a></li>
                    <li><a href="#">Categories</a></li>
                    <li><a href="#">About</a></li>
                </ul>
            </nav>
            <div className="cart-icon" onClick={toggleCart}>
                <BsCart3 size={24} />
                {cartItemsCount > 0 && (
                    <span className="cart-count">{cartItemsCount}</span>
                )}
            </div>
        </header>
    );
};

export default Header; 