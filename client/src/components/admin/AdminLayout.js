import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <div className="d-flex vh-100">
      {/* Sidebar */}
      <div className="admin-sidebar col-md-3 col-lg-2">
        <div className="p-3">
          <Link to="/admin" className="text-white text-decoration-none">
            <h4 className="mb-4">
              <i className="bi bi-gear-fill me-2"></i>
              Admin Panel
            </h4>
          </Link>

          <nav className="nav flex-column">
            <Link 
              to="/admin" 
              className={`nav-link ${isActive('/admin') && location.pathname === '/admin' ? 'active' : ''}`}
            >
              <i className="bi bi-speedometer2 me-2"></i>
              Dashboard
            </Link>
            
            <Link 
              to="/admin/products" 
              className={`nav-link ${isActive('/admin/products') ? 'active' : ''}`}
            >
              <i className="bi bi-box me-2"></i>
              Ürünler
            </Link>
            
            <Link 
              to="/admin/users" 
              className={`nav-link ${isActive('/admin/users') ? 'active' : ''}`}
            >
              <i className="bi bi-people me-2"></i>
              Kullanıcılar
            </Link>
            
            <Link 
              to="/admin/content" 
              className={`nav-link ${isActive('/admin/content') ? 'active' : ''}`}
            >
              <i className="bi bi-file-text me-2"></i>
              İçerik Yönetimi
            </Link>

            <hr className="border-secondary" />

            <Link to="/" className="nav-link">
              <i className="bi bi-house me-2"></i>
              Ana Siteye Dön
            </Link>

            <button className="nav-link btn btn-link text-start p-0" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right me-2"></i>
              Çıkış Yap
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 d-flex flex-column">
        {/* Top Bar */}
        <div className="bg-white shadow-sm border-bottom p-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              {location.pathname === '/admin' && 'Dashboard'}
              {location.pathname === '/admin/products' && 'Ürün Yönetimi'}
              {location.pathname === '/admin/users' && 'Kullanıcı Yönetimi'}
              {location.pathname === '/admin/content' && 'İçerik Yönetimi'}
            </h5>
            <div className="d-flex align-items-center">
              <span className="text-muted me-3">
                Hoş geldiniz, <strong>{user?.firstName}</strong>
              </span>
              <div className="dropdown">
                <button 
                  className="btn btn-outline-secondary btn-sm dropdown-toggle"
                  type="button" 
                  data-bs-toggle="dropdown"
                >
                  <i className="bi bi-person-circle me-1"></i>
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/">
                      <i className="bi bi-house me-2"></i>
                      Ana Site
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider" /></li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Çıkış Yap
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-grow-1 p-4 bg-light overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;