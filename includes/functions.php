<?php
/**
 * Utility Functions
 * 
 * Common helper functions used throughout the application
 * 
 * @version 1.0
 * @author Creative Digital Agency
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit('Direct access not allowed.');
}

/**
 * Escape HTML output
 */
function esc_html($text) {
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

/**
 * Escape HTML attributes
 */
function esc_attr($text) {
    return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
}

/**
 * Escape URL
 */
function esc_url($url) {
    return filter_var($url, FILTER_SANITIZE_URL);
}

/**
 * Generate slug from text
 */
function generate_slug($text) {
    // Convert to lowercase
    $text = strtolower($text);
    
    // Replace spaces and special characters with hyphens
    $text = preg_replace('/[^a-z0-9\-]/', '-', $text);
    
    // Remove multiple consecutive hyphens
    $text = preg_replace('/-+/', '-', $text);
    
    // Remove hyphens from beginning and end
    $text = trim($text, '-');
    
    return $text;
}

/**
 * Format date for display
 */
function format_date($date, $format = 'F j, Y') {
    if (empty($date) || $date === '0000-00-00' || $date === '0000-00-00 00:00:00') {
        return '';
    }
    
    return date($format, strtotime($date));
}

/**
 * Format date with time
 */
function format_datetime($datetime, $format = 'F j, Y g:i A') {
    return format_date($datetime, $format);
}

/**
 * Time ago function
 */
function time_ago($datetime) {
    $time = time() - strtotime($datetime);
    
    if ($time < 60) {
        return 'just now';
    } elseif ($time < 3600) {
        $minutes = floor($time / 60);
        return $minutes . ' minute' . ($minutes > 1 ? 's' : '') . ' ago';
    } elseif ($time < 86400) {
        $hours = floor($time / 3600);
        return $hours . ' hour' . ($hours > 1 ? 's' : '') . ' ago';
    } elseif ($time < 2592000) {
        $days = floor($time / 86400);
        return $days . ' day' . ($days > 1 ? 's' : '') . ' ago';
    } elseif ($time < 31536000) {
        $months = floor($time / 2592000);
        return $months . ' month' . ($months > 1 ? 's' : '') . ' ago';
    } else {
        $years = floor($time / 31536000);
        return $years . ' year' . ($years > 1 ? 's' : '') . ' ago';
    }
}

/**
 * Truncate text
 */
function truncate_text($text, $length = 100, $suffix = '...') {
    if (strlen($text) <= $length) {
        return $text;
    }
    
    return substr($text, 0, $length) . $suffix;
}

/**
 * Format file size
 */
function format_file_size($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    
    for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
        $bytes /= 1024;
    }
    
    return round($bytes, $precision) . ' ' . $units[$i];
}

/**
 * Get client IP address
 */
function get_client_ip() {
    $ip_keys = ['HTTP_CLIENT_IP', 'HTTP_X_FORWARDED_FOR', 'REMOTE_ADDR'];
    
    foreach ($ip_keys as $key) {
        if (array_key_exists($key, $_SERVER) === true) {
            foreach (explode(',', $_SERVER[$key]) as $ip) {
                $ip = trim($ip);
                
                if (filter_var($ip, FILTER_VALIDATE_IP, 
                    FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE) !== false) {
                    return $ip;
                }
            }
        }
    }
    
    return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
}

/**
 * Generate random string
 */
function generate_random_string($length = 10, $characters = null) {
    if ($characters === null) {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    }
    
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, strlen($characters) - 1)];
    }
    
    return $randomString;
}

/**
 * Validate email address
 */
function is_valid_email($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate URL
 */
function is_valid_url($url) {
    return filter_var($url, FILTER_VALIDATE_URL) !== false;
}

/**
 * Get current page URL
 */
function get_current_url() {
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'] ?? 'localhost';
    $uri = $_SERVER['REQUEST_URI'] ?? '';
    
    return $protocol . '://' . $host . $uri;
}

/**
 * Redirect to URL
 */
function redirect($url, $status_code = 302) {
    header("Location: $url", true, $status_code);
    exit;
}

/**
 * Check if current page is HTTPS
 */
function is_https() {
    return isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on';
}

/**
 * Get page title
 */
function get_page_title($title = '', $separator = ' | ') {
    $site_name = get_setting('site_name', SITE_NAME);
    
    if (empty($title)) {
        return $site_name;
    }
    
    return $title . $separator . $site_name;
}

/**
 * Get meta description
 */
function get_meta_description($description = '') {
    if (empty($description)) {
        return get_setting('site_description', '');
    }
    
    return truncate_text($description, META_DESCRIPTION_LENGTH, '');
}

/**
 * Include template part
 */
function include_template($template, $variables = []) {
    if (!empty($variables)) {
        extract($variables);
    }
    
    $template_file = ABSPATH . 'templates/' . $template . '.php';
    
    if (file_exists($template_file)) {
        include $template_file;
    } else {
        echo "<!-- Template not found: $template -->";
    }
}

/**
 * Get template content
 */
function get_template($template, $variables = []) {
    ob_start();
    include_template($template, $variables);
    return ob_get_clean();
}

/**
 * Pagination function
 */
function paginate($total_items, $items_per_page, $current_page, $base_url = '') {
    $total_pages = ceil($total_items / $items_per_page);
    
    if ($total_pages <= 1) {
        return '';
    }
    
    $pagination = '<nav aria-label="Pagination"><ul class="pagination justify-content-center">';
    
    // Previous button
    if ($current_page > 1) {
        $prev_url = $base_url . '?page=' . ($current_page - 1);
        $pagination .= '<li class="page-item"><a class="page-link" href="' . $prev_url . '">Previous</a></li>';
    } else {
        $pagination .= '<li class="page-item disabled"><span class="page-link">Previous</span></li>';
    }
    
    // Page numbers
    $start = max(1, $current_page - 2);
    $end = min($total_pages, $current_page + 2);
    
    if ($start > 1) {
        $pagination .= '<li class="page-item"><a class="page-link" href="' . $base_url . '?page=1">1</a></li>';
        if ($start > 2) {
            $pagination .= '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    for ($i = $start; $i <= $end; $i++) {
        if ($i == $current_page) {
            $pagination .= '<li class="page-item active"><span class="page-link">' . $i . '</span></li>';
        } else {
            $page_url = $base_url . '?page=' . $i;
            $pagination .= '<li class="page-item"><a class="page-link" href="' . $page_url . '">' . $i . '</a></li>';
        }
    }
    
    if ($end < $total_pages) {
        if ($end < $total_pages - 1) {
            $pagination .= '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
        $last_url = $base_url . '?page=' . $total_pages;
        $pagination .= '<li class="page-item"><a class="page-link" href="' . $last_url . '">' . $total_pages . '</a></li>';
    }
    
    // Next button
    if ($current_page < $total_pages) {
        $next_url = $base_url . '?page=' . ($current_page + 1);
        $pagination .= '<li class="page-item"><a class="page-link" href="' . $next_url . '">Next</a></li>';
    } else {
        $pagination .= '<li class="page-item disabled"><span class="page-link">Next</span></li>';
    }
    
    $pagination .= '</ul></nav>';
    
    return $pagination;
}

/**
 * Log message
 */
function log_message($message, $level = 'INFO') {
    if (!LOG_ENABLED) {
        return;
    }
    
    $log_file = LOG_PATH . 'app.log';
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] [$level] $message" . PHP_EOL;
    
    file_put_contents($log_file, $log_entry, FILE_APPEND | LOCK_EX);
    
    // Rotate log if it gets too large
    if (file_exists($log_file) && filesize($log_file) > LOG_MAX_SIZE) {
        rotate_log_file($log_file);
    }
}

/**
 * Rotate log file
 */
function rotate_log_file($log_file) {
    $base_name = pathinfo($log_file, PATHINFO_FILENAME);
    $extension = pathinfo($log_file, PATHINFO_EXTENSION);
    $dir = dirname($log_file);
    
    // Move existing rotated logs
    for ($i = LOG_MAX_FILES - 1; $i >= 1; $i--) {
        $old_file = $dir . '/' . $base_name . '.' . $i . '.' . $extension;
        $new_file = $dir . '/' . $base_name . '.' . ($i + 1) . '.' . $extension;
        
        if (file_exists($old_file)) {
            if ($i + 1 > LOG_MAX_FILES) {
                unlink($old_file);
            } else {
                rename($old_file, $new_file);
            }
        }
    }
    
    // Move current log to .1
    $rotated_file = $dir . '/' . $base_name . '.1.' . $extension;
    rename($log_file, $rotated_file);
}

/**
 * Send JSON response
 */
function json_response($data, $status_code = 200) {
    http_response_code($status_code);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

/**
 * Get uploaded file info
 */
function get_upload_info($file) {
    if (!isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) {
        return false;
    }
    
    $info = [
        'name' => $file['name'],
        'type' => $file['type'],
        'size' => $file['size'],
        'tmp_name' => $file['tmp_name'],
        'extension' => strtolower(pathinfo($file['name'], PATHINFO_EXTENSION))
    ];
    
    return $info;
}

/**
 * Validate uploaded file
 */
function validate_upload($file, $allowed_types = null, $max_size = null) {
    $info = get_upload_info($file);
    
    if (!$info) {
        return ['error' => 'File upload failed'];
    }
    
    // Check file size
    $max_size = $max_size ?: UPLOAD_MAX_SIZE;
    if ($info['size'] > $max_size) {
        return ['error' => 'File size exceeds maximum allowed size'];
    }
    
    // Check file type
    $allowed_types = $allowed_types ?: array_merge(ALLOWED_IMAGE_TYPES, ALLOWED_FILE_TYPES);
    if (!in_array($info['extension'], $allowed_types)) {
        return ['error' => 'File type not allowed'];
    }
    
    return ['success' => true, 'info' => $info];
}

/**
 * Upload file
 */
function upload_file($file, $destination_dir = null, $new_name = null) {
    $validation = validate_upload($file);
    
    if (isset($validation['error'])) {
        return $validation;
    }
    
    $info = $validation['info'];
    $destination_dir = $destination_dir ?: UPLOAD_PATH;
    
    // Generate unique filename if not provided
    if (!$new_name) {
        $new_name = time() . '_' . generate_random_string(8) . '.' . $info['extension'];
    }
    
    $destination = $destination_dir . $new_name;
    
    // Create directory if it doesn't exist
    if (!is_dir($destination_dir)) {
        mkdir($destination_dir, 0755, true);
    }
    
    if (move_uploaded_file($info['tmp_name'], $destination)) {
        return [
            'success' => true,
            'filename' => $new_name,
            'path' => $destination,
            'url' => UPLOAD_URL . $new_name,
            'size' => $info['size']
        ];
    }
    
    return ['error' => 'Failed to move uploaded file'];
}

/**
 * Delete file
 */
function delete_file($file_path) {
    if (file_exists($file_path)) {
        return unlink($file_path);
    }
    
    return false;
}

/**
 * Get breadcrumbs
 */
function get_breadcrumbs($items = []) {
    $breadcrumbs = '<nav aria-label="breadcrumb"><ol class="breadcrumb">';
    $breadcrumbs .= '<li class="breadcrumb-item"><a href="' . SITE_URL . '">Home</a></li>';
    
    foreach ($items as $item) {
        if (isset($item['url'])) {
            $breadcrumbs .= '<li class="breadcrumb-item"><a href="' . $item['url'] . '">' . $item['title'] . '</a></li>';
        } else {
            $breadcrumbs .= '<li class="breadcrumb-item active" aria-current="page">' . $item['title'] . '</li>';
        }
    }
    
    $breadcrumbs .= '</ol></nav>';
    
    return $breadcrumbs;
}

/**
 * Generate CSRF token
 */
function csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    
    return $_SESSION['csrf_token'];
}

/**
 * CSRF token field
 */
function csrf_field() {
    return '<input type="hidden" name="csrf_token" value="' . csrf_token() . '">';
}

/**
 * Verify CSRF token
 */
function verify_csrf_token($token = null) {
    $token = $token ?: ($_POST['csrf_token'] ?? '');
    
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        return false;
    }
    
    // Check if token has expired
    if (isset($_SESSION['csrf_token_time']) && 
        (time() - $_SESSION['csrf_token_time']) > CSRF_TOKEN_LIFETIME) {
        unset($_SESSION['csrf_token'], $_SESSION['csrf_token_time']);
        return false;
    }
    
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Clean old cache files
 */
function clean_cache($max_age = 3600) {
    if (!is_dir(CACHE_PATH)) {
        return;
    }
    
    $files = glob(CACHE_PATH . '*');
    $now = time();
    
    foreach ($files as $file) {
        if (is_file($file) && ($now - filemtime($file)) > $max_age) {
            unlink($file);
        }
    }
}

/**
 * Get cache file path
 */
function get_cache_path($key) {
    return CACHE_PATH . md5($key) . '.cache';
}

/**
 * Set cache
 */
function set_cache($key, $data, $expiration = null) {
    if (!CACHE_ENABLED) {
        return false;
    }
    
    $expiration = $expiration ?: CACHE_LIFETIME;
    $cache_data = [
        'data' => $data,
        'expires' => time() + $expiration
    ];
    
    $cache_file = get_cache_path($key);
    return file_put_contents($cache_file, serialize($cache_data), LOCK_EX) !== false;
}

/**
 * Get cache
 */
function get_cache($key) {
    if (!CACHE_ENABLED) {
        return false;
    }
    
    $cache_file = get_cache_path($key);
    
    if (!file_exists($cache_file)) {
        return false;
    }
    
    $cache_data = unserialize(file_get_contents($cache_file));
    
    if (!$cache_data || !isset($cache_data['expires']) || $cache_data['expires'] < time()) {
        unlink($cache_file);
        return false;
    }
    
    return $cache_data['data'];
}

/**
 * Delete cache
 */
function delete_cache($key) {
    $cache_file = get_cache_path($key);
    
    if (file_exists($cache_file)) {
        return unlink($cache_file);
    }
    
    return false;
}

/**
 * Clear all cache
 */
function clear_all_cache() {
    $files = glob(CACHE_PATH . '*.cache');
    
    foreach ($files as $file) {
        if (is_file($file)) {
            unlink($file);
        }
    }
    
    return true;
}
?>