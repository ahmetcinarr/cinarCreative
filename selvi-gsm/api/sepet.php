<?php
// Sepet API
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/database.php';

session_start();
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'error' => 'Oturum açmalısınız.']);
    exit;
}
$kullanici_id = $_SESSION['user_id'];

$action = $_GET['action'] ?? 'list';

if ($action === 'list') {
    $sql = "SELECT * FROM sepet WHERE kullanici_id = ?";
    $sepet = db_fetch_all($sql, [$kullanici_id]);
    echo json_encode(['success' => true, 'data' => $sepet]);
    exit;
}

if ($action === 'ekle' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $urun_id = $_POST['urun_id'] ?? null;
    $aksesuar_id = $_POST['aksesuar_id'] ?? null;
    $adet = intval($_POST['adet'] ?? 1);
    if (!$urun_id && !$aksesuar_id) {
        echo json_encode(['success' => false, 'error' => 'Ürün veya aksesuar seçilmedi.']);
        exit;
    }
    $data = [
        'kullanici_id' => $kullanici_id,
        'urun_id' => $urun_id,
        'aksesuar_id' => $aksesuar_id,
        'adet' => $adet
    ];
    db_insert('sepet', $data);
    echo json_encode(['success' => true, 'message' => 'Sepete eklendi.']);
    exit;
}

if ($action === 'cikar' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $sepet_id = $_POST['sepet_id'] ?? null;
    if (!$sepet_id) {
        echo json_encode(['success' => false, 'error' => 'Sepet ürünü seçilmedi.']);
        exit;
    }
    db_delete('sepet', 'id = ? AND kullanici_id = ?', [$sepet_id, $kullanici_id]);
    echo json_encode(['success' => true, 'message' => 'Ürün sepetten çıkarıldı.']);
    exit;
}

if ($action === 'temizle' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    db_delete('sepet', 'kullanici_id = ?', [$kullanici_id]);
    echo json_encode(['success' => true, 'message' => 'Sepet temizlendi.']);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Geçersiz istek.']);