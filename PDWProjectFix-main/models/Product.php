<?php
class Product {
    private $conn;
    private $table = 'products';

    public $id;
    public $name;
    public $price;
    public $imageUrl;
    public $categoryId;
    public $isSoldOut;

    public function __construct($db) {
        $this->conn = $db;
    }

    // Read all products
    public function read() {
        $query = 'SELECT id, name, price, image_url, category_id, is_sold_out FROM ' . $this->table ;
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    // Read single product
    public function readSingle() { 
        $query = 'SELECT id, name, price, image_url, category_id, is_sold_out FROM ' . $this->table . ' WHERE id = ? LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $row = $stmt->fetch(PDO::FETCH_ASSOC); //mengambil satu baris dari hasil
            $this->name = $row['name'];
            $this->price = $row['price'];
            $this->imageUrl = $row['image_url'];
            $this->categoryId = $row['category_id'];
            $this->isSoldOut = $row['is_sold_out'];
            return true;
        }
        return false;
    }

    // Create product
    public function create() {
        $query = 'INSERT INTO ' . $this->table . ' (name, price, image_url, category_id, is_sold_out) VALUES (:name, :price, :image_url, :category_id, :is_sold_out)';
        $stmt = $this->conn->prepare($query);

        // Membersihkan data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->imageUrl = htmlspecialchars(strip_tags($this->imageUrl));
        $this->categoryId = htmlspecialchars(strip_tags($this->categoryId));
        $this->isSoldOut = isset($this->isSoldOut) ? $this->isSoldOut : 0;

        // Bind data
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':image_url', $this->imageUrl);
        $stmt->bindParam(':category_id', $this->categoryId);
        $stmt->bindParam(':is_sold_out', $this->isSoldOut);

        if ($stmt->execute()) {
            return true;
        }
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    // Update product
    public function update() {
        $query = 'UPDATE ' . $this->table . ' SET name = :name, price = :price, image_url = :image_url, category_id = :category_id, is_sold_out = :is_sold_out WHERE id = :id';
        $stmt = $this->conn->prepare($query);

        // Membersihkan data
        $this->id = htmlspecialchars(strip_tags($this->id));
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->imageUrl = htmlspecialchars(strip_tags($this->imageUrl));
        $this->categoryId = htmlspecialchars(strip_tags($this->categoryId));
        $this->isSoldOut = isset($this->isSoldOut) ? $this->isSoldOut : 0;

        // Bind data
        $stmt->bindParam(':id', $this->id);
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':image_url', $this->imageUrl);
        $stmt->bindParam(':category_id', $this->categoryId);
        $stmt->bindParam(':is_sold_out', $this->isSoldOut);

        if ($stmt->execute()) {
            return true;
        }
        printf("Error: %s.\n", $stmt->error);
        return false;
    }

    // Delete product
    public function delete() {
        $query = 'DELETE FROM ' . $this->table . ' WHERE id = :id';
        $stmt = $this->conn->prepare($query);
        $this->id = htmlspecialchars(strip_tags($this->id));
        $stmt->bindParam(':id', $this->id);

        if ($stmt->execute()) {
            return true;
        }
        printf("Error: %s.\n", $stmt->error);
        return false;
    }
}
?>