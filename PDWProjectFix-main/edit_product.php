<?php
require_once 'config/database.php';
require_once 'models/Product.php';

$database = new Database();
$db = $database->connect();
$product = new Product($db);

// Cek jika ada ID di URL
if (!isset($_GET['id'])) {
    header('Location: admin.php?status=no_id');
    exit();
}
$product->id = $_GET['id'];

$error_message = null;

// Logika untuk Update
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $product->name = $_POST['name'] ?? '';
    $product->price = $_POST['price'] ?? '';
    $product->imageUrl = $_POST['imageUrl'] ?? '';
    $product->categoryId = $_POST['categoryId'] ?? 1;
    $product->isSoldOut = isset($_POST['isSoldOut']) ? 1 : 0;

    if ($product->update()) {
        header('Location: admin.php?status=success_update');
        exit();
    } else {
        $error_message = "Gagal memperbarui produk!";
    }
}

// Ambil data produk untuk ditampilkan di form
if (!$product->readSingle()) {
    // Jika produk tidak ditemukan, redirect ke admin dengan pesan error
    header('Location: admin.php?status=not_found');
    exit();
}
?>
<!DOCTYPE html>
<html lang="id" data-bs-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Produk - <?php echo htmlspecialchars($product->name); ?></title>
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
                        <a class="nav-link" href="admin.php">Manajemen Produk</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <main class="container my-5">
        <h1 class="mb-4">Edit Produk</h1>
        
        <?php if ($error_message): ?>
            <div class="alert alert-danger"><?php echo $error_message; ?></div>
        <?php endif; ?>
        
        <div class="card admin-section p-4">
            <form method="POST" action="edit_product.php?id=<?php echo htmlspecialchars($product->id); ?>">
                <div class="mb-3">
                    <label for="name" class="form-label">Nama Produk:</label>
                    <input type="text" id="name" name="name" class="form-control" value="<?php echo htmlspecialchars($product->name); ?>" required>
                </div>
                <div class="mb-3">
                    <label for="price" class="form-label">Harga:</label>
                    <input type="number" step="0.01" id="price" name="price" class="form-control" value="<?php echo htmlspecialchars($product->price); ?>" required>
                </div>
                <div class="mb-3">
                    <label for="imageUrl" class="form-label">URL Gambar:</label>
                    <input type="text" id="imageUrl" name="imageUrl" class="form-control" value="<?php echo htmlspecialchars($product->imageUrl); ?>" required>
                </div>
                <div class="mb-3">
                    <label for="categoryId" class="form-label">Kategori ID:</label>
                    <input type="number" id="categoryId" name="categoryId" class="form-control" value="<?php echo htmlspecialchars($product->categoryId); ?>" required>
                </div>
                <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="isSoldOut" name="isSoldOut" value="1" <?php echo ($product->isSoldOut == 1) ? 'checked' : ''; ?>>
                    <label class="form-check-label" for="isSoldOut">Sold Out</label>
                </div>
                <button type="submit" class="btn btn-primary">Update Produk</button>
                <a href="admin.php" class="btn btn-secondary">Batal</a>
            </form>
        </div>
    </main>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>