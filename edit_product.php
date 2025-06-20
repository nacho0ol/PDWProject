<?php
// edit_product.php
require_once 'models/Product.php';
require_once 'config/database.php';

$product = new Product();
$edit_mode = false; // Flag untuk mode edit

// Ambil ID dari URL jika ada
if (isset($_GET['id'])) {
    $product->id = $_GET['id'];
    if ($product->readSingle()) {
        $edit_mode = true;
    } else {
        $error_message = "Produk tidak ditemukan!";
    }
}

// Tangani pengiriman formulir Update
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $product->id = $_POST['id'] ?? ''; // Pastikan ID dikirimkan dari form tersembunyi
    $product->name = $_POST['name'] ?? '';
    $product->price = $_POST['price'] ?? '';
    $product->imageUrl = $_POST['imageUrl'] ?? '';
    $product->categoryId = $_POST['categoryId'] ?? 1;
    $product->isSoldOut = isset($_POST['isSoldOut']) ? 1 : 0;

    if ($product->update()) {
        $success_message = "Produk berhasil diperbarui!";
        // Redirect kembali ke halaman utama setelah update
        header('Location: index.php');
        exit();
    } else {
        $error_message = "Gagal memperbarui produk! Cek log server untuk detail.";
    }
}
?>

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Produk</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <h1 class="text-center mb-4"><?php echo $edit_mode ? 'Edit Produk' : 'Produk Tidak Ditemukan'; ?></h1>

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

        <?php if ($edit_mode): ?>
        <div class="card p-4 mb-5">
            <form method="POST" action="">
                <input type="hidden" name="id" value="<?php echo htmlspecialchars($product->id); ?>">

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
                    <input type="text" id="imageUrl" name="imageUrl" class="form-control" value="<?php echo htmlspecialchars($product->imageUrl); ?>" placeholder="assets/gambar_produk.png" required>
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
                <a href="index.php" class="btn btn-secondary">Batal</a>
            </form>
        </div>
        <?php else: ?>
            <p class="text-center">Produk yang diminta tidak ditemukan atau ID tidak valid.</p>
        <?php endif; ?>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/@popperjs/core@2.11.6/dist/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.min.js"></script>
</body>
</html>