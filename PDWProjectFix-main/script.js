// cite: PDWProjectFix-main/script.js
// File: script.js
document.addEventListener("DOMContentLoaded", function () {
  const loginModalEl = document.getElementById("loginModal");
  const loginModal = loginModalEl ? new bootstrap.Modal(loginModalEl) : null;
  let productsCache = []; // Cache untuk menyimpan data produk
  let sessionData = {}; // Variabel untuk menyimpan data sesi

  // --- FUNGSI UTAMA ---

  // Mengambil data produk dari API
  async function fetchProducts() {
    try {
      const response = await fetch("api/get_products.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const products = await response.json();
      productsCache = Array.isArray(products) ? products : []; // Simpan ke cache jika data valid
      return productsCache;
    } catch (error) {
      console.error("Gagal memuat produk:", error);
      // Tampilkan error di halaman publik jika ada masalah
      const mainContent = document.querySelector(".main-content");
      if (mainContent)
        mainContent.innerHTML = `<p class="text-center text-danger">Gagal memuat produk. Pastikan server backend berjalan dan API sudah benar.</p>`;
      return [];
    }
  }

  // Merender produk ke halaman publik
  function renderPublicProducts(products) {
    const grids = {
      1: document.getElementById("public-product-grid-1"),
      2: document.getElementById("public-product-grid-2"),
      3: document.getElementById("public-product-grid-3"),
    };
    // Kosongkan semua grid
    Object.values(grids).forEach((grid) => {
      if (grid) grid.innerHTML = "";
    });

    products.forEach((product) => {
      const productCardHTML = `
                <div class="col">
                    <div class="product-card" data-product-id="${product.id}">
                        <div class="img-container">
                            <img src="${product.imageUrl}" alt="${
        product.name
      }" onerror="this.onerror=null;this.src='https://placehold.co/200x200?text=Error';">
                        </div>
                        <h3>${product.name}</h3>
                        <p>$${parseFloat(product.price).toFixed(2)}</p>
                        <div>
                            ${
                              product.soldOut
                                ? '<span class="badge sold-out">SOLD OUT</span>'
                                : '<span class="badge pre-order me-1" role="button">PRE-ORDER</span>'
                            }
                        </div>
                    </div>
                </div>`;

      if (grids[product.category]) {
        grids[product.category].innerHTML += productCardHTML;
      }
    });

    attachPreOrderListeners(); // Pasang event listener setelah render
  }

  // Merender daftar produk di panel admin
  function renderAdminList(products) {
    const adminProductList = document.getElementById("admin-product-list");
    if (!adminProductList) return;
    adminProductList.innerHTML = "";

    products.forEach((product) => {
      const adminListItemHTML = `
                <div class="list-group-item d-flex justify-content-between align-items-center admin-product-item" data-id="${
                  product.id
                }">
                    <div>
                        <img src="${
                          product.imageUrl
                        }" width="40" class="me-3 rounded">
                        <span>${product.name} - $${parseFloat(
        product.price
      ).toFixed(2)}</span>
                        ${
                          product.soldOut
                            ? '<span class="badge bg-danger ms-2">Sold Out</span>'
                            : ""
                        }
                    </div>
                    <div class="admin-item-actions">
                        <button class="btn btn-sm btn-warning edit-btn">Edit</button>
                        <button class="btn btn-sm btn-danger delete-btn ms-2">Delete</button>
                    </div>
                </div>`;
      adminProductList.innerHTML += adminListItemHTML;
    });

    attachAdminActionListeners(); // Pasang event listener setelah render
  }

  // --- FUNGSI LOGIN & UI ---

  async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const loginMessage = document.getElementById("login-message");
    loginMessage.textContent = ""; // Kosongkan pesan error

    try {
      const response = await fetch("API/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: username, password: password }),
      });

      const result = await response.json();

      if (result.success) {
        // Jika login berhasil, muat ulang halaman.
        // Sesi PHP akan menangani status login.
        window.location.reload();
      } else {
        loginMessage.textContent = result.error || "Terjadi kesalahan.";
      }
    } catch (error) {
      console.error("Error saat login:", error);
      loginMessage.textContent = "Tidak dapat terhubung ke server.";
    }
  }

  async function logoutUser() {
    await fetch("api/logout.php");
    window.location.reload(); // Muat ulang halaman setelah sesi dihancurkan
  }

  function updateNavAndPanelVisibility(sessionData) {
    const isLoggedIn = sessionData.loggedin === true;
    const userType = sessionData.role;

    document.getElementById("login-item").style.display = isLoggedIn
      ? "none"
      : "block";
    document.getElementById("account-item").style.display = isLoggedIn
      ? "block"
      : "none";
    document.getElementById("logout-item").style.display = isLoggedIn
      ? "block"
      : "none";

    const adminPanel = document.getElementById("admin-panel");
    if (adminPanel) {
      adminPanel.style.display =
        isLoggedIn && userType === "admin" ? "block" : "none";
    }

    if (isLoggedIn) {
      const username = sessionData.username;
      document.getElementById("account-btn").textContent = `Hi, ${username}`;
    }
  }

  // --- EVENT LISTENERS ---

  function attachPreOrderListeners() {
    document.querySelectorAll(".badge.pre-order").forEach((button) => {
      button.addEventListener("click", function () {
        // 1. Cek jika pengguna belum login
        if (!sessionData.loggedin) {
          alert("Anda harus login terlebih dahulu untuk melakukan pre-order.");
          loginModal.show();
          return;
        }

        // 2. Cek jika pengguna adalah admin
        if (sessionData.role === "admin") {
          alert(
            "Admin tidak dapat melakukan pre-order. Silakan gunakan akun user."
          );
          return;
        }

        // 3. Jika pengguna adalah 'user', lanjutkan ke WhatsApp
        if (sessionData.role === "user") {
          const card = this.closest(".product-card");
          const productName = card.querySelector("h3").textContent;
          const productPrice = card.querySelector("p").textContent;
          const message = `Halo, saya ingin pre-order:\n\nProduk: ${productName}\nHarga: ${productPrice}\n\nTerima kasih!`;
          const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(
            message
          )}`; // GANTI NOMOR WA
          window.open(whatsappUrl, "_blank");
        }
      });
    });
  }

  function attachAdminActionListeners() {
    // Edit button
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const item = this.closest(".list-group-item");
        const product = productsCache.find((p) => p.id == item.dataset.id);
        if (product) {
          document.getElementById("form-title").textContent = "Edit Produk";
          document.getElementById("product-id").value = product.id;
          document.getElementById("product-action").value = "update";
          document.getElementById("product-name").value = product.name;
          document.getElementById("product-price").value = product.price;
          document.getElementById("product-image").value = product.imageUrl;
          document.getElementById("product-category").value = product.category;
          document.getElementById("product-soldout").checked = product.soldOut;
          document.getElementById("save-product-btn").textContent =
            "Update Produk";
          document.getElementById("cancel-edit-btn").style.display =
            "inline-block";
          document
            .getElementById("admin-panel")
            .scrollIntoView({ behavior: "smooth" });
        }
      });
    });

    // Delete button
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async function () {
        if (confirm("Anda yakin ingin menghapus produk ini?")) {
          const item = this.closest(".list-group-item");
          const productId = item.dataset.id;
          const formData = new FormData();
          formData.append("action", "delete");
          formData.append("id", productId);

          const response = await fetch("api/handle_product.php", {
            method: "POST",
            body: formData,
          });
          const result = await response.json();
          alert(result.message || result.error);
          if (result.success) {
            initializeApp(); // Refresh data
          }
        }
      });
    });
  }

  // Form submission for Create/Update
  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", async function (e) {
      e.preventDefault();
      const formData = new FormData(this);

      const response = await fetch("api/handle_product.php", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      alert(result.message || result.error);

      if (result.success) {
        resetProductForm();
        initializeApp(); // Refresh all data
      }
    });
  }

  // Cancel edit
  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", resetProductForm);
  }

  function resetProductForm() {
    document.getElementById("form-title").textContent = "Tambah Produk Baru";
    productForm.reset();
    document.getElementById("product-id").value = "";
    document.getElementById("product-action").value = "create";
    document.getElementById("save-product-btn").textContent = "Tambah Produk";
    cancelEditBtn.style.display = "none";
  }

  // --- INISIALISASI ---

  async function initializeApp() {
    // 1. Cek status sesi dari server
    const sessionResponse = await fetch("API/check_session.php");
    sessionData = await sessionResponse.json(); // Mengisi variabel global

    // 2. Perbarui tampilan berdasarkan data sesi
    updateNavAndPanelVisibility(sessionData);

    // 3. Muat produk
    const products = await fetchProducts();
    if (products.length > 0) {
      renderPublicProducts(products);
      // Tampilkan daftar admin HANYA jika login sebagai admin
      if (sessionData.loggedin && sessionData.role === "admin") {
        renderAdminList(products);
      }
    }
  }

  // Setup event listeners
  const loginForm = document.getElementById("loginForm");
  if (loginForm) loginForm.addEventListener("submit", handleLogin);

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) logoutBtn.addEventListener("click", logoutUser);

  // Jalankan aplikasi
  initializeApp();
});
