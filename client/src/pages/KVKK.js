import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';

const KVKK = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get('/api/content/kvkk');
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
        <title>KVKK - Kişisel Verileri Koruma Kanunu - Selvi GSM</title>
        <meta name="description" content={content?.meta_description || 'Selvi GSM KVKK metni, kişisel verilerin korunması ve işlenmesi hakkında bilgiler'} />
      </Helmet>

      <div className="container py-5">
        {/* Page Header */}
        <div className="row mb-5">
          <div className="col">
            <h1 className="display-5 mb-3">
              <i className="bi bi-shield-lock me-3"></i>
              {content?.title || 'Kişisel Verileri Koruma Kanunu'}
            </h1>
            <div className="alert alert-info">
              <i className="bi bi-info-circle me-2"></i>
              Bu metin 6698 sayılı Kişisel Verileri Koruma Kanunu kapsamında hazırlanmıştır.
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="card">
              <div className="card-body p-4">
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
          </div>
        </div>

        {/* Quick Info */}
        <div className="row mt-5">
          <div className="col">
            <h3 className="mb-4">Kısa Bilgi</h3>
            <div className="row">
              <div className="col-md-6 mb-4">
                <div className="card border-primary">
                  <div className="card-body">
                    <h5 className="card-title text-primary">
                      <i className="bi bi-person-check me-2"></i>
                      Veri Sorumlusu
                    </h5>
                    <p className="card-text">
                      <strong>Selvi GSM</strong><br />
                      İstanbul, Türkiye<br />
                      info@selvigsm.com
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 mb-4">
                <div className="card border-success">
                  <div className="card-body">
                    <h5 className="card-title text-success">
                      <i className="bi bi-envelope me-2"></i>
                      İletişim
                    </h5>
                    <p className="card-text">
                      Haklarınızı kullanmak için:<br />
                      <strong>info@selvigsm.com</strong><br />
                      (0212) 123 45 67
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rights */}
        <div className="row mt-4">
          <div className="col">
            <h3 className="mb-4">Kişisel Veri Sahibinin Hakları</h3>
            <div className="row">
              <div className="col-md-6">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-3"></i>
                    Kişisel veri işlenip işlenmediğini öğrenme
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-3"></i>
                    İşlenen kişisel veriler hakkında bilgi talep etme
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-3"></i>
                    İşleme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-3"></i>
                    Yurt içinde veya yurt dışında kişisel verilerin aktarıldığı üçüncü kişileri bilme
                  </li>
                </ul>
              </div>
              <div className="col-md-6">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-3"></i>
                    Kişisel verilerin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-3"></i>
                    Kişisel verilerin silinmesini veya yok edilmesini isteme
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-3"></i>
                    İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle kişinin aleyhine bir sonucun ortaya çıkmasına itiraz etme
                  </li>
                  <li className="list-group-item d-flex align-items-center">
                    <i className="bi bi-check-circle text-success me-3"></i>
                    Kişisel verilerin kanuna aykırı olarak işlenmesi sebebiyle zarara uğraması hâlinde zararın giderilmesini talep etme
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="row mt-5">
          <div className="col">
            <div className="card bg-light">
              <div className="card-body">
                <h4 className="card-title">
                  <i className="bi bi-envelope me-2"></i>
                  KVKK Başvuru Formu
                </h4>
                <p className="card-text">
                  Kişisel verilerinizle ilgili haklarınızı kullanmak için aşağıdaki bilgileri kullanarak bizimle iletişime geçebilirsiniz.
                </p>
                <div className="row">
                  <div className="col-md-6">
                    <h6>E-posta ile başvuru:</h6>
                    <p><strong>info@selvigsm.com</strong></p>
                  </div>
                  <div className="col-md-6">
                    <h6>Telefon ile başvuru:</h6>
                    <p><strong>(0212) 123 45 67</strong></p>
                  </div>
                </div>
                <div className="alert alert-warning mt-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Önemli:</strong> Başvurularınızda kimlik doğrulama için geçerli kimlik belgelerinizi sunmanız gerekebilir.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Last Update */}
        <div className="row mt-4">
          <div className="col text-center">
            <small className="text-muted">
              <i className="bi bi-calendar3 me-1"></i>
              Son güncellenme: 1 Ocak 2025
            </small>
          </div>
        </div>
      </div>
    </>
  );
};

export default KVKK;