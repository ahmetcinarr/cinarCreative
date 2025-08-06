<?php
// Kullanıcı API
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/database.php';

session_start();
$action = $_GET['action'] ?? '';

if ($action === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 6) {
        echo json_encode(['success' => false, 'error' => 'Geçersiz e-posta veya şifre.']);
        exit;
    }
    if (db_exists('users', 'email = ?', [$email])) {
        echo json_encode(['success' => false, 'error' => 'Bu e-posta ile kayıtlı kullanıcı var.']);
        exit;
    }
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $user_id = db_insert('users', [
        'username' => $email,
        'email' => $email,
        'password_hash' => $hash,
        'first_name' => '',
        'last_name' => '',
        'role' => 'editor',
        'is_active' => 1
    ]);
    $_SESSION['user_id'] = $user_id;
    echo json_encode(['success' => true, 'message' => 'Kayıt başarılı!']);
    exit;
}

if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $user = db_fetch_row('SELECT * FROM users WHERE email = ? AND is_active = 1', [$email]);
    if ($user && password_verify($password, $user['password_hash'])) {
        $_SESSION['user_id'] = $user['id'];
        echo json_encode(['success' => true, 'message' => 'Giriş başarılı!']);
    } else {
        echo json_encode(['success' => false, 'error' => 'E-posta veya şifre hatalı.']);
    }
    exit;
}

if ($action === 'logout') {
    session_destroy();
    echo json_encode(['success' => true, 'message' => 'Çıkış yapıldı.']);
    exit;
}

if ($action === 'info') {
    if (!isset($_SESSION['user_id'])) {
        echo json_encode(['success' => false, 'error' => 'Oturum yok.']);
        exit;
    }
    $user = db_fetch_row('SELECT id, email, first_name, last_name FROM users WHERE id = ?', [$_SESSION['user_id']]);
    echo json_encode(['success' => true, 'data' => $user]);
    exit;
}

if ($action === 'reset' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'] ?? '';
    $user = db_fetch_row('SELECT * FROM users WHERE email = ?', [$email]);
    if (!$user) {
        echo json_encode(['success' => false, 'error' => 'Kullanıcı bulunamadı.']);
        exit;
    }
    // Basit şifre sıfırlama (örnek): yeni şifreyi e-posta ile göndermek yerine ekrana yazdır
    $new_pass = substr(md5(time()), 0, 8);
    $hash = password_hash($new_pass, PASSWORD_BCRYPT);
    db_update('users', ['password_hash' => $hash], 'id = ?', [$user['id']]);
    echo json_encode(['success' => true, 'message' => 'Yeni şifreniz: ' . $new_pass]);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Geçersiz istek.']);