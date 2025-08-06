import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Users fetch error:', error);
      toast.error('Kullanıcılar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = 
      !filterStatus || 
      (filterStatus === 'active' && user.is_active) ||
      (filterStatus === 'inactive' && !user.is_active) ||
      (filterStatus === 'admin' && user.is_admin);
    
    return matchesSearch && matchesStatus;
  });

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
        <title>Kullanıcı Yönetimi - Admin Panel</title>
      </Helmet>

      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Kullanıcı Yönetimi</h2>
          <div className="d-flex gap-2">
            <span className="badge bg-primary fs-6">
              Toplam: {users.length}
            </span>
            <span className="badge bg-success fs-6">
              Aktif: {users.filter(u => u.is_active).length}
            </span>
            <span className="badge bg-warning fs-6">
              Admin: {users.filter(u => u.is_admin).length}
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-8">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Kullanıcı ara (ad, soyad, email)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="">Tüm Kullanıcılar</option>
                  <option value="active">Aktif Kullanıcılar</option>
                  <option value="inactive">Pasif Kullanıcılar</option>
                  <option value="admin">Adminler</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="row mb-4">
          <div className="col-md-3">
            <div className="card bg-primary text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4>{users.length}</h4>
                    <p className="mb-0">Toplam Kullanıcı</p>
                  </div>
                  <div>
                    <i className="bi bi-people" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-success text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4>{users.filter(u => u.is_active).length}</h4>
                    <p className="mb-0">Aktif Kullanıcı</p>
                  </div>
                  <div>
                    <i className="bi bi-person-check" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-warning text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4>{users.filter(u => u.is_admin).length}</h4>
                    <p className="mb-0">Admin</p>
                  </div>
                  <div>
                    <i className="bi bi-shield-check" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card bg-info text-white">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <div>
                    <h4>{users.filter(u => {
                      const today = new Date();
                      const userDate = new Date(u.created_at);
                      const diffTime = Math.abs(today - userDate);
                      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                      return diffDays <= 7;
                    }).length}</h4>
                    <p className="mb-0">Son 7 Gün</p>
                  </div>
                  <div>
                    <i className="bi bi-calendar-plus" style={{ fontSize: '2rem' }}></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Kullanıcı</th>
                    <th>E-posta</th>
                    <th>Telefon</th>
                    <th>Rol</th>
                    <th>Durum</th>
                    <th>Kayıt Tarihi</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar me-3">
                            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" 
                                 style={{ width: '40px', height: '40px' }}>
                              <span className="text-white fw-bold">
                                {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="fw-bold">
                              {user.first_name} {user.last_name}
                            </div>
                            <small className="text-muted">ID: {user.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          {user.email}
                          {user.email_verified && (
                            <i className="bi bi-patch-check text-success ms-2" title="Doğrulanmış"></i>
                          )}
                        </div>
                      </td>
                      <td>
                        {user.phone || (
                          <span className="text-muted">-</span>
                        )}
                      </td>
                      <td>
                        {user.is_admin ? (
                          <span className="badge bg-warning text-dark">
                            <i className="bi bi-shield-fill me-1"></i>
                            Admin
                          </span>
                        ) : (
                          <span className="badge bg-secondary">
                            <i className="bi bi-person me-1"></i>
                            Kullanıcı
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${user.is_active ? 'bg-success' : 'bg-danger'}`}>
                          <i className={`bi ${user.is_active ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                          {user.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td>
                        <div>
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-info"
                            title="Detayları Görüntüle"
                            onClick={() => {
                              // Kullanıcı detay modalı açılabilir
                              toast.info('Kullanıcı detayları özelliği yakında eklenecek');
                            }}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-outline-warning"
                            title="Düzenle"
                            onClick={() => {
                              // Kullanıcı düzenleme modalı açılabilir
                              toast.info('Kullanıcı düzenleme özelliği yakında eklenecek');
                            }}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredUsers.length === 0 && (
                <div className="text-center py-4">
                  <i className="bi bi-person-x display-1 text-muted mb-3"></i>
                  <p className="text-muted">
                    {searchTerm || filterStatus ? 'Arama kriterlerine uygun kullanıcı bulunamadı.' : 'Henüz kullanıcı bulunmuyor.'}
                  </p>
                  {(searchTerm || filterStatus) && (
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setSearchTerm('');
                        setFilterStatus('');
                      }}
                    >
                      Filtreleri Temizle
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Pagination info */}
            {filteredUsers.length > 0 && (
              <div className="mt-3">
                <small className="text-muted">
                  Toplam {filteredUsers.length} kullanıcı gösteriliyor
                  {searchTerm && ` "${searchTerm}" için`}
                  {filterStatus && ` (${filterStatus} filtresi aktif)`}
                </small>
              </div>
            )}
          </div>
        </div>

        {/* Info Alert */}
        <div className="alert alert-info mt-4">
          <i className="bi bi-info-circle me-2"></i>
          <strong>Bilgi:</strong> Kullanıcı düzenleme ve silme işlemleri güvenlik nedeniyle kısıtlanmıştır. 
          Özel durumlar için sistem yöneticisi ile iletişime geçin.
        </div>
      </div>
    </>
  );
};

export default AdminUsers;