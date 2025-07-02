<?php
require_once 'config/database.php';
require_once 'models/Product.php';

// Inisialisasi koneksi dan model
$database = new Database();
$db = $database->connect();
$product = new Product($db);

$success_message = null;
$error_message = null;

// Cek status dari redirect (setelah update/delete)
if (isset($_GET['status'])) {
    if ($_GET['status'] == 'success_update') {
        $success_message = "Produk berhasil diperbarui!";
    }
    if ($_GET['status'] == 'success_delete') {
        $success_message = "Produk berhasil dihapus!";
    }
    if ($_GET['status'] == 'error_delete' || $_GET['status'] == 'no_id') {
        $error_message = "Terjadi kesalahan atau ID produk tidak ditemukan.";
    }
}


// Logika untuk Tambah Produk dari form di halaman ini
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['add_product'])) {
    $product->name = $_POST['name'] ?? '';
    $product->price = $_POST['price'] ?? '';
    $product->imageUrl = $_POST['imageUrl'] ?? '';
    $product->categoryId = $_POST['categoryId'] ?? 1;
    $product->isSoldOut = isset($_POST['isSoldOut']) ? 1 : 0;

    if ($product->create()) {
        $success_message = "Produk berhasil ditambahkan!";
    } else {
        $error_message = "Gagal menambahkan produk!";
    }
}

// Ambil semua produk untuk ditampilkan
try {
    $products_stmt = $product->read();
} catch (Exception $e) {
    $error_message = "Gagal memuat produk: " . $e->getMessage();
}
?>
<!DOCTYPE html>
<html lang="id" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin - Manajemen Produk</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet"/>
    <link rel="stylesheet" href="style.css" />
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div class="container-fluid">
            <a class="navbar-brand logo" href="#">REALITY CLUB (ADMIN)</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#adminNavbar">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="adminNavbar">
                <ul class="navbar-nav ms-auto align-items-lg-center">
                    <li class="nav-item">
                        <a class="nav-link" href="index.html">Lihat Toko Publik</a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="admin.php">Manajemen Produk</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container my-5">
        <h1 class="text-center mb-4">Manajemen Data Produk</h1>
        
        <?php if ($success_message): ?>
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                <?php echo $success_message; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>
        <?php if ($error_message): ?>
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <?php echo $error_message; ?>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
            </div>
        <?php endif; ?>

        <div class="card admin-section p-4 mb-5">
            <h2 class="mb-3">Tambah/Edit Produk</h2>
            <form method="POST" action="admin.php">
                <input type="hidden" name="add_product" value="1">
                <div class="mb-3"><label for="name" class="form-label">Nama Produk:</label><input type="text" id="name" name="name" class="form-control" required></div>
                <div class="mb-3"><label for="price" class="form-label">Harga:</label><input type="number" step="0.01" id="price" name="price" class="form-control" required></div>
                <div class="mb-3"><label for="imageUrl" class="form-label">URL Gambar:</label><input type="text" id="imageUrl" name="imageUrl" class="form-control" placeholder="assets/gambar.jpg" required></div>
                <div class="mb-3"><label for="categoryId" class="form-label">Kategori ID:</label><input type="number" id="categoryId" name="categoryId" class="form-control" value="1" required></div>
                <div class="mb-3 form-check"><input type="checkbox" class="form-check-input" id="isSoldOut" name="isSoldOut" value="1"><label class="form-check-label" for="isSoldOut">Sold Out</label></div>
                <button type="submit" class="btn admin-btn">Tambah Produk</button>
            </form>
        </div>

        <div class="card admin-section p-4">
            <h2>Daftar Produk</h2>
            <div class="table-responsive">
                <table class="table table-hover">
                    <thead>
                        <tr><th>ID</th><th>Gambar</th><th>Nama</th><th>Harga</th><th>Kategori</th><th>Status</th><th>Aksi</th></tr>
                    </thead>
                    <tbody>
                        <?php if ($products_stmt && $products_stmt->rowCount() > 0):
                            while ($row = $products_stmt->fetch(PDO::FETCH_ASSOC)): ?>
                            <tr>
                                <td><?php echo $row['id']; ?></td>
                                <td><img src="<?php echo htmlspecialchars($row['image_url']); ?>" alt="<?php echo htmlspecialchars($row['name']); ?>" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;"></td>
                                <td><?php echo htmlspecialchars($row['name']); ?></td>
                                <td>$<?php echo number_format($row['price'], 2); ?></td>
                                <td><?php echo htmlspecialchars($row['category_id']); ?></td>
                                <td><?php echo ($row['is_sold_out'] == 1) ? '<span class="badge bg-danger">Sold Out</span>' : '<span class="badge bg-success">Available</span>'; ?></td>
                                <td>
                                    <a href="edit_product.php?id=<?php echo $row['id']; ?>" class="btn btn-warning btn-sm">Edit</a>
                                    <a href="delete_product.php?id=<?php echo $row['id']; ?>" class="btn btn-danger btn-sm" onclick="return confirm('Yakin ingin hapus?')">Hapus</a>
                                </td>
                            </tr>
                        <?php endwhile; else: ?>
                            <tr><td colspan="7" class="text-center">Tidak ada produk ditemukan.</td></tr>
                        <?php endif; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>