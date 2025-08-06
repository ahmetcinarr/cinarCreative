import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        axios.get('/api/products?featured=true&limit=6'),
        axios.get('/api/categories')
      ]);

      setFeaturedProducts(productsResponse.data);
      setCategories(categoriesResponse.data);
    } catch (error) {
      console.error('Data fetch error:', error);
    } finally {
      setLoading(false);
    }
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
        <title>Selvi GSM - GSM Telefonları ve Aksesuarları</title>
        <meta name="description" content="Selvi GSM'de en yeni GSM telefonları ve aksesuarları uygun fiyatlarla. iPhone, Samsung, Xiaomi ve daha fazlası." />
        <meta name="keywords" content="gsm, telefon, iphone, samsung, xiaomi, aksesuar, cep telefonu" />
      </Helmet>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">
                En Yeni GSM Teknolojileri
              </h1>
              <p className="hero-subtitle">
                2010'dan bu yana güvenilir hizmet. En kaliteli telefonlar ve aksesuarlar, 
                en uygun fiyatlarla Selvi GSM'de!
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Link to="/products" className="btn btn-light btn-lg">
                  <i className="bi bi-phone me-2"></i>
                  Telefonları İncele
                </Link>
                <Link to="/accessories" className="btn btn-outline-light btn-lg">
                  <i className="bi bi-headphones me-2"></i>
                  Aksesuarlar
                </Link>
              </div>
            </div>
            <div className="col-lg-6 text-center">
              <i className="bi bi-phone display-1 text-white opacity-50"></i>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Kategorilerimiz</h2>
          <div className="row g-4">
            {categories.map(category => (
              <div key={category.id} className="col-md-6">
                <Link 
                  to={category.slug === 'telefonlar' ? '/products' : '/accessories'} 
                  className="category-card"
                >
                  <div className="category-icon">
                    <i className={`bi ${category.slug === 'telefonlar' ? 'bi-phone' : 'bi-headphones'}`}></i>
                  </div>
                  <h4>{category.name}</h4>
                  <p className="text-muted mb-0">{category.description}</p>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="row align-items-center mb-5">
            <div className="col">
              <h2>Öne Çıkan Ürünler</h2>
              <p className="text-muted">En popüler ve en çok tercih edilen ürünlerimiz</p>
            </div>
            <div className="col-auto">
              <Link to="/products" className="btn btn-primary">
                Tümünü Gör
                <i className="bi bi-arrow-right ms-2"></i>
              </Link>
            </div>
          </div>

          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container">
          <h2 className="text-center mb-5">Neden Selvi GSM?</h2>
          <div className="row g-4">
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mb-3">
                <i className="bi bi-shield-check display-4 text-primary"></i>
              </div>
              <h5>Orijinal Ürünler</h5>
              <p className="text-muted">Tüm ürünlerimiz orijinal ve garantilidir</p>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mb-3">
                <i className="bi bi-truck display-4 text-primary"></i>
              </div>
              <h5>Hızlı Kargo</h5>
              <p className="text-muted">Türkiye geneli ücretsiz ve hızlı kargo</p>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mb-3">
                <i className="bi bi-headset display-4 text-primary"></i>
              </div>
              <h5>7/24 Destek</h5>
              <p className="text-muted">Her zaman yanınızda müşteri hizmetleri</p>
            </div>
            <div className="col-lg-3 col-md-6 text-center">
              <div className="mb-3">
                <i className="bi bi-award display-4 text-primary"></i>
              </div>
              <h5>10+ Yıl Tecrübe</h5>
              <p className="text-muted">2010'dan bu yana sektörde lideriz</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container text-center">
          <h3 className="mb-3">Yeni Ürünlerden Haberdar Olun</h3>
          <p className="mb-4">En yeni telefon modellerini ve kampanyalarımızı kaçırmayın!</p>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group">
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="E-posta adresiniz"
                />
                <button className="btn btn-light" type="button">
                  Abone Ol
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;