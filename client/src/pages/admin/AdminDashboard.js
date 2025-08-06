import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    categories: 0,
    featuredProducts: 0
  });
  const [recentProducts, setRecentProducts] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [productsRes, usersRes, categoriesRes] = await Promise.all([
        axios.get('/api/admin/products'),
        axios.get('/api/admin/users'),
        axios.get('/api/categories')
      ]);

      const products = productsRes.data;
      const users = usersRes.data;
      const categories = categoriesRes.data;

      setStats({
        products: products.length,
        users: users.length,
        categories: categories.length,
        featuredProducts: products.filter(p => p.is_featured).length
      });

      setRecentProducts(products.slice(0, 5));
      setRecentUsers(users.slice(0, 5));
    } catch (error) {
      console.error('Dashboard data fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner-border spinner-border-custom text-primary" role="status">
          <span className="visually-hidden">Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Selvi GSM</title>
      </Helmet>

      <div className="container-fluid">
        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                      Toplam Ürün
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.products}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-box text-primary" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                      Toplam Kullanıcı
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.users}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-people text-success" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                      Kategoriler
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.categories}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-tags text-info" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-md-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="row align-items-center">
                  <div className="col">
                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                      Öne Çıkan Ürünler
                    </div>
                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                      {stats.featuredProducts}
                    </div>
                  </div>
                  <div className="col-auto">
                    <i className="bi bi-star text-warning" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Recent Products */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">Son Eklenen Ürünler</h6>
                <Link to="/admin/products" className="btn btn-primary btn-sm">
                  Tümünü Gör
                </Link>
              </div>
              <div className="card-body">
                {recentProducts.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        {recentProducts.map(product => (
                          <tr key={product.id}>
                            <td style={{ width: '60px' }}>
                              <img 
                                src={product.image_url} 
                                alt={product.name}
                                className="img-fluid rounded"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            </td>
                            <td>
                              <div className="font-weight-bold">{product.name}</div>
                              <small className="text-muted">{product.category_name}</small>
                            </td>
                            <td className="text-end">
                              <div className="font-weight-bold text-success">
                                {formatPrice(product.discount_price || product.price)}
                              </div>
                              <small className="text-muted">
                                {formatDate(product.created_at)}
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center">Henüz ürün bulunmuyor.</p>
                )}
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="col-lg-6 mb-4">
            <div className="card shadow-sm">
              <div className="card-header py-3 d-flex justify-content-between align-items-center">
                <h6 className="m-0 font-weight-bold text-primary">Son Kayıt Olan Kullanıcılar</h6>
                <Link to="/admin/users" className="btn btn-primary btn-sm">
                  Tümünü Gör
                </Link>
              </div>
              <div className="card-body">
                {recentUsers.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table table-borderless">
                      <tbody>
                        {recentUsers.map(user => (
                          <tr key={user.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div className="avatar me-3">
                                  <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                                       style={{ width: '40px', height: '40px' }}>
                                    <span className="text-white font-weight-bold">
                                      {user.first_name.charAt(0)}
                                    </span>
                                  </div>
                                </div>
                                <div>
                                  <div className="font-weight-bold">
                                    {user.first_name} {user.last_name}
                                  </div>
                                  <small className="text-muted">{user.email}</small>
                                </div>
                              </div>
                            </td>
                            <td className="text-end">
                              <div>
                                {user.is_admin && (
                                  <span className="badge bg-warning text-dark me-1">Admin</span>
                                )}
                                <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                                  {user.is_active ? 'Aktif' : 'Pasif'}
                                </span>
                              </div>
                              <small className="text-muted">
                                {formatDate(user.created_at)}
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-muted text-center">Henüz kullanıcı bulunmuyor.</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="row">
          <div className="col">
            <div className="card shadow-sm">
              <div className="card-header py-3">
                <h6 className="m-0 font-weight-bold text-primary">Hızlı İşlemler</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-md-3 mb-3">
                    <Link to="/admin/products" className="btn btn-outline-primary w-100 h-100 d-flex flex-column justify-content-center">
                      <i className="bi bi-plus-circle mb-2" style={{ fontSize: '2rem' }}></i>
                      <span>Yeni Ürün Ekle</span>
                    </Link>
                  </div>
                  <div className="col-md-3 mb-3">
                    <Link to="/admin/users" className="btn btn-outline-success w-100 h-100 d-flex flex-column justify-content-center">
                      <i className="bi bi-people mb-2" style={{ fontSize: '2rem' }}></i>
                      <span>Kullanıcıları Yönet</span>
                    </Link>
                  </div>
                  <div className="col-md-3 mb-3">
                    <Link to="/admin/content" className="btn btn-outline-info w-100 h-100 d-flex flex-column justify-content-center">
                      <i className="bi bi-file-text mb-2" style={{ fontSize: '2rem' }}></i>
                      <span>İçerik Düzenle</span>
                    </Link>
                  </div>
                  <div className="col-md-3 mb-3">
                    <Link to="/" className="btn btn-outline-secondary w-100 h-100 d-flex flex-column justify-content-center">
                      <i className="bi bi-house mb-2" style={{ fontSize: '2rem' }}></i>
                      <span>Ana Siteyi Görüntüle</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;