import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';
import '../styles/components/Header.css';

const Header: React.FC = () => (
    <header className="header">
        <div className="header-logo-container">
            <Link to="/">
                <img
                    src="/images/logo_nobg.png"
                    alt="Bioskop Logo"
                    className="header-logo"
                    style={{ height: 48, margin: '0 auto', display: 'block' }}
                />
            </Link>
        </div>
        <div className="header-cart-container">
            <Link to="/cart" className="header-cart-link" title="Korpa">
                {FaShoppingCart({ className: "header-cart-icon" })}
            </Link>
        </div>
    </header>
);

export default Header;