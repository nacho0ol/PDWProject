<?php
// File: api/handle_product.php

require 'db.php';
header('Content-Type: application/json');

// Pastikan metode request adalah POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Metode request tidak valid.']);
    exit;
}

// Ambil aksi yang diminta dari data POST
$action = $_POST['action'] ?? '';

try {
    // Gunakan switch untuk menentukan operasi berdasarkan 'action'
    switch ($action) {
        case 'create':
            // Menggunakan prepared statements untuk mencegah SQL Injection
            $stmt = $pdo->prepare("INSERT INTO products (name, price, image_url, category_id, is_sold_out) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $_POST['name'],
                $_POST['price'],
                $_POST['imageUrl'],
                1, // Default kategori 1, bisa disesuaikan nanti
                0  // Default tidak sold out
            ]);
            echo json_encode(['success' => true, 'message' => 'Produk berhasil ditambahkan.']);
            break;

        case 'update':
            $stmt = $pdo->prepare("UPDATE products SET name = ?, price = ?, image_url = ? WHERE id = ?");
            $stmt->execute([
                $_POST['name'],
                $_POST['price'],
                $_POST['imageUrl'],
                $_POST['id']
            ]);
            echo json_encode(['success' => true, 'message' => 'Produk berhasil diperbarui.']);
            break;

        case 'delete':
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$_POST['id']]);
            echo json_encode(['success' => true, 'message' => 'Produk berhasil dihapus.']);
            break;

        default:
            http_response_code(400); // Bad Request
            echo json_encode(['error' => 'Aksi tidak diketahui.']);
            break;
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Operasi produk gagal: ' . $e->getMessage()]);
}
?>