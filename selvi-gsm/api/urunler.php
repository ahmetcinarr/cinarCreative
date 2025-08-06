<?php
// Ürünler API
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/../../includes/config.php';
require_once __DIR__ . '/../../includes/database.php';

$action = $_GET['action'] ?? 'list';
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$kategori = $_GET['kategori'] ?? null;
$marka = $_GET['marka'] ?? null;

if ($action === 'list') {
    $sql = "SELECT * FROM urunler WHERE aktif = 1";
    $params = [];
    if ($kategori) {
        $sql .= " AND kategori_id = ?";
        $params[] = $kategori;
    }
    if ($marka) {
        $sql .= " AND marka = ?";
        $params[] = $marka;
    }
    $sql .= " ORDER BY id DESC";
    $urunler = db_fetch_all($sql, $params);
    echo json_encode(['success' => true, 'data' => $urunler]);
    exit;
}

if ($action === 'detail' && $id) {
    $sql = "SELECT * FROM urunler WHERE id = ? AND aktif = 1";
    $urun = db_fetch_row($sql, [$id]);
    if ($urun) {
        echo json_encode(['success' => true, 'data' => $urun]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Ürün bulunamadı.']);
    }
    exit;
}

echo json_encode(['success' => false, 'error' => 'Geçersiz istek.']);