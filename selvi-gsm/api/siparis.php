<?php
// Sipariş API
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
    $sql = "SELECT * FROM siparisler WHERE kullanici_id = ? ORDER BY siparis_tarihi DESC";
    $siparisler = db_fetch_all($sql, [$kullanici_id]);
    echo json_encode(['success' => true, 'data' => $siparisler]);
    exit;
}

if ($action === 'olustur' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    // Sepeti al
    $sepet = db_fetch_all("SELECT * FROM sepet WHERE kullanici_id = ?", [$kullanici_id]);
    if (!$sepet) {
        echo json_encode(['success' => false, 'error' => 'Sepetiniz boş.']);
        exit;
    }
    $toplam = 0;
    foreach ($sepet as $item) {
        if ($item['urun_id']) {
            $urun = db_fetch_row("SELECT fiyat FROM urunler WHERE id = ?", [$item['urun_id']]);
            $toplam += $urun['fiyat'] * $item['adet'];
        } elseif ($item['aksesuar_id']) {
            $aksesuar = db_fetch_row("SELECT fiyat FROM aksesuarlar WHERE id = ?", [$item['aksesuar_id']]);
            $toplam += $aksesuar['fiyat'] * $item['adet'];
        }
    }
    $siparis_id = db_insert('siparisler', [
        'kullanici_id' => $kullanici_id,
        'toplam_tutar' => $toplam,
        'durum' => 'hazırlanıyor'
    ]);
    foreach ($sepet as $item) {
        if ($item['urun_id']) {
            $urun = db_fetch_row("SELECT fiyat FROM urunler WHERE id = ?", [$item['urun_id']]);
            db_insert('siparis_detay', [
                'siparis_id' => $siparis_id,
                'urun_id' => $item['urun_id'],
                'adet' => $item['adet'],
                'birim_fiyat' => $urun['fiyat']
            ]);
        } elseif ($item['aksesuar_id']) {
            $aksesuar = db_fetch_row("SELECT fiyat FROM aksesuarlar WHERE id = ?", [$item['aksesuar_id']]);
            db_insert('siparis_detay', [
                'siparis_id' => $siparis_id,
                'aksesuar_id' => $item['aksesuar_id'],
                'adet' => $item['adet'],
                'birim_fiyat' => $aksesuar['fiyat']
            ]);
        }
    }
    db_delete('sepet', 'kullanici_id = ?', [$kullanici_id]);
    echo json_encode(['success' => true, 'message' => 'Siparişiniz alındı.', 'siparis_id' => $siparis_id]);
    exit;
}

echo json_encode(['success' => false, 'error' => 'Geçersiz istek.']);