# Selvi GSM E-Ticaret Web Sitesi

Modern teknolojilerle geliştirilmiş GSM telefonları ve aksesuarları satışı yapan e-ticaret platformu.

## 🚀 Teknolojiler

- **Frontend:** React.js, CSS3, HTML5
- **Backend:** Node.js, Express.js
- **Veritabanı:** MySQL
- **Kimlik Doğrulama:** JWT

## 📦 Özellikler

- ✅ Kullanıcı kayıt/giriş sistemi
- ✅ Ürün katalog yönetimi
- ✅ Sepet sistemi
- ✅ Admin paneli
- ✅ Responsive tasarım
- ✅ Tosla entegrasyonu

## 🛠️ Kurulum

### 1. Projeyi klonlayın
```bash
git clone <repository-url>
cd selvi-gsm
```

### 2. Bağımlılıkları yükleyin
```bash
# Ana proje bağımlılıkları
npm install

# Backend bağımlılıkları
cd server
npm install

# Frontend bağımlılıkları
cd ../client
npm install
```

### 3. Veritabanını kurun
MySQL'de `selvi_gsm` veritabanını oluşturun ve `server/database/schema.sql` dosyasını çalıştırın.

### 4. Ortam değişkenlerini ayarlayın
`server/.env` dosyasını oluşturun:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=selvi_gsm
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 5. Uygulamayı başlatın
```bash
# Ana dizinde
npm run dev
```

## 📱 Kullanım

- **Ana Site:** http://localhost:3000
- **Admin Panel:** http://localhost:3000/admin (admin/admin123)
- **API:** http://localhost:5000/api

## 👨‍💻 Admin Bilgileri

- **Kullanıcı Adı:** admin
- **Şifre:** admin123

## 📄 Sayfalar

- Ana Sayfa
- Ürünler (Telefonlar)
- Aksesuarlar
- Hakkımızda
- KVKK
- Giriş Yap / Kayıt Ol
- Hesabım
- Admin Panel
