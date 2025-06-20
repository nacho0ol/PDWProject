<?php
// delete_product.php
require_once 'models/Product.php';
require_once 'config/database.php';

// Pastikan request adalah GET dan ada ID yang dikirimkan
if (isset($_GET['id'])) {
    $product = new Product();
    $product->id = $_GET['id'];

    if ($product->delete()) {
        // Redirect kembali ke halaman utama dengan pesan sukses
        header('Location: index.php?status=success_delete');
        exit();
    } else {
        // Redirect kembali ke halaman utama dengan pesan error
        header('Location: index.php?status=error_delete');
        exit();
    }
} else {
    // Jika tidak ada ID, redirect ke halaman utama
    header('Location: index.php?status=no_id');
    exit();
}
?>