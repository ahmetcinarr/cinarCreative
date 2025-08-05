<?php
/**
 * Contact Form Handler
 * 
 * Handles contact form submissions with validation, security checks, and email notifications
 * 
 * @version 1.0
 * @author Creative Digital Agency
 */

// Define ABSPATH if not already defined
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__DIR__) . '/');
}

require_once ABSPATH . 'includes/config.php';

// Set JSON response header
header('Content-Type: application/json');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit;
}

try {
    // Rate limiting check
    if (RATE_LIMIT_ENABLED) {
        $ip = $_SERVER['REMOTE_ADDR'] ?? '';
        $rate_limit_key = "contact_form_" . md5($ip);
        
        if (check_rate_limit($rate_limit_key, CONTACT_FORM_LIMIT, 3600)) {
            http_response_code(429);
            echo json_encode([
                'success' => false, 
                'message' => 'Too many submissions. Please try again later.'
            ]);
            exit;
        }
    }
    
    // CSRF token validation
    if (!validate_csrf_token($_POST['csrf_token'] ?? '')) {
        http_response_code(403);
        echo json_encode(['success' => false, 'message' => 'Security token validation failed']);
        exit;
    }
    
    // Honeypot check (spam protection)
    if (CONTACT_FORM_HONEYPOT && !empty($_POST['website'])) {
        // This is likely spam, silently fail
        echo json_encode(['success' => true, 'message' => 'Message sent successfully']);
        exit;
    }
    
    // Validate and sanitize input data
    $errors = [];
    $data = [];
    
    // Required fields
    $required_fields = ['firstName', 'lastName', 'email', 'message'];
    
    foreach ($required_fields as $field) {
        if (empty($_POST[$field])) {
            $errors[$field] = ucfirst($field) . ' is required';
        } else {
            $data[$field] = sanitize_input($_POST[$field]);
        }
    }
    
    // Optional fields
    $optional_fields = ['phone', 'company', 'budget', 'newsletter'];
    
    foreach ($optional_fields as $field) {
        if (isset($_POST[$field])) {
            $data[$field] = sanitize_input($_POST[$field]);
        }
    }
    
    // Handle services array
    if (isset($_POST['services']) && is_array($_POST['services'])) {
        $data['services_interested'] = array_map('sanitize_input', $_POST['services']);
    }
    
    // Email validation
    if (!empty($data['email']) && !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Please enter a valid email address';
    }
    
    // Phone validation (if provided)
    if (!empty($data['phone'])) {
        $phone = preg_replace('/[^\d+\-\(\)\s]/', '', $data['phone']);
        if (strlen($phone) < 10) {
            $errors['phone'] = 'Please enter a valid phone number';
        }
        $data['phone'] = $phone;
    }
    
    // Message length validation
    if (!empty($data['message'])) {
        if (strlen($data['message']) < 10) {
            $errors['message'] = 'Message must be at least 10 characters long';
        } elseif (strlen($data['message']) > 5000) {
            $errors['message'] = 'Message is too long (maximum 5000 characters)';
        }
    }
    
    // Privacy policy agreement check
    if (empty($_POST['privacy'])) {
        $errors['privacy'] = 'You must agree to the privacy policy';
    }
    
    // If there are validation errors, return them
    if (!empty($errors)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'errors' => $errors]);
        exit;
    }
    
    // Prepare data for database
    $contact_data = [
        'first_name' => $data['firstName'],
        'last_name' => $data['lastName'],
        'email' => $data['email'],
        'phone' => $data['phone'] ?? null,
        'company' => $data['company'] ?? null,
        'budget_range' => $data['budget'] ?? null,
        'message' => $data['message'],
        'newsletter_subscribe' => isset($data['newsletter']) ? 1 : 0,
        'services_interested' => isset($data['services_interested']) ? $data['services_interested'] : null
    ];
    
    // Save to database
    $message_id = save_contact_message($contact_data);
    
    if (!$message_id) {
        throw new Exception('Failed to save contact message');
    }
    
    // Send email notifications
    $email_sent = false;
    
    try {
        // Send notification to admin
        if (CONTACT_FORM_NOTIFICATION) {
            $admin_subject = "New Contact Form Submission - " . SITE_NAME;
            $admin_message = build_admin_notification_email($contact_data, $message_id);
            
            $email_sent = send_email(
                ADMIN_EMAIL,
                $admin_subject,
                $admin_message,
                [
                    'reply_to' => $data['email'],
                    'reply_to_name' => $data['firstName'] . ' ' . $data['lastName']
                ]
            );
        }
        
        // Send auto-reply to user
        if (CONTACT_FORM_AUTO_REPLY) {
            $user_subject = "Thank you for contacting " . SITE_NAME;
            $user_message = build_auto_reply_email($contact_data);
            
            send_email(
                $data['email'],
                $user_subject,
                $user_message,
                [
                    'from_name' => SITE_NAME
                ]
            );
        }
        
    } catch (Exception $e) {
        // Log email error but don't fail the form submission
        error_log("Contact form email error: " . $e->getMessage());
    }
    
    // Update rate limit
    if (RATE_LIMIT_ENABLED) {
        update_rate_limit($rate_limit_key);
    }
    
    // Success response
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for your message! We\'ll get back to you soon.',
        'message_id' => $message_id
    ]);
    
} catch (Exception $e) {
    error_log("Contact form error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'An error occurred while sending your message. Please try again.'
    ]);
}

/**
 * Sanitize input data
 */
function sanitize_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

/**
 * Validate CSRF token
 */
function validate_csrf_token($token) {
    if (empty($token) || empty($_SESSION['csrf_token'])) {
        return false;
    }
    
    return hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Generate CSRF token
 */
function generate_csrf_token() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
        $_SESSION['csrf_token_time'] = time();
    }
    
    return $_SESSION['csrf_token'];
}

/**
 * Check rate limit
 */
function check_rate_limit($key, $limit, $window) {
    $cache_file = CACHE_PATH . 'rate_limit_' . $key . '.json';
    
    if (!file_exists($cache_file)) {
        return false;
    }
    
    $data = json_decode(file_get_contents($cache_file), true);
    
    if (!$data || !isset($data['count']) || !isset($data['timestamp'])) {
        return false;
    }
    
    // Check if window has expired
    if (time() - $data['timestamp'] > $window) {
        unlink($cache_file);
        return false;
    }
    
    return $data['count'] >= $limit;
}

/**
 * Update rate limit
 */
function update_rate_limit($key) {
    $cache_file = CACHE_PATH . 'rate_limit_' . $key . '.json';
    
    $data = ['count' => 1, 'timestamp' => time()];
    
    if (file_exists($cache_file)) {
        $existing_data = json_decode(file_get_contents($cache_file), true);
        if ($existing_data && isset($existing_data['count'])) {
            $data['count'] = $existing_data['count'] + 1;
        }
    }
    
    file_put_contents($cache_file, json_encode($data), LOCK_EX);
}

/**
 * Build admin notification email
 */
function build_admin_notification_email($data, $message_id) {
    $services = '';
    if (!empty($data['services_interested'])) {
        $services_list = is_array($data['services_interested']) 
            ? $data['services_interested'] 
            : json_decode($data['services_interested'], true);
        
        if ($services_list) {
            $services = "\nServices Interested In:\n" . implode(', ', $services_list);
        }
    }
    
    $message = "New contact form submission received:\n\n";
    $message .= "Message ID: #" . $message_id . "\n";
    $message .= "Name: " . $data['first_name'] . " " . $data['last_name'] . "\n";
    $message .= "Email: " . $data['email'] . "\n";
    
    if (!empty($data['phone'])) {
        $message .= "Phone: " . $data['phone'] . "\n";
    }
    
    if (!empty($data['company'])) {
        $message .= "Company: " . $data['company'] . "\n";
    }
    
    if (!empty($data['budget_range'])) {
        $message .= "Budget Range: " . $data['budget_range'] . "\n";
    }
    
    $message .= $services;
    $message .= "\nMessage:\n" . $data['message'] . "\n\n";
    
    if ($data['newsletter_subscribe']) {
        $message .= "Subscribed to newsletter: Yes\n";
    }
    
    $message .= "\nSubmitted: " . date('Y-m-d H:i:s') . "\n";
    $message .= "IP Address: " . ($_SERVER['REMOTE_ADDR'] ?? 'Unknown') . "\n";
    $message .= "User Agent: " . ($_SERVER['HTTP_USER_AGENT'] ?? 'Unknown') . "\n";
    
    if (!empty($_SERVER['HTTP_REFERER'])) {
        $message .= "Referrer: " . $_SERVER['HTTP_REFERER'] . "\n";
    }
    
    $message .= "\n---\n";
    $message .= "View in admin panel: " . ADMIN_URL . "/messages.php?id=" . $message_id . "\n";
    
    return $message;
}

/**
 * Build auto-reply email
 */
function build_auto_reply_email($data) {
    $message = "Dear " . $data['first_name'] . ",\n\n";
    $message .= "Thank you for contacting " . SITE_NAME . "! We've received your message and will get back to you within 24 hours.\n\n";
    $message .= "Here's a copy of your message:\n\n";
    $message .= "---\n";
    $message .= $data['message'] . "\n";
    $message .= "---\n\n";
    $message .= "If you have any urgent questions, please don't hesitate to call us at " . get_setting('contact_phone', '+1 (234) 567-8900') . ".\n\n";
    $message .= "Best regards,\n";
    $message .= "The " . SITE_NAME . " Team\n\n";
    $message .= "---\n";
    $message .= SITE_NAME . "\n";
    $message .= get_setting('contact_address', '123 Creative Street, Design City, DC 12345') . "\n";
    $message .= "Phone: " . get_setting('contact_phone', '+1 (234) 567-8900') . "\n";
    $message .= "Email: " . get_setting('contact_email', 'hello@creativedigital.com') . "\n";
    $message .= "Website: " . SITE_URL . "\n";
    
    return $message;
}

/**
 * Send email (basic implementation - can be enhanced with PHPMailer)
 */
function send_email($to, $subject, $message, $options = []) {
    $headers = [];
    
    // Set From header
    $from_email = $options['from_email'] ?? FROM_EMAIL;
    $from_name = $options['from_name'] ?? FROM_NAME;
    $headers[] = "From: {$from_name} <{$from_email}>";
    
    // Set Reply-To if provided
    if (!empty($options['reply_to'])) {
        $reply_name = $options['reply_to_name'] ?? '';
        if ($reply_name) {
            $headers[] = "Reply-To: {$reply_name} <{$options['reply_to']}>";
        } else {
            $headers[] = "Reply-To: {$options['reply_to']}";
        }
    }
    
    // Additional headers
    $headers[] = "Content-Type: text/plain; charset=UTF-8";
    $headers[] = "X-Mailer: " . SITE_NAME;
    
    return mail($to, $subject, $message, implode("\r\n", $headers));
}

// Generate CSRF token for next request
if (session_status() === PHP_SESSION_ACTIVE) {
    generate_csrf_token();
}
?>