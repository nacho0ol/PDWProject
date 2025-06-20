<?php
/**
 * index.php (Product Management)
 *
 * File ini adalah halaman utama untuk manajemen produk.
 * Ini menampilkan daftar produk, form untuk menambah produk baru,
 * dan link untuk mengedit atau menghapus produk.
 *
 * @package MerchRC
 * @author Your Name (Optional)
 */

// Sertakan model Product.php
// Asumsikan model berada di folder 'models' yang sejajar dengan file ini.
require_once 'models/Product.php';
require_once 'config/database.php'; // Pastikan ini juga di-require jika tidak di-require di Product.php

$product = new Product();
$products_stmt = null; // Inisialisasi variabel untuk menghindari error jika koneksi gagal

try {
    // Ambil semua produk saat halaman dimuat
    $products_stmt = $product->read();
} catch (Exception $e) {
    $error_message = "Gagal memuat produk: " . $e->getMessage();
}


// Tangani pengiriman formulir (Tambah Produk)
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Set properti objek Product dari data POST
    $product->name = $_POST['name'] ?? '';
    $product->price = $_POST['price'] ?? '';
    $product->imageUrl = $_POST['imageUrl'] ?? '';
    $product->categoryId = $_POST['categoryId'] ?? 1; // Default ke 1 jika tidak disediakan
    $product->isSoldOut = isset($_POST['isSoldOut']) ? 1 : 0; // Checkbox value (0 atau 1)

    // Coba buat produk baru
    if ($product->create()) {
        $success_message = "Produk berhasil ditambahkan!";
        // Refresh daftar produk setelah penambahan
        $products_stmt = $product->read();
    } else {
        $error_message = "Gagal menambahkan produk! Cek log server untuk detail.";
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CRUD App - Manajemen Produk</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        /* Optional: Some custom styling for better appearance */
        body {
            background-color: #f8f9fa;
        }
        .container {
            max-width: 960px;
        }
        .card {
            box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
        }
        .table img {
            max-width: 60px;
            height: auto;
            border-radius: 4px;
        }
    </style>
</head>
<body>
    <nav
      class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm"
    >
      <div class="container-fluid">
        <a class="navbar-brand logo" href="#">REALITY CLUB</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav ms-auto align-items-lg-center">
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Merch
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li><a class="dropdown-item" href="#">Outerwear</a></li>
                <li><a class="dropdown-item" href="#">Tops</a></li>
                <li><a class="dropdown-item" href="#">Accessories</a></li>
                <li><a class="dropdown-item" href="#">Kids</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Music
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li><a class="dropdown-item" href="#">Albums</a></li>
                <li><a class="dropdown-item" href="#">Vinyl</a></li>
                <li><a class="dropdown-item" href="#">CDs</a></li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Collections
              </a>
              <ul class="dropdown-menu dropdown-menu-dark">
                <li>
                  <a class="dropdown-item" href="#">Reality Club Presents</a>
                </li>
                <li>
                  <a class="dropdown-item" href="#">What Do You Really Know?</a>
                </li>
                <li><a class="dropdown-item" href="#">Never Get Better</a></li>
              </ul>
            </li>
            <li class="nav-item" id="login-item">
              <a
                class="nav-link"
                href="#"
                data-bs-toggle="modal"
                data-bs-target="#loginModal"
                >Login</a
              >
            </li>
            <li class="nav-item" id="account-item" style="display: none">
              <a href="#" id="account-btn" class="nav-link">My Account</a>
            </li>
            <li class="nav-item" id="logout-item" style="display: none">
              <a href="#" id="logout-btn" class="nav-link">Logout</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
    <div class="container mt-5">
        <h1 class="text-center mb-4">Manajemen Data Produk</h1>

        <?php if (isset($success_message)): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?php echo $success_message; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <?php if (isset($error_message)): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <?php echo $error_message; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <div class="card p-4 mb-5">
            <h2>Tambah Produk Baru</h2>
            <form method="POST" action="">
                <div class="mb-3">
                    <label for="name" class="form-label">Nama Produk:</label>
                    <input type="text" id="name" name="name" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="price" class="form-label">Harga:</label>
                    <input type="number" step="0.01" id="price" name="price" class="form-control" required>
                </div>

                <div class="mb-3">
                    <label for="imageUrl" class="form-label">URL Gambar:</label>
                    <input type="text" id="imageUrl" name="imageUrl" class="form-control" placeholder="assets/gambar_produk.png" required>
                </div>

                <div class="mb-3">
                    <label for="categoryId" class="form-label">Kategori ID:</label>
                    <input type="number" id="categoryId" name="categoryId" class="form-control" value="1" required>
                </div>

                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="isSoldOut" name="isSoldOut" value="1">
                    <label class="form-check-label" for="isSoldOut">Sold Out</label>
                </div>

                <button type="submit" class="btn btn-primary">Tambah Produk</button>
            </form>
        </div>

        <div class="card p-4">
            <h2>Daftar Produk</h2>
            <table class="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Gambar</th>
                        <th>Nama</th>
                        <th>Harga</th>
                        <th>Kategori</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <?php
                    // Pastikan $products_stmt adalah objek PDOStatement sebelum fetch
                    if ($products_stmt && $products_stmt->rowCount() > 0):
                        while ($row = $products_stmt->fetch(PDO::FETCH_ASSOC)):
                    ?>
                        <tr>
                            <td><?php echo $row['id']; ?></td>
                            <td><img src="<?php echo htmlspecialchars($row['image_url']); ?>" alt="<?php echo htmlspecialchars($row['name']); ?>" class="img-fluid"></td>
                            <td><?php echo htmlspecialchars($row['name']); ?></td>
                            <td>$<?php echo number_format($row['price'], 2); ?></td>
                            <td><?php echo htmlspecialchars($row['category_id']); ?></td>
                            <td>
                                <?php
                                    echo ($row['is_sold_out'] == 1) ? '<span class="badge bg-danger">Sold Out</span>' : '<span class="badge bg-success">Available</span>';
                                ?>
                            </td>
                            <td>
                                <a href="edit_product.php?id=<?php echo $row['id']; ?>" class="btn btn-warning btn-sm me-1">Edit</a>
                                <a href="delete_product.php?id=<?php echo $row['id']; ?>" class="btn btn-danger btn-sm"
                                   onclick="return confirm('Apakah Anda yakin ingin menghapus produk ini?')">Hapus</a>
                            </td>
                        </tr>
                    <?php
                        endwhile;
                    else:
                    ?>
                        <tr>
                            <td colspan="7" class="text-center">Tidak ada produk ditemukan.</td>
                        </tr>
                    <?php endif; ?>
                </tbody>
            </table>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
</body>
</html>