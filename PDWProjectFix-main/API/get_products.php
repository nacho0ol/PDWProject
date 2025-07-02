<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=UTF-8');

require_once '../config/database.php';
require_once '../models/Product.php';

$database = new Database();
$db = $database->connect();
$product = new Product($db);

$result = $product->read();
$num = $result->rowCount();

if ($num > 0) {
    $products_arr = array();
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        extract($row);
        $product_item = array(
            'id' => $id,
            'name' => $name,
            'price' => $price,
            'imageUrl' => $image_url, // Konversi snake_case ke camelCase untuk JS
            'category' => (int)$category_id,
            'soldOut' => (bool)$is_sold_out
        );
        array_push($products_arr, $product_item);
    }
    echo json_encode($products_arr);
} else {
    echo json_encode(array('message' => 'No products found.'));
}
?>