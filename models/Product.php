<?php

// Pastikan file koneksi database tersedia
// Asumsikan 'config/database.php' berada di root folder project,
// atau sesuaikan path jika model ini ada di dalam subfolder seperti 'models/'
require_once 'config/database.php';

class Product {
    // Properti koneksi database
    private $conn;
    private $table = 'products'; // Nama tabel produk Anda

    // Properti objek produk
    public $id;
    public $name;
    public $price;
    public $imageUrl; // Menggunakan camelCase agar konsisten dengan JavaScript
    public $categoryId; // Menggunakan camelCase
    public $isSoldOut;  // Menggunakan camelCase

    /**
     * Konstruktor untuk kelas Product.
     * Menginisialisasi koneksi database.
     */
    public function __construct() {
        $database = new Database();
        $this->conn = $database->connect();

        // Check if connection was successful
        if ($this->conn === null) {
            throw new Exception("Database connection failed for Product model!");
        }
    }

    /**
     * Membuat produk baru di database.
     *
     * @return bool True jika berhasil, false jika gagal.
     */
    public function create() {
        $query = "INSERT INTO " . $this->table . "
                  SET
                    name = :name,
                    price = :price,
                    image_url = :imageUrl,
                    category_id = :categoryId,
                    is_sold_out = :isSoldOut";

        $stmt = $this->conn->prepare($query);

        // Membersihkan data dari input untuk mencegah XSS
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->imageUrl = htmlspecialchars(strip_tags($this->imageUrl));
        $this->categoryId = htmlspecialchars(strip_tags($this->categoryId));
        $this->isSoldOut = htmlspecialchars(strip_tags($this->isSoldOut)); // Bisa 0 atau 1

        // Mengikat parameter
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':imageUrl', $this->imageUrl); // Perhatikan: Bind ke imageUrl, bukan image_url
        $stmt->bindParam(':categoryId', $this->categoryId);
        $stmt->bindParam(':isSoldOut', $this->isSoldOut);

        // Jalankan query
        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->errorInfo()[2]);
        return false;
    }

    /**
     * Mengambil semua produk dari database.
     *
     * @return PDOStatement Objek PDOStatement berisi hasil query.
     */
    public function read() {
        // Asumsi ada kolom created_at untuk pengurutan. Jika tidak, hapus ORDER BY
        $query = "SELECT id, name, price, image_url, category_id, is_sold_out
                  FROM " . $this->table . "
                  ORDER BY id ASC"; // Menggunakan ID untuk pengurutan seperti di get_products.php

        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt;
    }

    /**
     * Mengambil satu produk berdasarkan ID.
     *
     * @return bool True jika produk ditemukan dan properti diisi, false jika tidak.
     */
    public function readSingle() {
        $query = "SELECT id, name, price, image_url, category_id, is_sold_out
                  FROM " . $this->table . "
                  WHERE id = :id
                  LIMIT 1"; // Membatasi hasil hanya 1

        $stmt = $this->conn->prepare($query);

        // Mengikat parameter ID
        $stmt->bindParam(':id', $this->id);

        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // Jika ada baris yang ditemukan, isi properti objek
        if ($row) {
            $this->name = $row['name'];
            $this->price = $row['price'];
            $this->imageUrl = $row['image_url'];
            $this->categoryId = $row['category_id'];
            $this->isSoldOut = $row['is_sold_out'];
            return true;
        }
        return false;
    }

    /**
     * Memperbarui data produk yang sudah ada.
     *
     * @return bool True jika berhasil, false jika gagal.
     */
    public function update() {
        $query = "UPDATE " . $this->table . "
                  SET
                    name = :name,
                    price = :price,
                    image_url = :imageUrl,
                    category_id = :categoryId,
                    is_sold_out = :isSoldOut
                  WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Membersihkan data
        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->price = htmlspecialchars(strip_tags($this->price));
        $this->imageUrl = htmlspecialchars(strip_tags($this->imageUrl));
        $this->categoryId = htmlspecialchars(strip_tags($this->categoryId));
        $this->isSoldOut = htmlspecialchars(strip_tags($this->isSoldOut));
        $this->id = htmlspecialchars(strip_tags($this->id)); // ID juga perlu dibersihkan

        // Mengikat parameter
        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':price', $this->price);
        $stmt->bindParam(':imageUrl', $this->imageUrl);
        $stmt->bindParam(':categoryId', $this->categoryId);
        $stmt->bindParam(':isSoldOut', $this->isSoldOut);
        $stmt->bindParam(':id', $this->id);

        // Jalankan query
        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->errorInfo()[2]);
        return false;
    }

    /**
     * Menghapus produk dari database.
     *
     * @return bool True jika berhasil, false jika gagal.
     */
    public function delete() {
        $query = "DELETE FROM " . $this->table . " WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        // Membersihkan ID
        $this->id = htmlspecialchars(strip_tags($this->id));

        // Mengikat parameter ID
        $stmt->bindParam(':id', $this->id);

        // Jalankan query
        if ($stmt->execute()) {
            return true;
        }

        // Print error if something goes wrong
        printf("Error: %s.\n", $stmt->errorInfo()[2]);
        return false;
    }
}

?>