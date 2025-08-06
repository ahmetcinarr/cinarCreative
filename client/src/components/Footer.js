import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-phone me-2"></i>
              Selvi GSM
            </h5>
            <p className="text-light">
              2010 yılından bu yana GSM sektöründe faaliyet gösteren Selvi GSM, 
              müşterilerine en kaliteli ürünleri en uygun fiyatlarla sunmaktadır.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-5">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light fs-5">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light fs-5">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-light fs-5">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </div>

          <div className="col-lg-2 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Hızlı Linkler</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light text-decoration-none">Ana Sayfa</Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-light text-decoration-none">Telefonlar</Link>
              </li>
              <li className="mb-2">
                <Link to="/accessories" className="text-light text-decoration-none">Aksesuarlar</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-light text-decoration-none">Hakkımızda</Link>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">Yasal</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/kvkk" className="text-light text-decoration-none">KVKK</Link>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Gizlilik Politikası</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">Kullanım Şartları</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-light text-decoration-none">İade ve Değişim</a>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-6 mb-4">
            <h6 className="fw-bold mb-3">İletişim</h6>
            <ul className="list-unstyled">
              <li className="mb-2 text-light">
                <i className="bi bi-geo-alt me-2"></i>
                İstanbul, Türkiye
              </li>
              <li className="mb-2 text-light">
                <i className="bi bi-telephone me-2"></i>
                +90 (212) 123 45 67
              </li>
              <li className="mb-2 text-light">
                <i className="bi bi-envelope me-2"></i>
                info@selvigsm.com
              </li>
              <li className="mb-2 text-light">
                <i className="bi bi-clock me-2"></i>
                Pzt-Cum: 09:00-18:00
              </li>
            </ul>
          </div>
        </div>

        <hr className="my-4 border-light" />

        <div className="row align-items-center">
          <div className="col-md-6">
            <p className="mb-0 text-light">
              &copy; 2025 Selvi GSM. Tüm hakları saklıdır.
            </p>
          </div>
          <div className="col-md-6 text-md-end">
            <p className="mb-0 text-light">
              Güvenli alışveriş için SSL sertifikalı
              <i className="bi bi-shield-check ms-2"></i>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;