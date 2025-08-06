-- Selvi GSM E-Ticaret Veritabanı Şeması

DROP DATABASE IF EXISTS selvi_gsm;
CREATE DATABASE selvi_gsm CHARACTER SET utf8mb4 COLLATE utf8mb4_turkish_ci;
USE selvi_gsm;

-- Kategoriler tablosu
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    image_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Ürünler tablosu
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    short_description VARCHAR(500),
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2) DEFAULT NULL,
    stock_quantity INT DEFAULT 0,
    category_id INT NOT NULL,
    brand VARCHAR(100),
    model VARCHAR(100),
    color VARCHAR(50),
    storage VARCHAR(50),
    image_url VARCHAR(255),
    gallery TEXT, -- JSON array of image URLs
    specifications TEXT, -- JSON object
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    tosla_url VARCHAR(500), -- Tosla ürün URL'si
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    INDEX idx_category (category_id),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured)
);

-- Kullanıcılar tablosu
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    city VARCHAR(50),
    district VARCHAR(50),
    postal_code VARCHAR(10),
    is_admin BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
);

-- Sepet tablosu
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Siparişler tablosu
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    order_number VARCHAR(50) NOT NULL UNIQUE,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT NOT NULL,
    billing_address TEXT NOT NULL,
    payment_method VARCHAR(50),
    payment_status ENUM('pending', 'paid', 'failed', 'refunded') DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_status (status)
);

-- Sipariş detayları tablosu
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Site içerikleri tablosu
CREATE TABLE site_contents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(50) NOT NULL UNIQUE,
    title VARCHAR(200),
    content TEXT,
    meta_description VARCHAR(300),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Başlangıç verileri
INSERT INTO categories (name, slug, description) VALUES
('Telefonlar', 'telefonlar', 'Akıllı telefonlar ve cep telefonları'),
('Aksesuarlar', 'aksesuarlar', 'Telefon aksesuarları ve yedek parçalar');

-- Admin kullanıcısı (şifre: admin123)
INSERT INTO users (first_name, last_name, email, password, is_admin) VALUES
('Admin', 'User', 'admin@selvigsm.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- Örnek ürünler
INSERT INTO products (name, slug, description, short_description, price, discount_price, stock_quantity, category_id, brand, model, color, storage, image_url, tosla_url, is_featured) VALUES
('iPhone 15 Pro Max', 'iphone-15-pro-max', 'Apple iPhone 15 Pro Max 256GB Doğal Titanyum cep telefonu. A17 Pro çip ile güçlendirilmiş, gelişmiş kamera sistemi ve titanyum tasarım.', 'Apple iPhone 15 Pro Max 256GB Doğal Titanyum', 65999.99, 59999.99, 10, 1, 'Apple', 'iPhone 15 Pro Max', 'Doğal Titanyum', '256GB', 'https://via.placeholder.com/400x400/007bff/ffffff?text=iPhone+15+Pro+Max', 'https://www.tosla.com/iphone-15-pro-max', TRUE),
('Samsung Galaxy S24 Ultra', 'samsung-galaxy-s24-ultra', 'Samsung Galaxy S24 Ultra 512GB Titanyum Gri akıllı telefon. S Pen ile gelişmiş üretkenlik, AI destekli kamera ve 200MP ana kamera.', 'Samsung Galaxy S24 Ultra 512GB Titanyum Gri', 54999.99, 49999.99, 8, 1, 'Samsung', 'Galaxy S24 Ultra', 'Titanyum Gri', '512GB', 'https://via.placeholder.com/400x400/28a745/ffffff?text=Galaxy+S24+Ultra', 'https://www.tosla.com/samsung-galaxy-s24-ultra', TRUE),
('Xiaomi 14 Ultra', 'xiaomi-14-ultra', 'Xiaomi 14 Ultra 512GB Siyah akıllı telefon. Leica kameralar, Snapdragon 8 Gen 3 işlemci ve hızlı şarj teknolojisi.', 'Xiaomi 14 Ultra 512GB Siyah', 39999.99, 35999.99, 15, 1, 'Xiaomi', '14 Ultra', 'Siyah', '512GB', 'https://via.placeholder.com/400x400/fd7e14/ffffff?text=Xiaomi+14+Ultra', 'https://www.tosla.com/xiaomi-14-ultra', TRUE),
('AirPods Pro 2. Nesil', 'airpods-pro-2', 'Apple AirPods Pro 2. Nesil USB-C. Aktif gürültü engelleme, şeffaflık modu ve kişiselleştirilmiş ses deneyimi.', 'Apple AirPods Pro 2. Nesil USB-C', 2999.99, 2699.99, 25, 2, 'Apple', 'AirPods Pro', 'Beyaz', NULL, 'https://via.placeholder.com/400x400/6c757d/ffffff?text=AirPods+Pro', 'https://www.tosla.com/airpods-pro-2', FALSE),
('Samsung 45W Hızlı Şarj Aleti', 'samsung-45w-sarj', 'Samsung 45W USB-C Hızlı Şarj Aleti. Uyumlu cihazları hızla şarj eden güçlü adaptör.', 'Samsung 45W USB-C Hızlı Şarj Aleti', 599.99, 499.99, 50, 2, 'Samsung', '45W Charger', 'Beyaz', NULL, 'https://via.placeholder.com/400x400/dc3545/ffffff?text=45W+Charger', 'https://www.tosla.com/samsung-45w-charger', FALSE),
('Spigen Tough Armor Kılıf', 'spigen-tough-armor', 'Spigen Tough Armor iPhone 15 Pro Max Kılıf. Çift katmanlı koruma ve kickstand özelliği.', 'Spigen Tough Armor iPhone 15 Pro Max Kılıf', 299.99, 249.99, 30, 2, 'Spigen', 'Tough Armor', 'Siyah', NULL, 'https://via.placeholder.com/400x400/6f42c1/ffffff?text=Spigen+Case', 'https://www.tosla.com/spigen-tough-armor', FALSE);

-- Site içerikleri
INSERT INTO site_contents (page_key, title, content, meta_description) VALUES
('about', 'Hakkımızda', '<h2>Selvi GSM Hakkında</h2><p>2010 yılından bu yana GSM sektöründe faaliyet gösteren Selvi GSM, müşterilerine en kaliteli ürünleri en uygun fiyatlarla sunmayı amaçlamaktadır.</p><p>Geniş ürün yelpazemiz ve uzman kadromuzla, her türlü GSM ihtiyacınızı karşılamak için buradayız. Orijinal ürünler, garantili hizmet ve müşteri memnuniyeti önceliğimizdir.</p><h3>Neden Selvi GSM?</h3><ul><li>10+ yıllık deneyim</li><li>Orijinal ve garantili ürünler</li><li>Uygun fiyat garantisi</li><li>Hızlı kargo ve güvenli alışveriş</li><li>7/24 müşteri desteği</li></ul>', 'Selvi GSM hakkında bilgi, GSM sektöründe 10+ yıllık deneyim'),
('kvkk', 'Kişisel Verileri Koruma Kanunu', '<h2>Kişisel Verileri Koruma Kanunu (KVKK) Metni</h2><h3>1. Veri Sorumlusu</h3><p>6698 sayılı Kişisel Verileri Koruma Kanunu uyarınca, kişisel verilerinizin veri sorumlusu Selvi GSM''dir.</p><h3>2. Kişisel Verilerin İşlenme Amacı</h3><p>Kişisel verileriniz aşağıdaki amaçlarla işlenmektedir:</p><ul><li>Sipariş süreçlerinin yönetimi</li><li>Müşteri hizmetlerinin sunulması</li><li>Ürün ve hizmet tanıtımları</li><li>Yasal yükümlülüklerin yerine getirilmesi</li></ul><h3>3. Kişisel Verilerin Aktarılması</h3><p>Kişisel verileriniz, yalnızca yukarıda belirtilen amaçlarla sınırlı olarak ve gerekli güvenlik tedbirleri alınarak işlenmektedir.</p><h3>4. Kişisel Veri Sahibinin Hakları</h3><p>KVKK''nın 11. maddesi uyarınca sahip olduğunuz haklar:</p><ul><li>Kişisel veri işlenip işlenmediğini öğrenme</li><li>Kişisel verilerinizin düzeltilmesini isteme</li><li>Kişisel verilerinizin silinmesini isteme</li><li>İşleme faaliyetine itiraz etme</li></ul><p>Bu haklarınızı kullanmak için info@selvigsm.com adresine başvurabilirsiniz.</p>', 'Selvi GSM KVKK metni, kişisel verilerin korunması');

-- Triggers ve İndeksler
DELIMITER //

CREATE TRIGGER update_product_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

CREATE TRIGGER update_user_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
BEGIN
    SET NEW.updated_at = CURRENT_TIMESTAMP;
END//

DELIMITER ;

-- Performans için ek indeksler
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_users_name ON users(first_name, last_name);
CREATE INDEX idx_orders_date ON orders(created_at);

-- Veritabanı oluşturma tamamlandı
SELECT 'Selvi GSM veritabanı başarıyla oluşturuldu!' as message;