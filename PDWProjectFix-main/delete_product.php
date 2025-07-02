<?php
require_once 'config/database.php';
require_once 'models/Product.php';

// Pastikan request adalah GET dan ada ID
if (isset($_GET['id'])) {
    $database = new Database();
    $db = $database->connect();
    $product = new Product($db);
    
    $product->id = $_GET['id'];

    if ($product->delete()) {
        header('Location: admin.php?status=success_delete');
    } else {
        header('Location: admin.php?status=error_delete');
    }
} else {
    header('Location: admin.php?status=no_id');
}
exit();
?>