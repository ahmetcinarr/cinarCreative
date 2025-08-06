import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemsCount = getCartItemsCount();

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-phone me-2"></i>
          Selvi GSM
        </Link>

        <button 
          className="navbar-toggler"
          type="button"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${isMenuOpen ? 'show' : ''}`}>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Ana Sayfa</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/products">Telefonlar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/accessories">Aksesuarlar</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">Hakkımızda</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/kvkk">KVKK</Link>
            </li>
          </ul>

          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link position-relative" to="/cart">
                    <i className="bi bi-cart3 fs-5"></i>
                    {cartItemsCount > 0 && (
                      <span className="cart-badge">{cartItemsCount}</span>
                    )}
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    role="button" 
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {user?.firstName}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/account">
                        <i className="bi bi-person me-2"></i>Hesabım
                      </Link>
                    </li>
                    {user?.is_admin && (
                      <li>
                        <Link className="dropdown-item" to="/admin">
                          <i className="bi bi-gear me-2"></i>Admin Panel
                        </Link>
                      </li>
                    )}
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>Çıkış Yap
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Giriş Yap</Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary ms-2" to="/register">Kayıt Ol</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;