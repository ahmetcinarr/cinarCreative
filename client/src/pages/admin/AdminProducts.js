import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    price: '',
    discountPrice: '',
    stockQuantity: '',
    categoryId: '',
    brand: '',
    model: '',
    color: '',
    storage: '',
    imageUrl: '',
    toslaUrl: '',
    isFeatured: false,
    isActive: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get('/api/admin/products'),
        axios.get('/api/categories')
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (error) {
      console.error('Data fetch error:', error);
      toast.error('Veriler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      shortDescription: '',
      price: '',
      discountPrice: '',
      stockQuantity: '',
      categoryId: '',
      brand: '',
      model: '',
      color: '',
      storage: '',
      imageUrl: '',
      toslaUrl: '',
      isFeatured: false,
      isActive: true
    });
    setEditingProduct(null);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      shortDescription: product.short_description || '',
      price: product.price || '',
      discountPrice: product.discount_price || '',
      stockQuantity: product.stock_quantity || '',
      categoryId: product.category_id || '',
      brand: product.brand || '',
      model: product.model || '',
      color: product.color || '',
      storage: product.storage || '',
      imageUrl: product.image_url || '',
      toslaUrl: product.tosla_url || '',
      isFeatured: product.is_featured || false,
      isActive: product.is_active !== false
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingProduct) {
        await axios.put(`/api/admin/products/${editingProduct.id}`, formData);
        toast.success('Ürün başarıyla güncellendi');
      } else {
        await axios.post('/api/admin/products', formData);
        toast.success('Ürün başarıyla eklendi');
      }
      
      setShowModal(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Save error:', error);
      toast.error(error.response?.data?.error || 'İşlem sırasında hata oluştu');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/products/${id}`);
      toast.success('Ürün başarıyla silindi');
      fetchData();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Ürün silinirken hata oluştu');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('tr-TR');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filterCategory || product.category_id.toString() === filterCategory;
    return matchesSearch && matchesCategory;
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
        <title>Ürün Yönetimi - Admin Panel</title>
      </Helmet>

      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Ürün Yönetimi</h2>
          <button 
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
          >
            <i className="bi bi-plus me-2"></i>
            Yeni Ürün Ekle
          </button>
        </div>

        {/* Filters */}
        <div className="card mb-4">
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ürün ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <select
                  className="form-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="card">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Resim</th>
                    <th>Ürün Adı</th>
                    <th>Kategori</th>
                    <th>Fiyat</th>
                    <th>Stok</th>
                    <th>Durum</th>
                    <th>Tarih</th>
                    <th>İşlemler</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="rounded"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      </td>
                      <td>
                        <div>
                          <strong>{product.name}</strong>
                          {product.is_featured && (
                            <span className="badge bg-warning text-dark ms-2">Öne Çıkan</span>
                          )}
                          <br />
                          <small className="text-muted">
                            {product.brand} {product.model}
                          </small>
                        </div>
                      </td>
                      <td>{product.category_name}</td>
                      <td>
                        {product.discount_price ? (
                          <>
                            <span className="text-success fw-bold">
                              {formatPrice(product.discount_price)}
                            </span>
                            <br />
                            <small className="text-muted text-decoration-line-through">
                              {formatPrice(product.price)}
                            </small>
                          </>
                        ) : (
                          <span className="fw-bold">
                            {formatPrice(product.price)}
                          </span>
                        )}
                      </td>
                      <td>
                        <span className={`badge ${product.stock_quantity > 0 ? 'bg-success' : 'bg-danger'}`}>
                          {product.stock_quantity}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${product.is_active ? 'bg-success' : 'bg-secondary'}`}>
                          {product.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td>{formatDate(product.created_at)}</td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleEdit(product)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() => handleDelete(product.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-muted">Ürün bulunamadı.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Modal */}
        {showModal && (
          <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <form onSubmit={handleSubmit}>
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingProduct ? 'Ürün Düzenle' : 'Yeni Ürün Ekle'}
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Ürün Adı *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Kategori *</label>
                        <select
                          className="form-select"
                          value={formData.categoryId}
                          onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                          required
                        >
                          <option value="">Kategori Seçin</option>
                          {categories.map(category => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Kısa Açıklama</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.shortDescription}
                        onChange={(e) => setFormData({...formData, shortDescription: e.target.value})}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Açıklama</label>
                      <textarea
                        className="form-control"
                        rows="4"
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})}
                      ></textarea>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Fiyat *</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">İndirimli Fiyat</label>
                        <input
                          type="number"
                          step="0.01"
                          className="form-control"
                          value={formData.discountPrice}
                          onChange={(e) => setFormData({...formData, discountPrice: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Stok Miktarı</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.stockQuantity}
                          onChange={(e) => setFormData({...formData, stockQuantity: e.target.value})}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Marka</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.brand}
                          onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">Model</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.model}
                          onChange={(e) => setFormData({...formData, model: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Renk</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.color}
                          onChange={(e) => setFormData({...formData, color: e.target.value})}
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">Depolama</label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.storage}
                          onChange={(e) => setFormData({...formData, storage: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Resim URL'si</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Tosla URL'si</label>
                      <input
                        type="url"
                        className="form-control"
                        value={formData.toslaUrl}
                        onChange={(e) => setFormData({...formData, toslaUrl: e.target.value})}
                      />
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.isFeatured}
                            onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})}
                          />
                          <label className="form-check-label">Öne Çıkan Ürün</label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.isActive}
                            onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                          />
                          <label className="form-check-label">Aktif</label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      İptal
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editingProduct ? 'Güncelle' : 'Kaydet'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminProducts;