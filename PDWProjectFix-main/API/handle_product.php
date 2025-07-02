<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

require_once '../config/database.php';
require_once '../models/Product.php';

$database = new Database();
$db = $database->connect();
$product = new Product($db);

$action = $_POST['action'] ?? '';

switch ($action) {
    case 'create':
        $product->name = $_POST['name'];
        $product->price = $_POST['price'];
        $product->imageUrl = $_POST['imageUrl'];
        $product->categoryId = $_POST['categoryId'] ?? 1;
        $product->isSoldOut = isset($_POST['isSoldOut']) ? 1 : 0;

        if ($product->create()) {
            echo json_encode(['success' => true, 'message' => 'Produk berhasil ditambahkan.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Gagal menambahkan produk.']);
        }
        break;

    case 'update':
        $product->id = $_POST['id'];
        $product->name = $_POST['name'];
        $product->price = $_POST['price'];
        $product->imageUrl = $_POST['imageUrl'];
        $product->categoryId = $_POST['categoryId'] ?? 1;
        $product->isSoldOut = isset($_POST['isSoldOut']) ? 1 : 0;

        if ($product->update()) {
            echo json_encode(['success' => true, 'message' => 'Produk berhasil diperbarui.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Gagal memperbarui produk.']);
        }
        break;

    case 'delete':
        $product->id = $_POST['id'];
        if ($product->delete()) {
            echo json_encode(['success' => true, 'message' => 'Produk berhasil dihapus.']);
        } else {
            echo json_encode(['success' => false, 'error' => 'Gagal menghapus produk.']);
        }
        break;

    default:
        echo json_encode(['success' => false, 'error' => 'Aksi tidak valid.']);
        break;
}
?>