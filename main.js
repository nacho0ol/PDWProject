// Function to fetch products from the API
async function fetchProducts() {
  try {
    const response = await fetch("api/get_products.php"); // PASTIKAN JALUR INI BENAR
    if (!response.ok) {
      // Tangani respons HTTP yang tidak OK (misal 404, 500)
      const errorData = await response.json(); // Coba parse error dari PHP
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${
          errorData.error || response.statusText
        }`
      );
    }
    const products = await response.json();
    console.log("Fetched products:", products); // Debugging: Lihat data yang diambil
    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    alert(
      "Gagal memuat produk. Pastikan server backend (Laragon) berjalan dan API sudah benar. Detail: " +
        error.message
    ); // Tampilkan alert yang lebih informatif
    return []; // Return an empty array on error
  }
}

// Function to render products into the specified grid
function renderProducts(products, gridId) {
  const productGrid = document.getElementById(gridId);
  if (!productGrid) {
    console.error(`Product grid with ID "${gridId}" not found.`);
    return;
  }
  productGrid.innerHTML = ""; // Clear existing products

  products.forEach((product) => {
    // Pastikan nama properti di objek 'product' cocok dengan yang dikembalikan oleh PHP
    const productCard = `
      <div class="col">
        <div class="card h-100 product-card">
          <img src="${
            product.imageUrl
          }" class="card-img-top product-image" alt="${product.name}" />
          <div class="card-body d-flex flex-column">
            <h5 class="card-title product-name">${product.name}</h5>
            <p class="card-text product-price">$${parseFloat(
              product.price
            ).toFixed(2)}</p>
            ${
              product.soldOut
                ? '<span class="badge bg-danger product-sold-out">Sold Out</span>'
                : ""
            }
            <button class="btn btn-primary mt-auto add-to-cart-btn" ${
              product.soldOut ? "disabled" : ""
            }>Add to Cart</button>
          </div>
        </div>
      </div>
    `;
    productGrid.innerHTML += productCard;
  });
}

// Function to load products and render them on both public and admin interfaces
async function loadProductsAndRender() {
  const products = await fetchProducts();
  if (products.length === 0) {
    console.log(
      "Tidak ada produk untuk ditampilkan atau terjadi kesalahan saat mengambil data."
    );
    // Anda bisa menambahkan pesan di UI jika tidak ada produk
    // document.getElementById('public-product-grid-1').innerHTML = '<p class="text-center">Tidak ada produk tersedia.</p>';
    return;
  }

  // Filter produk berdasarkan category_id
  const collection1Products = products.filter((p) => p.category === 1);
  const collection2Products = products.filter((p) => p.category === 2);
  const collection3Products = products.filter((p) => p.category === 3);

  renderProducts(collection1Products, "public-product-grid-1");
  renderProducts(collection2Products, "public-product-grid-2");
  renderProducts(collection3Products, "public-product-grid-3");

  // Untuk admin panel (jika sudah login)
  renderAdminProductList(products);
}

// Initial load of products when the page loads
document.addEventListener("DOMContentLoaded", loadProductsAndRender);

// ... (sisanya dari script.js Anda, termasuk login/logout, handleProductAction, dll.)
// Pastikan bagian ini juga memanggil loadProductsAndRender() setelah setiap operasi CRUD.
