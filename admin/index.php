<?php
/**
 * Admin Panel - Login Page
 * 
 * Secure login system for admin panel access
 * 
 * @version 1.0
 * @author Creative Digital Agency
 */

define('ADMIN_AREA', true);
define('ABSPATH', dirname(__DIR__) . '/');

require_once ABSPATH . 'includes/config.php';

// Redirect if already logged in
if (isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true) {
    redirect(ADMIN_URL . '/dashboard.php');
}

$error_message = '';
$login_attempts = $_SESSION['login_attempts'] ?? 0;
$lockout_time = $_SESSION['lockout_time'] ?? 0;

// Check if account is locked
if ($lockout_time > time()) {
    $remaining_time = ceil(($lockout_time - time()) / 60);
    $error_message = "Account locked due to too many failed attempts. Try again in {$remaining_time} minutes.";
}

// Handle login form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST' && empty($error_message)) {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';
    
    // Validate CSRF token
    if (!verify_csrf_token()) {
        $error_message = 'Security token validation failed. Please try again.';
    } else {
        // Check credentials
        $user = db_fetch_row(
            "SELECT * FROM users WHERE username = ? AND is_active = 1",
            [$username]
        );
        
        if ($user && password_verify($password, $user['password_hash'])) {
            // Successful login
            $_SESSION['admin_logged_in'] = true;
            $_SESSION['admin_user_id'] = $user['id'];
            $_SESSION['admin_username'] = $user['username'];
            $_SESSION['admin_role'] = $user['role'];
            $_SESSION['admin_name'] = $user['first_name'] . ' ' . $user['last_name'];
            
            // Update last login
            db_update('users', 
                ['last_login' => date('Y-m-d H:i:s')], 
                'id = ?', 
                [$user['id']]
            );
            
            // Clear login attempts
            unset($_SESSION['login_attempts'], $_SESSION['lockout_time']);
            
            // Log successful login
            log_message("Admin login successful: {$username} from " . get_client_ip());
            
            redirect(ADMIN_URL . '/dashboard.php');
        } else {
            // Failed login
            $login_attempts++;
            $_SESSION['login_attempts'] = $login_attempts;
            
            if ($login_attempts >= ADMIN_MAX_LOGIN_ATTEMPTS) {
                $_SESSION['lockout_time'] = time() + ADMIN_LOCKOUT_TIME;
                $error_message = 'Too many failed login attempts. Account locked for ' . (ADMIN_LOCKOUT_TIME / 60) . ' minutes.';
                
                log_message("Admin account locked: {$username} from " . get_client_ip(), 'WARNING');
            } else {
                $remaining_attempts = ADMIN_MAX_LOGIN_ATTEMPTS - $login_attempts;
                $error_message = "Invalid username or password. {$remaining_attempts} attempts remaining.";
                
                log_message("Admin login failed: {$username} from " . get_client_ip(), 'WARNING');
            }
        }
    }
}

$page_title = 'Admin Login';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo $page_title . ' - ' . SITE_NAME; ?></title>
    
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css">
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .login-container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            max-width: 400px;
            width: 100%;
        }
        
        .login-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .login-body {
            padding: 2rem;
        }
        
        .form-control {
            border-radius: 10px;
            border: 1px solid #e1e5e9;
            padding: 0.75rem 1rem;
            margin-bottom: 1rem;
        }
        
        .form-control:focus {
            border-color: #667eea;
            box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
        
        .btn-login {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            border-radius: 10px;
            padding: 0.75rem 2rem;
            font-weight: 600;
            width: 100%;
            transition: transform 0.2s;
        }
        
        .btn-login:hover {
            transform: translateY(-2px);
        }
        
        .alert {
            border-radius: 10px;
            border: none;
        }
        
        .back-link {
            color: #6c757d;
            text-decoration: none;
            font-size: 0.9rem;
        }
        
        .back-link:hover {
            color: #495057;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <div class="login-header">
            <h2 class="mb-0">
                <i class="bi bi-shield-lock me-2"></i>
                Admin Panel
            </h2>
            <p class="mb-0 opacity-75"><?php echo esc_html(SITE_NAME); ?></p>
        </div>
        
        <div class="login-body">
            <?php if (!empty($error_message)): ?>
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    <?php echo esc_html($error_message); ?>
                </div>
            <?php endif; ?>
            
            <form method="POST" action="">
                <?php echo csrf_field(); ?>
                
                <div class="mb-3">
                    <label for="username" class="form-label">Username</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-person"></i>
                        </span>
                        <input type="text" 
                               class="form-control" 
                               id="username" 
                               name="username" 
                               required 
                               autocomplete="username"
                               value="<?php echo esc_attr($_POST['username'] ?? ''); ?>">
                    </div>
                </div>
                
                <div class="mb-4">
                    <label for="password" class="form-label">Password</label>
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-lock"></i>
                        </span>
                        <input type="password" 
                               class="form-control" 
                               id="password" 
                               name="password" 
                               required 
                               autocomplete="current-password">
                        <button class="btn btn-outline-secondary" 
                                type="button" 
                                id="togglePassword">
                            <i class="bi bi-eye"></i>
                        </button>
                    </div>
                </div>
                
                <button type="submit" class="btn btn-primary btn-login">
                    <i class="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                </button>
            </form>
            
            <div class="text-center mt-4">
                <a href="<?php echo SITE_URL; ?>" class="back-link">
                    <i class="bi bi-arrow-left me-1"></i>
                    Back to Website
                </a>
            </div>
        </div>
    </div>

    <!-- Bootstrap 5 JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    
    <script>
        // Toggle password visibility
        document.getElementById('togglePassword').addEventListener('click', function () {
            const password = document.getElementById('password');
            const icon = this.querySelector('i');
            
            if (password.type === 'password') {
                password.type = 'text';
                icon.className = 'bi bi-eye-slash';
            } else {
                password.type = 'password';
                icon.className = 'bi bi-eye';
            }
        });
        
        // Auto-focus username field
        document.getElementById('username').focus();
        
        // Clear form on page load if there was an error
        <?php if (!empty($error_message)): ?>
        document.getElementById('password').value = '';
        <?php endif; ?>
    </script>
</body>
</html>