import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';

const About = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/api/content/about');
      setContent(response.data);
    } catch (error) {
      console.error('Content fetch error:', error);
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
        <title>Hakkımızda - Selvi GSM</title>
        <meta name="description" content={content?.meta_description || 'Selvi GSM hakkında bilgi edinim, tarihimiz ve vizyonumuz'} />
      </Helmet>

      <div className="container py-5">
        {/* Page Header */}
        <div className="row mb-5">
          <div className="col text-center">
            <h1 className="display-4 mb-3">
              <i className="bi bi-info-circle me-3"></i>
              {content?.title || 'Hakkımızda'}
            </h1>
            <p className="lead text-muted">Selvi GSM'nin hikayesi ve değerleri</p>
          </div>
        </div>

        {/* Content */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            {content?.content ? (
              <div 
                className="content"
                dangerouslySetInnerHTML={{ __html: content.content }}
              />
            ) : (
              <div className="text-center">
                <p>İçerik yükleniyor...</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="row mt-5 text-center">
          <div className="col-md-3 mb-4">
            <div className="card border-0 h-100">
              <div className="card-body">
                <i className="bi bi-calendar-check display-4 text-primary mb-3"></i>
                <h4>10+</h4>
                <p className="text-muted">Yıllık Deneyim</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 h-100">
              <div className="card-body">
                <i className="bi bi-people display-4 text-primary mb-3"></i>
                <h4>50.000+</h4>
                <p className="text-muted">Mutlu Müşteri</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 h-100">
              <div className="card-body">
                <i className="bi bi-phone display-4 text-primary mb-3"></i>
                <h4>1000+</h4>
                <p className="text-muted">Ürün Çeşidi</p>
              </div>
            </div>
          </div>
          <div className="col-md-3 mb-4">
            <div className="card border-0 h-100">
              <div className="card-body">
                <i className="bi bi-award display-4 text-primary mb-3"></i>
                <h4>%99</h4>
                <p className="text-muted">Müşteri Memnuniyeti</p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="row mt-5">
          <div className="col">
            <h2 className="text-center mb-5">Değerlerimiz</h2>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4 mb-4">
            <div className="card border-0 text-center h-100">
              <div className="card-body">
                <i className="bi bi-shield-check display-4 text-primary mb-3"></i>
                <h5>Güvenilirlik</h5>
                <p className="text-muted">
                  Müşterilerimize her zaman en kaliteli ve orijinal ürünleri sunmayı taahhüt ediyoruz.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 text-center h-100">
              <div className="card-body">
                <i className="bi bi-heart display-4 text-primary mb-3"></i>
                <h5>Müşteri Odaklılık</h5>
                <p className="text-muted">
                  Müşteri memnuniyeti bizim için her şeyden önce gelir. 7/24 destek sağlıyoruz.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card border-0 text-center h-100">
              <div className="card-body">
                <i className="bi bi-lightning display-4 text-primary mb-3"></i>
                <h5>İnovasyon</h5>
                <p className="text-muted">
                  Teknolojinin gelişimine ayak uydurarak en yeni ürünleri müşterilerimizle buluşturuyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="row mt-5">
          <div className="col">
            <div className="card bg-primary text-white">
              <div className="card-body text-center py-5">
                <h3 className="mb-3">Bizimle İletişime Geçin</h3>
                <p className="mb-4">
                  Sorularınız mı var? GSM ihtiyaçlarınız için uzman ekibimizden destek alın.
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <a href="tel:+902121234567" className="btn btn-light">
                    <i className="bi bi-telephone me-2"></i>
                    (0212) 123 45 67
                  </a>
                  <a href="mailto:info@selvigsm.com" className="btn btn-outline-light">
                    <i className="bi bi-envelope me-2"></i>
                    info@selvigsm.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;