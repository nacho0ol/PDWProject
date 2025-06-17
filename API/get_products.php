<?php
// File: api/get_products.php

// Panggil file koneksi database
require 'db.php';

// Atur header agar outputnya adalah JSON
header('Content-Type: application/json');

try {
    // Siapkan dan jalankan query untuk mengambil semua produk
    $stmt = $pdo->query("SELECT * FROM products ORDER BY id ASC");
    $productsFromDb = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // PENTING: Ubah format data dari database agar cocok dengan yang diharapkan JavaScript
    // Contoh: 'is_sold_out' (0/1) menjadi 'soldOut' (true/false)
    $formattedProducts = array_map(function ($product) {
        return [
            'id' => (int) $product['id'],
            'name' => $product['name'],
            'price' => $product['price'],
            'imageUrl' => $product['image_url'],
            'category' => (int) $product['category_id'],
            'soldOut' => (bool) $product['is_sold_out'],
        ];
    }, $productsFromDb);

    // Cetak hasil dalam format JSON
    echo json_encode($formattedProducts);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Gagal mengambil data produk: ' . $e->getMessage()]);
}
?>