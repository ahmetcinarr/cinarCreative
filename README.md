# Creative Digital Agency Website

A modern, mobile-friendly, and SEO-optimized website for a digital advertising agency built with the latest web technologies and following 2025 design trends.

## 🚀 Features

### Frontend Features
- **Modern Design**: Clean, minimalist design with soft gradients and micro-interactions
- **Responsive Layout**: Mobile-first design using Bootstrap 5 grid system
- **Dark/Light Theme**: Toggle between dark and light themes with smooth transitions
- **Smooth Animations**: Scroll-triggered animations and hover effects
- **SEO Optimized**: Proper meta tags, structured data, and semantic HTML
- **Fast Loading**: Optimized images, minified assets, and efficient code
- **Accessibility**: WCAG compliant with proper ARIA labels and keyboard navigation

### Pages Included
1. **Home Page**
   - Eye-catching hero section with agency motto
   - Services overview with interactive cards
   - Portfolio highlights with filter functionality
   - Client testimonials and logos
   - Call-to-action sections

2. **Portfolio (Our Work)**
   - Category filtering (Web Design, Branding, Social Media, etc.)
   - Project detail modals with case studies
   - Lazy loading for better performance
   - Search functionality

3. **About Us**
   - Agency story and timeline
   - Team member cards with social links
   - Mission, vision, and values
   - Awards and recognition

4. **Contact**
   - Interactive contact form with validation
   - Google Maps integration
   - Business information and hours
   - FAQ section

### Backend Features
- **PHP 8+ Compatible**: Modern PHP with PDO database connections
- **MySQL Database**: Structured database with proper relationships
- **Security**: SQL injection protection, CSRF tokens, input validation
- **Admin Panel**: Secure content management system
- **Contact Form**: Email notifications and database storage
- **Rate Limiting**: Protection against spam and abuse
- **Logging**: Comprehensive error and activity logging
- **Caching**: File-based caching for better performance

### Admin Panel Features
- **Secure Login**: Multi-attempt protection with account lockout
- **Content Management**: Edit homepage content, services, and team members
- **Portfolio Management**: Add, edit, and delete portfolio projects
- **Contact Messages**: View and manage contact form submissions
- **Settings**: Configure site settings and preferences
- **Analytics**: Basic visitor tracking and statistics

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and modern web standards
- **CSS3**: Custom properties, flexbox, grid, and animations
- **Bootstrap 5**: Responsive grid system and components
- **JavaScript**: ES6+ with modern features and APIs
- **PHP 8+**: Server-side logic and database operations
- **MySQL**: Relational database with proper indexing
- **Google Fonts**: Inter and Space Grotesk typography
- **Bootstrap Icons**: Comprehensive icon library

## 📋 Requirements

- PHP 8.0 or higher
- MySQL 5.7 or higher (or MariaDB 10.2+)
- Web server (Apache/Nginx)
- mod_rewrite enabled (for clean URLs)
- GD extension (for image processing)
- PDO MySQL extension
- OpenSSL extension
- JSON extension

## 🚀 Installation

### 1. Download and Extract
```bash
# Clone or download the project files
git clone https://github.com/your-repo/creative-digital-agency.git
cd creative-digital-agency
```

### 2. Database Setup
```sql
-- Create database
CREATE DATABASE creative_digital_agency CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Import the schema
mysql -u username -p creative_digital_agency < database/schema.sql
```

### 3. Configuration
```php
// Edit includes/config.php
define('DB_HOST', 'localhost');
define('DB_NAME', 'creative_digital_agency');
define('DB_USER', 'your_username');
define('DB_PASS', 'your_password');

// Update site URL
define('SITE_URL', 'https://yourdomain.com');

// Configure email settings
define('SMTP_HOST', 'your_smtp_host');
define('SMTP_USERNAME', 'your_email@domain.com');
define('SMTP_PASSWORD', 'your_password');
```

### 4. File Permissions
```bash
# Set proper permissions
chmod 755 uploads/
chmod 755 cache/
chmod 755 logs/
chmod 755 backups/
chmod 644 includes/config.php
```

### 5. Admin Account
The default admin credentials are:
- **Username**: admin
- **Password**: admin123

**⚠️ Important**: Change the default password immediately after installation!

### 6. Web Server Configuration

#### Apache (.htaccess)
```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^([^/]+)/?$ $1.php [L,QSA]

# Security headers
Header always set X-Content-Type-Options nosniff
Header always set X-Frame-Options DENY
Header always set X-XSS-Protection "1; mode=block"
```

#### Nginx
```nginx
location / {
    try_files $uri $uri.php $uri/ =404;
}

location ~ \.php$ {
    fastcgi_pass unix:/var/run/php/php8.0-fpm.sock;
    fastcgi_index index.php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}

# Security headers
add_header X-Content-Type-Options nosniff;
add_header X-Frame-Options DENY;
add_header X-XSS-Protection "1; mode=block";
```

## 🎨 Customization

### Colors and Branding
Edit `assets/css/style.css` to customize:
```css
:root {
    --primary-color: #3b82f6;
    --secondary-color: #64748b;
    --accent-color: #f59e0b;
    /* Add your brand colors */
}
```

### Content Management
1. Access admin panel: `yourdomain.com/admin`
2. Login with admin credentials
3. Navigate to different sections to edit content
4. Upload images and manage portfolio projects

### Email Templates
Edit email templates in `includes/contact.php`:
- Admin notification emails
- Auto-reply messages
- Customize sender information

## 📱 Mobile Optimization

The website is fully responsive and optimized for:
- Mobile phones (320px and up)
- Tablets (768px and up)
- Desktop computers (1024px and up)
- Large screens (1440px and up)

### Performance Features
- Lazy loading for images
- Minified CSS and JavaScript
- Optimized database queries
- Browser caching headers
- GZIP compression support

## 🔒 Security Features

- **SQL Injection Protection**: All queries use prepared statements
- **CSRF Protection**: Tokens for all forms
- **Input Validation**: Server-side and client-side validation
- **Rate Limiting**: Protection against brute force attacks
- **Session Security**: Secure session configuration
- **File Upload Security**: Type and size validation
- **Error Handling**: Secure error messages in production

## 📊 SEO Features

- **Meta Tags**: Proper title, description, and keywords
- **Open Graph**: Social media sharing optimization
- **Schema Markup**: Structured data for search engines
- **Sitemap**: XML sitemap generation
- **Clean URLs**: SEO-friendly URL structure
- **Page Speed**: Optimized for fast loading
- **Mobile-First**: Google's mobile-first indexing ready

## 🎯 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Changelog

### Version 1.0.0 (2025-01-XX)
- Initial release
- Complete website with all pages
- Admin panel functionality
- Contact form with email notifications
- Portfolio management system
- Responsive design implementation
- Security features implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Email: support@creativedigital.com
- Documentation: Check the `/docs` folder
- Issues: Create an issue on GitHub

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**
   - Check database credentials in `config.php`
   - Ensure MySQL service is running
   - Verify database exists and user has permissions

2. **File Upload Issues**
   - Check folder permissions (755 for directories)
   - Verify PHP upload settings in `php.ini`
   - Ensure upload directory exists

3. **Email Not Sending**
   - Check SMTP configuration
   - Verify email credentials
   - Check server firewall settings

4. **Admin Panel Access Issues**
   - Clear browser cache and cookies
   - Check if admin user exists in database
   - Verify session configuration

### Debug Mode
Enable debug mode in `config.php`:
```php
define('DEBUG_MODE', true);
```

This will show detailed error messages and enable logging.

## 📈 Performance Tips

1. **Enable Caching**
   ```php
   define('CACHE_ENABLED', true);
   ```

2. **Optimize Images**
   - Use WebP format when possible
   - Compress images before upload
   - Enable lazy loading

3. **Database Optimization**
   - Regular database maintenance
   - Monitor slow queries
   - Use appropriate indexes

4. **Server Configuration**
   - Enable GZIP compression
   - Set proper cache headers
   - Use a CDN for static assets

---

**Built with ❤️ by Creative Digital Agency**
