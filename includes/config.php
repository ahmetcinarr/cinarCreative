<?php
/**
 * Creative Digital Agency - Configuration File
 * 
 * This file contains all the configuration settings for the website
 * including database credentials, security settings, and application constants.
 * 
 * @version 1.0
 * @author Creative Digital Agency
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__DIR__) . '/');
}

// ===== ERROR REPORTING =====
// Set to false in production
define('DEBUG_MODE', true);

if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    ini_set('log_errors', 1);
    ini_set('error_log', ABSPATH . 'logs/php_errors.log');
} else {
    error_reporting(0);
    ini_set('display_errors', 0);
    ini_set('log_errors', 1);
    ini_set('error_log', ABSPATH . 'logs/php_errors.log');
}

// ===== DATABASE CONFIGURATION =====
define('DB_HOST', 'localhost');
define('DB_NAME', 'creative_digital_agency');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');
define('DB_COLLATE', 'utf8mb4_unicode_ci');

// Database table prefix
define('DB_PREFIX', '');

// ===== SECURITY CONFIGURATION =====
// Change these to unique values for your installation
define('AUTH_KEY', 'put your unique phrase here');
define('SECURE_AUTH_KEY', 'put your unique phrase here');
define('LOGGED_IN_KEY', 'put your unique phrase here');
define('NONCE_KEY', 'put your unique phrase here');
define('AUTH_SALT', 'put your unique phrase here');
define('SECURE_AUTH_SALT', 'put your unique phrase here');
define('LOGGED_IN_SALT', 'put your unique phrase here');
define('NONCE_SALT', 'put your unique phrase here');

// Session configuration
define('SESSION_LIFETIME', 7200); // 2 hours in seconds
define('SESSION_NAME', 'CDA_SESSION');
define('SESSION_SECURE', false); // Set to true if using HTTPS
define('SESSION_HTTPONLY', true);
define('SESSION_SAMESITE', 'Strict');

// Password hashing
define('PASSWORD_COST', 12); // bcrypt cost parameter

// CSRF protection
define('CSRF_TOKEN_NAME', 'csrf_token');
define('CSRF_TOKEN_LIFETIME', 3600); // 1 hour

// ===== APPLICATION SETTINGS =====
define('SITE_NAME', 'Creative Digital Agency');
define('SITE_URL', 'http://localhost');
define('ADMIN_URL', SITE_URL . '/admin');
define('ASSETS_URL', SITE_URL . '/assets');

// Email configuration
define('SMTP_HOST', 'localhost');
define('SMTP_PORT', 587);
define('SMTP_SECURE', 'tls'); // tls or ssl
define('SMTP_USERNAME', '');
define('SMTP_PASSWORD', '');
define('FROM_EMAIL', 'noreply@creativedigital.com');
define('FROM_NAME', 'Creative Digital Agency');
define('ADMIN_EMAIL', 'admin@creativedigital.com');

// File upload settings
define('UPLOAD_MAX_SIZE', 10 * 1024 * 1024); // 10MB in bytes
define('ALLOWED_IMAGE_TYPES', ['jpg', 'jpeg', 'png', 'gif', 'webp']);
define('ALLOWED_FILE_TYPES', ['pdf', 'doc', 'docx', 'txt']);
define('UPLOAD_PATH', ABSPATH . 'uploads/');
define('UPLOAD_URL', SITE_URL . '/uploads/');

// Image processing
define('IMAGE_QUALITY', 85);
define('THUMBNAIL_WIDTH', 300);
define('THUMBNAIL_HEIGHT', 300);
define('MEDIUM_WIDTH', 600);
define('MEDIUM_HEIGHT', 400);
define('LARGE_WIDTH', 1200);
define('LARGE_HEIGHT', 800);

// ===== API KEYS =====
define('GOOGLE_MAPS_API_KEY', '');
define('GOOGLE_ANALYTICS_ID', '');
define('GOOGLE_RECAPTCHA_SITE_KEY', '');
define('GOOGLE_RECAPTCHA_SECRET_KEY', '');

// Social media
define('FACEBOOK_APP_ID', '');
define('TWITTER_API_KEY', '');
define('INSTAGRAM_ACCESS_TOKEN', '');

// ===== CACHING SETTINGS =====
define('CACHE_ENABLED', true);
define('CACHE_LIFETIME', 3600); // 1 hour
define('CACHE_PATH', ABSPATH . 'cache/');

// ===== RATE LIMITING =====
define('RATE_LIMIT_ENABLED', true);
define('RATE_LIMIT_REQUESTS', 60); // requests per window
define('RATE_LIMIT_WINDOW', 3600); // window in seconds (1 hour)
define('CONTACT_FORM_LIMIT', 5); // contact form submissions per hour

// ===== LOGGING =====
define('LOG_ENABLED', true);
define('LOG_LEVEL', 'INFO'); // DEBUG, INFO, WARNING, ERROR
define('LOG_PATH', ABSPATH . 'logs/');
define('LOG_MAX_SIZE', 10 * 1024 * 1024); // 10MB
define('LOG_MAX_FILES', 5);

// ===== MAINTENANCE MODE =====
define('MAINTENANCE_MODE', false);
define('MAINTENANCE_MESSAGE', 'We are currently performing scheduled maintenance. Please check back soon.');
define('MAINTENANCE_ALLOWED_IPS', ['127.0.0.1', '::1']); // IPs that can access during maintenance

// ===== TIMEZONE =====
define('DEFAULT_TIMEZONE', 'America/New_York');
date_default_timezone_set(DEFAULT_TIMEZONE);

// ===== PAGINATION =====
define('POSTS_PER_PAGE', 12);
define('PORTFOLIO_PER_PAGE', 9);
define('TEAM_PER_PAGE', 12);
define('ADMIN_POSTS_PER_PAGE', 20);

// ===== SEO SETTINGS =====
define('META_TITLE_SEPARATOR', ' | ');
define('META_DESCRIPTION_LENGTH', 160);
define('META_TITLE_LENGTH', 60);

// ===== CONTACT FORM SETTINGS =====
define('CONTACT_FORM_HONEYPOT', true);
define('CONTACT_FORM_CAPTCHA', false);
define('CONTACT_FORM_NOTIFICATION', true);
define('CONTACT_FORM_AUTO_REPLY', true);

// ===== ADMIN SETTINGS =====
define('ADMIN_SESSION_TIMEOUT', 1800); // 30 minutes
define('ADMIN_MAX_LOGIN_ATTEMPTS', 5);
define('ADMIN_LOCKOUT_TIME', 900); // 15 minutes
define('ADMIN_REQUIRE_2FA', false);

// ===== BACKUP SETTINGS =====
define('BACKUP_ENABLED', true);
define('BACKUP_PATH', ABSPATH . 'backups/');
define('BACKUP_RETENTION_DAYS', 30);
define('BACKUP_SCHEDULE', 'daily'); // daily, weekly, monthly

// ===== PERFORMANCE SETTINGS =====
define('ENABLE_GZIP', true);
define('ENABLE_BROWSER_CACHE', true);
define('MINIFY_HTML', false);
define('MINIFY_CSS', false);
define('MINIFY_JS', false);

// ===== DEVELOPMENT SETTINGS =====
if (DEBUG_MODE) {
    // Development-specific settings
    define('CACHE_ENABLED', false);
    define('MINIFY_HTML', false);
    define('MINIFY_CSS', false);
    define('MINIFY_JS', false);
}

// ===== AUTOLOAD CLASSES =====
spl_autoload_register(function ($class) {
    $class = str_replace('\\', '/', $class);
    $file = ABSPATH . 'includes/classes/' . $class . '.php';
    
    if (file_exists($file)) {
        require_once $file;
    }
});

// ===== GLOBAL FUNCTIONS =====
require_once ABSPATH . 'includes/functions.php';
require_once ABSPATH . 'includes/security.php';
require_once ABSPATH . 'includes/database.php';

// ===== INITIALIZE SESSION =====
if (session_status() === PHP_SESSION_NONE) {
    // Configure session settings
    ini_set('session.cookie_lifetime', SESSION_LIFETIME);
    ini_set('session.cookie_httponly', SESSION_HTTPONLY);
    ini_set('session.cookie_secure', SESSION_SECURE);
    ini_set('session.cookie_samesite', SESSION_SAMESITE);
    ini_set('session.use_strict_mode', 1);
    ini_set('session.name', SESSION_NAME);
    
    session_start();
    
    // Regenerate session ID periodically
    if (!isset($_SESSION['created'])) {
        $_SESSION['created'] = time();
    } else if (time() - $_SESSION['created'] > 1800) { // 30 minutes
        session_regenerate_id(true);
        $_SESSION['created'] = time();
    }
}

// ===== MAINTENANCE MODE CHECK =====
if (MAINTENANCE_MODE && !in_array($_SERVER['REMOTE_ADDR'] ?? '', MAINTENANCE_ALLOWED_IPS) && !defined('ADMIN_AREA')) {
    http_response_code(503);
    header('Retry-After: 3600');
    echo MAINTENANCE_MESSAGE;
    exit;
}

// ===== SECURITY HEADERS =====
if (!defined('ADMIN_AREA')) {
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('X-XSS-Protection: 1; mode=block');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    
    if (SESSION_SECURE) {
        header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
    }
}

// ===== ERROR HANDLER =====
function customErrorHandler($errno, $errstr, $errfile, $errline) {
    if (!(error_reporting() & $errno)) {
        return false;
    }
    
    $error_message = "Error: [$errno] $errstr in $errfile on line $errline";
    
    if (LOG_ENABLED) {
        error_log($error_message);
    }
    
    if (DEBUG_MODE) {
        echo "<div style='background: #f8d7da; color: #721c24; padding: 10px; margin: 10px; border: 1px solid #f5c6cb; border-radius: 4px;'>";
        echo "<strong>Error:</strong> $errstr<br>";
        echo "<strong>File:</strong> $errfile<br>";
        echo "<strong>Line:</strong> $errline";
        echo "</div>";
    }
    
    return true;
}

set_error_handler('customErrorHandler');

// ===== EXCEPTION HANDLER =====
function customExceptionHandler($exception) {
    $error_message = "Uncaught exception: " . $exception->getMessage() . " in " . $exception->getFile() . " on line " . $exception->getLine();
    
    if (LOG_ENABLED) {
        error_log($error_message);
    }
    
    if (DEBUG_MODE) {
        echo "<div style='background: #f8d7da; color: #721c24; padding: 10px; margin: 10px; border: 1px solid #f5c6cb; border-radius: 4px;'>";
        echo "<strong>Exception:</strong> " . $exception->getMessage() . "<br>";
        echo "<strong>File:</strong> " . $exception->getFile() . "<br>";
        echo "<strong>Line:</strong> " . $exception->getLine();
        echo "</div>";
    } else {
        echo "An error occurred. Please try again later.";
    }
}

set_exception_handler('customExceptionHandler');

// ===== CONSTANTS FOR ADMIN AREA =====
if (defined('ADMIN_AREA')) {
    define('ADMIN_TEMPLATE_PATH', ABSPATH . 'admin/templates/');
    define('ADMIN_ASSETS_URL', SITE_URL . '/admin/assets/');
}

// ===== ENVIRONMENT DETECTION =====
function is_development() {
    return DEBUG_MODE || in_array($_SERVER['HTTP_HOST'] ?? '', ['localhost', '127.0.0.1', 'dev.creativedigital.com']);
}

function is_production() {
    return !is_development();
}

// ===== MEMORY AND TIME LIMITS =====
if (is_development()) {
    ini_set('memory_limit', '256M');
    ini_set('max_execution_time', 300);
} else {
    ini_set('memory_limit', '128M');
    ini_set('max_execution_time', 30);
}

// ===== FINAL CHECKS =====
// Create necessary directories
$required_dirs = [
    UPLOAD_PATH,
    CACHE_PATH,
    LOG_PATH,
    BACKUP_PATH
];

foreach ($required_dirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
        
        // Create .htaccess for security
        if (in_array($dir, [LOG_PATH, BACKUP_PATH])) {
            file_put_contents($dir . '.htaccess', "Deny from all\n");
        }
    }
}

// Create logs directory index.php for security
if (!file_exists(LOG_PATH . 'index.php')) {
    file_put_contents(LOG_PATH . 'index.php', "<?php\n// Silence is golden\n");
}

// ===== LOAD ADDITIONAL CONFIGURATION =====
// Load local configuration overrides (if exists)
if (file_exists(ABSPATH . 'includes/config-local.php')) {
    require_once ABSPATH . 'includes/config-local.php';
}
?>