import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminContent = () => {
  const [contents, setContents] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');
  const [saving, setSaving] = useState(false);

  const contentTypes = [
    { key: 'about', title: 'Hakkımızda', icon: 'bi-info-circle' },
    { key: 'kvkk', title: 'KVKK', icon: 'bi-shield-lock' }
  ];

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const promises = contentTypes.map(type =>
        axios.get(`/api/content/${type.key}`)
          .then(response => ({ [type.key]: response.data }))
          .catch(() => ({ [type.key]: null }))
      );

      const results = await Promise.all(promises);
      const contentsData = results.reduce((acc, curr) => ({ ...acc, ...curr }), {});
      setContents(contentsData);
    } catch (error) {
      console.error('Contents fetch error:', error);
      toast.error('İçerikler yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (contentKey) => {
    setSaving(true);
    try {
      const content = contents[contentKey];
      if (!content) return;

      await axios.put(`/api/admin/content/${contentKey}`, {
        title: content.title,
        content: content.content,
        metaDescription: content.meta_description
      });

      toast.success('İçerik başarıyla güncellendi');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('İçerik kaydedilirken hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const updateContent = (key, field, value) => {
    setContents(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
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

  const activeContent = contents[activeTab];

  return (
    <>
      <Helmet>
        <title>İçerik Yönetimi - Admin Panel</title>
      </Helmet>

      <div className="container-fluid">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>İçerik Yönetimi</h2>
          <div className="d-flex gap-2">
            {contentTypes.map(type => (
              <span
                key={type.key}
                className={`badge ${contents[type.key] ? 'bg-success' : 'bg-secondary'} fs-6`}
              >
                {type.title}: {contents[type.key] ? 'Mevcut' : 'Boş'}
              </span>
            ))}
          </div>
        </div>

        <div className="row">
          {/* Sidebar */}
          <div className="col-md-3 mb-4">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">İçerik Türleri</h6>
              </div>
              <div className="list-group list-group-flush">
                {contentTypes.map(type => (
                  <button
                    key={type.key}
                    className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${
                      activeTab === type.key ? 'active' : ''
                    }`}
                    onClick={() => setActiveTab(type.key)}
                  >
                    <div>
                      <i className={`${type.icon} me-2`}></i>
                      {type.title}
                    </div>
                    {contents[type.key] && (
                      <span className="badge bg-success rounded-pill">
                        <i className="bi bi-check"></i>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Info */}
            <div className="card mt-3">
              <div className="card-header">
                <h6 className="mb-0">
                  <i className="bi bi-lightbulb me-2"></i>
                  Bilgi
                </h6>
              </div>
              <div className="card-body">
                <small className="text-muted">
                  <strong>HTML Desteği:</strong> İçerik alanında HTML etiketleri kullanabilirsiniz.
                  <br /><br />
                  <strong>Meta Açıklama:</strong> SEO için önemli, 150-160 karakter arası olmalı.
                  <br /><br />
                  <strong>Otomatik Kayıt:</strong> Değişiklikler otomatik olarak kaydedilmez, "Kaydet" butonuna basmanız gerekir.
                </small>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-md-9">
            {activeContent ? (
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    <i className={`${contentTypes.find(t => t.key === activeTab)?.icon} me-2`}></i>
                    {contentTypes.find(t => t.key === activeTab)?.title} Düzenle
                  </h5>
                  <button
                    className="btn btn-success"
                    onClick={() => handleSave(activeTab)}
                    disabled={saving}
                  >
                    {saving ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Kaydediliyor...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-save me-2"></i>
                        Kaydet
                      </>
                    )}
                  </button>
                </div>
                <div className="card-body">
                  <form>
                    <div className="mb-4">
                      <label htmlFor="title" className="form-label">
                        <strong>Başlık</strong>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="title"
                        value={activeContent.title || ''}
                        onChange={(e) => updateContent(activeTab, 'title', e.target.value)}
                        placeholder="Sayfa başlığı"
                      />
                    </div>

                    <div className="mb-4">
                      <label htmlFor="metaDescription" className="form-label">
                        <strong>Meta Açıklama</strong>
                        <small className="text-muted ms-2">(SEO için önemli)</small>
                      </label>
                      <textarea
                        className="form-control"
                        id="metaDescription"
                        rows="2"
                        value={activeContent.meta_description || ''}
                        onChange={(e) => updateContent(activeTab, 'meta_description', e.target.value)}
                        placeholder="Sayfa açıklaması (150-160 karakter)"
                        maxLength="160"
                      ></textarea>
                      <div className="form-text">
                        {activeContent.meta_description?.length || 0}/160 karakter
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="content" className="form-label">
                        <strong>İçerik</strong>
                        <small className="text-muted ms-2">(HTML desteklenir)</small>
                      </label>
                      <textarea
                        className="form-control"
                        id="content"
                        rows="15"
                        value={activeContent.content || ''}
                        onChange={(e) => updateContent(activeTab, 'content', e.target.value)}
                        placeholder="Sayfa içeriği... HTML etiketleri kullanabilirsiniz."
                      ></textarea>
                    </div>

                    {/* HTML Preview */}
                    {activeContent.content && (
                      <div className="mb-4">
                        <label className="form-label">
                          <strong>Önizleme</strong>
                        </label>
                        <div 
                          className="border rounded p-3 bg-light"
                          style={{ maxHeight: '300px', overflowY: 'auto' }}
                          dangerouslySetInnerHTML={{ __html: activeContent.content }}
                        />
                      </div>
                    )}

                    {/* Last Updated Info */}
                    <div className="alert alert-info">
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Son Güncelleme:</strong> {
                        activeContent.updated_at 
                          ? new Date(activeContent.updated_at).toLocaleString('tr-TR')
                          : 'Bilinmiyor'
                      }
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="bi bi-file-text display-1 text-muted mb-3"></i>
                  <h4>İçerik Bulunamadı</h4>
                  <p className="text-muted mb-4">
                    Seçilen içerik türü için henüz veri bulunmuyor.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      // Yeni içerik oluştur
                      const newContent = {
                        page_key: activeTab,
                        title: contentTypes.find(t => t.key === activeTab)?.title || '',
                        content: '',
                        meta_description: '',
                        is_active: true,
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                      };
                      setContents(prev => ({
                        ...prev,
                        [activeTab]: newContent
                      }));
                    }}
                  >
                    <i className="bi bi-plus me-2"></i>
                    Yeni İçerik Oluştur
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Help Section */}
        <div className="row mt-4">
          <div className="col">
            <div className="card bg-light">
              <div className="card-body">
                <h6 className="card-title">
                  <i className="bi bi-question-circle me-2"></i>
                  Yardım & İpuçları
                </h6>
                <div className="row">
                  <div className="col-md-6">
                    <h6>HTML Etiketleri:</h6>
                    <ul className="small">
                      <li><code>&lt;h2&gt;&lt;/h2&gt;</code> - Alt başlık</li>
                      <li><code>&lt;p&gt;&lt;/p&gt;</code> - Paragraf</li>
                      <li><code>&lt;strong&gt;&lt;/strong&gt;</code> - Kalın yazı</li>
                      <li><code>&lt;ul&gt;&lt;li&gt;&lt;/li&gt;&lt;/ul&gt;</code> - Liste</li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <h6>SEO İpuçları:</h6>
                    <ul className="small">
                      <li>Meta açıklama 150-160 karakter arası olmalı</li>
                      <li>Başlık net ve açıklayıcı olmalı</li>
                      <li>İçerikte anahtar kelimeleri kullanın</li>
                      <li>H2, H3 etiketleriyle yapılandırın</li>
                    </ul>
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

export default AdminContent;