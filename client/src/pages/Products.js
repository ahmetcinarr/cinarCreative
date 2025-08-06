import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products?category=telefonlar');
      setProducts(response.data);
    } catch (error) {
      console.error('Products fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return (a.discount_price || a.price) - (b.discount_price || b.price);
        case 'price-high':
          return (b.discount_price || b.price) - (a.discount_price || a.price);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
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
        <title>Telefonlar - Selvi GSM</title>
        <meta name="description" content="En yeni GSM telefonları uygun fiyatlarla. iPhone, Samsung, Xiaomi ve daha fazlası Selvi GSM'de." />
      </Helmet>

      <div className="container py-5">
        {/* Page Header */}
        <div className="row mb-4">
          <div className="col">
            <h1 className="h2 mb-2">
              <i className="bi bi-phone me-2"></i>
              Telefonlar
            </h1>
            <p className="text-muted">En yeni ve en popüler telefon modelleri</p>
          </div>
        </div>

        {/* Filters */}
        <div className="row mb-4">
          <div className="col-md-8">
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Telefon ara... (marka, model)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">En Yeni</option>
              <option value="price-low">Fiyat (Düşük → Yüksek)</option>
              <option value="price-high">Fiyat (Yüksek → Düşük)</option>
              <option value="name">İsim (A → Z)</option>
            </select>
          </div>
        </div>

        {/* Results Info */}
        <div className="row mb-3">
          <div className="col">
            <p className="text-muted mb-0">
              {filteredAndSortedProducts.length} ürün listeleniyor
              {searchTerm && ` "${searchTerm}" için`}
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredAndSortedProducts.length > 0 ? (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {filteredAndSortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-5">
            <i className="bi bi-search display-1 text-muted mb-3"></i>
            <h4>Ürün bulunamadı</h4>
            <p className="text-muted">
              {searchTerm 
                ? `"${searchTerm}" için ürün bulunamadı. Farklı anahtar kelimeler deneyin.`
                : 'Henüz telefon ürünü bulunmuyor.'
              }
            </p>
            {searchTerm && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setSearchTerm('')}
              >
                Filtreyi Temizle
              </button>
            )}
          </div>
        )}

        {/* Popular Brands */}
        <div className="row mt-5">
          <div className="col">
            <h3 className="mb-3">Popüler Markalar</h3>
            <div className="d-flex flex-wrap gap-2">
              {['Apple', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Vivo'].map(brand => (
                <button
                  key={brand}
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setSearchTerm(brand)}
                >
                  {brand}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Products;