<?php
// Aksesuarlar API
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/database.php';

$action = $_GET['action'] ?? 'list';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$kategori = $_GET['kategori'] ?? null;

if ($action === 'list') {
    $sql = "SELECT * FROM aksesuarlar WHERE aktif = 1";
    $params = [];
    if ($kategori) {
        $sql .= " AND kategori_id = ?";
        $params[] = $kategori;
    }
    $sql .= " ORDER BY id DESC";
    $aksesuarlar = db_fetch_all($sql, $params);
    echo json_encode(['success' => true, 'data' => $aksesuarlar]);
    exit;
}

if ($action === 'detail' && $id) {
    $sql = "SELECT * FROM aksesuarlar WHERE id = ? AND aktif = 1";
    $aksesuar = db_fetch_row($sql, [$id]);
    if ($aksesuar) {
        echo json_encode(['success' => true, 'data' => $aksesuar]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Aksesuar bulunamadı.']);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Geçersiz istek.']);