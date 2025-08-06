-- ===== CREATIVE DIGITAL AGENCY DATABASE SCHEMA =====
-- Database: creative_digital_agency
-- Version: 1.0
-- Created: 2025

-- Create database (run this separately if needed)
-- CREATE DATABASE IF NOT EXISTS creative_digital_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE creative_digital_agency;

-- ===== USERS TABLE (Admin Users) =====
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    role ENUM('admin', 'editor', 'viewer') DEFAULT 'editor',
    avatar VARCHAR(255) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_role (role)
);

-- ===== SITE SETTINGS TABLE =====
CREATE TABLE IF NOT EXISTS site_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value TEXT,
    setting_type ENUM('text', 'textarea', 'number', 'boolean', 'json') DEFAULT 'text',
    description TEXT,
    category VARCHAR(50) DEFAULT 'general',
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_key (setting_key),
    INDEX idx_category (category)
);

-- ===== PORTFOLIO PROJECTS TABLE =====
CREATE TABLE IF NOT EXISTS portfolio_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    short_description TEXT,
    full_description TEXT,
    client_name VARCHAR(100),
    project_url VARCHAR(255),
    featured_image VARCHAR(255),
    gallery_images JSON,
    technologies JSON,
    categories JSON,
    project_date DATE,
    duration VARCHAR(50),
    budget_range VARCHAR(50),
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    meta_title VARCHAR(200),
    meta_description TEXT,
    testimonial TEXT,
    testimonial_author VARCHAR(100),
    testimonial_position VARCHAR(100),
    results JSON,
    challenge TEXT,
    solution TEXT,
    views_count INT DEFAULT 0,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_date (project_date),
    INDEX idx_sort (sort_order),
    FULLTEXT idx_search (title, short_description, full_description)
);

-- ===== TEAM MEMBERS TABLE =====
CREATE TABLE IF NOT EXISTS team_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    bio TEXT,
    avatar VARCHAR(255),
    email VARCHAR(100),
    phone VARCHAR(20),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    instagram_url VARCHAR(255),
    github_url VARCHAR(255),
    behance_url VARCHAR(255),
    dribbble_url VARCHAR(255),
    skills JSON,
    years_experience INT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    joined_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_position (position),
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active),
    INDEX idx_sort (sort_order)
);

-- ===== CONTACT MESSAGES TABLE =====
CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    company VARCHAR(100),
    budget_range VARCHAR(50),
    services_interested JSON,
    message TEXT NOT NULL,
    newsletter_subscribe BOOLEAN DEFAULT FALSE,
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    assigned_to INT,
    notes TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    replied_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_priority (priority),
    INDEX idx_created (created_at),
    FULLTEXT idx_search (first_name, last_name, company, message)
);

-- ===== BLOG POSTS TABLE (Optional for future expansion) =====
CREATE TABLE IF NOT EXISTS blog_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    slug VARCHAR(200) NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT,
    featured_image VARCHAR(255),
    author_id INT,
    category VARCHAR(100),
    tags JSON,
    status ENUM('draft', 'published', 'scheduled', 'archived') DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP NULL,
    meta_title VARCHAR(200),
    meta_description TEXT,
    views_count INT DEFAULT 0,
    likes_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_slug (slug),
    INDEX idx_status (status),
    INDEX idx_featured (is_featured),
    INDEX idx_published (published_at),
    INDEX idx_category (category),
    FULLTEXT idx_search (title, excerpt, content)
);

-- ===== SERVICES TABLE =====
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    short_description TEXT,
    full_description TEXT,
    icon VARCHAR(100),
    featured_image VARCHAR(255),
    features JSON,
    pricing_info JSON,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    meta_title VARCHAR(200),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_slug (slug),
    INDEX idx_active (is_active),
    INDEX idx_featured (is_featured),
    INDEX idx_sort (sort_order)
);

-- ===== TESTIMONIALS TABLE =====
CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(100) NOT NULL,
    client_position VARCHAR(100),
    client_company VARCHAR(100),
    client_avatar VARCHAR(255),
    testimonial TEXT NOT NULL,
    rating INT DEFAULT 5 CHECK (rating >= 1 AND rating <= 5),
    project_id INT,
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES portfolio_projects(id) ON DELETE SET NULL,
    INDEX idx_featured (is_featured),
    INDEX idx_active (is_active),
    INDEX idx_rating (rating),
    INDEX idx_sort (sort_order)
);

-- ===== PAGE ANALYTICS TABLE =====
CREATE TABLE IF NOT EXISTS page_analytics (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_url VARCHAR(255) NOT NULL,
    page_title VARCHAR(200),
    visitor_ip VARCHAR(45),
    user_agent TEXT,
    referrer VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    session_id VARCHAR(100),
    visit_duration INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_url (page_url),
    INDEX idx_date (created_at),
    INDEX idx_session (session_id)
);

-- ===== SESSIONS TABLE (for admin login sessions) =====
CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id INT NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user (user_id),
    INDEX idx_activity (last_activity)
);

-- ===== INSERT DEFAULT DATA =====

-- Insert default admin user (password: admin123 - change this!)
INSERT INTO users (username, email, password_hash, first_name, last_name, role) VALUES 
('admin', 'admin@creativedigital.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin', 'User', 'admin');

-- Insert default site settings
INSERT INTO site_settings (setting_key, setting_value, setting_type, description, category, is_public) VALUES
('site_name', 'Creative Digital Agency', 'text', 'Website name', 'general', true),
('site_tagline', 'Transform Your Brand with Creative Digital Solutions', 'text', 'Website tagline', 'general', true),
('site_description', 'We craft exceptional digital experiences that drive growth, engage audiences, and elevate your brand to new heights.', 'textarea', 'Website description', 'general', true),
('contact_email', 'hello@creativedigital.com', 'text', 'Main contact email', 'contact', true),
('contact_phone', '+1 (234) 567-8900', 'text', 'Main contact phone', 'contact', true),
('contact_address', '123 Creative Street, Design City, DC 12345', 'textarea', 'Office address', 'contact', true),
('business_hours', 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed', 'textarea', 'Business hours', 'contact', true),
('social_facebook', 'https://facebook.com/creativedigital', 'text', 'Facebook URL', 'social', true),
('social_twitter', 'https://twitter.com/creativedigital', 'text', 'Twitter URL', 'social', true),
('social_instagram', 'https://instagram.com/creativedigital', 'text', 'Instagram URL', 'social', true),
('social_linkedin', 'https://linkedin.com/company/creativedigital', 'text', 'LinkedIn URL', 'social', true),
('social_dribbble', 'https://dribbble.com/creativedigital', 'text', 'Dribbble URL', 'social', true),
('hero_title', 'Transform Your Brand with Creative Digital Solutions', 'text', 'Homepage hero title', 'homepage', false),
('hero_subtitle', 'We craft exceptional digital experiences that drive growth, engage audiences, and elevate your brand to new heights.', 'textarea', 'Homepage hero subtitle', 'homepage', false),
('stats_projects', '500', 'number', 'Number of completed projects', 'stats', true),
('stats_clients', '200', 'number', 'Number of satisfied clients', 'stats', true),
('stats_satisfaction', '98', 'number', 'Client satisfaction percentage', 'stats', true),
('google_analytics', '', 'text', 'Google Analytics tracking ID', 'tracking', false),
('google_maps_api_key', '', 'text', 'Google Maps API key', 'apis', false);

-- Insert sample team members
INSERT INTO team_members (first_name, last_name, position, bio, email, linkedin_url, skills, years_experience, is_featured, sort_order, joined_date) VALUES
('Alex', 'Johnson', 'Founder & CEO', 'Visionary leader with 10+ years in digital strategy and brand development. Alex founded the agency with a mission to transform how brands connect with their audiences.', 'alex@creativedigital.com', 'https://linkedin.com/in/alexjohnson', '["Strategy", "Leadership", "Branding"]', 10, true, 1, '2019-01-01'),
('Sarah', 'Chen', 'Creative Director', 'Award-winning designer with expertise in brand identity and digital experiences. Sarah leads our creative team with innovative design thinking.', 'sarah@creativedigital.com', 'https://linkedin.com/in/sarahchen', '["Design", "Branding", "UI/UX"]', 8, true, 2, '2019-03-15'),
('Mike', 'Rodriguez', 'Technical Director', 'Full-stack developer and technology strategist with expertise in modern web technologies and scalable solutions.', 'mike@creativedigital.com', 'https://linkedin.com/in/mikerodriguez', '["Development", "Architecture", "DevOps"]', 12, true, 3, '2019-06-01'),
('Emma', 'Wilson', 'Marketing Director', 'Digital marketing expert specializing in social media strategy, content marketing, and performance optimization.', 'emma@creativedigital.com', 'https://linkedin.com/in/emmawilson', '["Marketing", "Social Media", "Analytics"]', 6, true, 4, '2020-02-01'),
('David', 'Kim', 'UX/UI Designer', 'User experience specialist focused on creating intuitive and engaging digital interfaces that delight users.', 'david@creativedigital.com', 'https://linkedin.com/in/davidkim', '["UX Design", "Prototyping", "Research"]', 5, true, 5, '2020-08-15'),
('Lisa', 'Taylor', 'Client Success Manager', 'Dedicated to ensuring client satisfaction and project success through excellent communication and relationship management.', 'lisa@creativedigital.com', 'https://linkedin.com/in/lisataylor', '["Client Relations", "Project Management", "Communication"]', 7, true, 6, '2021-01-10');

-- Insert sample services
INSERT INTO services (name, slug, short_description, features, is_active, is_featured, sort_order) VALUES
('Digital Advertising', 'digital-advertising', 'Strategic digital campaigns that reach your target audience and drive conversions across all platforms.', '["Google Ads Management", "Social Media Advertising", "Display Campaigns", "Retargeting", "Performance Optimization"]', true, true, 1),
('Web Design & Development', 'web-design-development', 'Modern, responsive websites that provide exceptional user experiences and drive business growth.', '["Responsive Design", "E-commerce Solutions", "CMS Development", "Custom Applications", "Performance Optimization"]', true, true, 2),
('Social Media Marketing', 'social-media-marketing', 'Engaging social media strategies that build communities and amplify your brand message.', '["Content Strategy", "Community Management", "Influencer Partnerships", "Social Advertising", "Analytics & Reporting"]', true, true, 3),
('Brand Identity', 'brand-identity', 'Comprehensive branding solutions that create memorable and impactful brand experiences.', '["Logo Design", "Brand Guidelines", "Visual Identity", "Brand Strategy", "Print Design"]', true, true, 4),
('SEO Optimization', 'seo-optimization', 'Data-driven SEO strategies that improve your search rankings and drive organic traffic.', '["Keyword Research", "Technical SEO", "Content Optimization", "Link Building", "Local SEO"]', true, true, 5),
('Analytics & Reporting', 'analytics-reporting', 'Comprehensive analytics and reporting to track performance and optimize your digital presence.', '["Performance Tracking", "Custom Dashboards", "ROI Analysis", "Conversion Optimization", "Data Insights"]', true, true, 6);

-- Insert sample testimonials
INSERT INTO testimonials (client_name, client_position, client_company, testimonial, rating, is_featured, sort_order) VALUES
('John Smith', 'CEO', 'TechStore Inc.', 'Creative Digital transformed our online presence completely. The new platform is not only beautiful but also incredibly functional.', 5, true, 1),
('Sarah Johnson', 'Founder', 'GreenLeaf Sustainability', 'The new brand identity perfectly captures our mission and values. We\'ve seen incredible response from our target audience.', 5, true, 2),
('Mike Wilson', 'Marketing Director', 'FitLife Gym Chain', 'The campaign exceeded all our expectations. We\'ve never seen engagement like this before!', 5, true, 3),
('Maria Rodriguez', 'Owner', 'Artisan Cafe', 'Our new website is absolutely beautiful and has dramatically increased our online presence and orders.', 5, true, 4);

-- Create indexes for better performance
CREATE INDEX idx_portfolio_search ON portfolio_projects(title, client_name);
CREATE INDEX idx_contact_date_status ON contact_messages(created_at, status);
CREATE INDEX idx_team_name ON team_members(first_name, last_name);

-- ===== TRIGGERS FOR AUTOMATIC UPDATES =====

-- Update portfolio project view count
DELIMITER //
CREATE TRIGGER update_project_views 
    AFTER INSERT ON page_analytics 
    FOR EACH ROW 
BEGIN
    IF NEW.page_url LIKE '/portfolio/%' THEN
        UPDATE portfolio_projects 
        SET views_count = views_count + 1 
        WHERE slug = SUBSTRING_INDEX(SUBSTRING_INDEX(NEW.page_url, '/', -1), '?', 1);
    END IF;
END//
DELIMITER ;

-- ===== STORED PROCEDURES =====

-- Get portfolio projects with filters
DELIMITER //
CREATE PROCEDURE GetPortfolioProjects(
    IN p_category VARCHAR(100),
    IN p_limit INT,
    IN p_offset INT,
    IN p_status VARCHAR(20)
)
BEGIN
    SET @sql = 'SELECT * FROM portfolio_projects WHERE 1=1';
    
    IF p_category IS NOT NULL AND p_category != '' THEN
        SET @sql = CONCAT(@sql, ' AND JSON_CONTAINS(categories, \'\"', p_category, '\"\')');
    END IF;
    
    IF p_status IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' AND status = \'', p_status, '\'');
    ELSE
        SET @sql = CONCAT(@sql, ' AND status = \'published\'');
    END IF;
    
    SET @sql = CONCAT(@sql, ' ORDER BY is_featured DESC, sort_order ASC, created_at DESC');
    
    IF p_limit IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' LIMIT ', p_limit);
    END IF;
    
    IF p_offset IS NOT NULL THEN
        SET @sql = CONCAT(@sql, ' OFFSET ', p_offset);
    END IF;
    
    PREPARE stmt FROM @sql;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
END//
DELIMITER ;

-- Get contact message statistics
DELIMITER //
CREATE PROCEDURE GetContactStats(
    IN p_days INT
)
BEGIN
    SELECT 
        COUNT(*) as total_messages,
        COUNT(CASE WHEN status = 'new' THEN 1 END) as new_messages,
        COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied_messages,
        COUNT(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL p_days DAY) THEN 1 END) as recent_messages
    FROM contact_messages;
END//
DELIMITER ;

-- ===== KATEGORİLER TABLOSU =====
CREATE TABLE IF NOT EXISTS kategoriler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ad VARCHAR(100) NOT NULL,
    aciklama TEXT,
    tur ENUM('telefon', 'aksesuar') NOT NULL,
    aktif BOOLEAN DEFAULT TRUE
);

-- ===== ÜRÜNLER TABLOSU =====
CREATE TABLE IF NOT EXISTS urunler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kategori_id INT NOT NULL,
    ad VARCHAR(100) NOT NULL,
    aciklama TEXT,
    teknik_ozellikler TEXT,
    fiyat DECIMAL(10,2) NOT NULL,
    resim VARCHAR(255),
    marka VARCHAR(50),
    stok INT DEFAULT 0,
    aktif BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (kategori_id) REFERENCES kategoriler(id)
);

-- ===== AKSESUARLAR TABLOSU =====
CREATE TABLE IF NOT EXISTS aksesuarlar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kategori_id INT NOT NULL,
    ad VARCHAR(100) NOT NULL,
    aciklama TEXT,
    fiyat DECIMAL(10,2) NOT NULL,
    resim VARCHAR(255),
    stok INT DEFAULT 0,
    aktif BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (kategori_id) REFERENCES kategoriler(id)
);

-- ===== SEPET TABLOSU =====
CREATE TABLE IF NOT EXISTS sepet (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_id INT NOT NULL,
    urun_id INT,
    aksesuar_id INT,
    adet INT DEFAULT 1,
    eklenme_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kullanici_id) REFERENCES users(id),
    FOREIGN KEY (urun_id) REFERENCES urunler(id),
    FOREIGN KEY (aksesuar_id) REFERENCES aksesuarlar(id)
);

-- ===== SİPARİŞLER TABLOSU =====
CREATE TABLE IF NOT EXISTS siparisler (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kullanici_id INT NOT NULL,
    toplam_tutar DECIMAL(10,2) NOT NULL,
    durum ENUM('hazırlanıyor', 'kargoda', 'tamamlandı', 'iptal') DEFAULT 'hazırlanıyor',
    siparis_tarihi TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (kullanici_id) REFERENCES users(id)
);

-- ===== SİPARİŞ DETAY TABLOSU =====
CREATE TABLE IF NOT EXISTS siparis_detay (
    id INT AUTO_INCREMENT PRIMARY KEY,
    siparis_id INT NOT NULL,
    urun_id INT,
    aksesuar_id INT,
    adet INT DEFAULT 1,
    birim_fiyat DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (siparis_id) REFERENCES siparisler(id),
    FOREIGN KEY (urun_id) REFERENCES urunler(id),
    FOREIGN KEY (aksesuar_id) REFERENCES aksesuarlar(id)
);