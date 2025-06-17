document.addEventListener("DOMContentLoaded", function () {
  const loginModalEl = document.getElementById("loginModal");
  const loginModal = loginModalEl ? new bootstrap.Modal(loginModalEl) : null;

  let products = [];

  async function loadProducts() {
    try {
      const response = await fetch("api/get_products.php");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      products = await response.json();
      renderAllProducts();
    } catch (error) {
      console.error("Tidak dapat memuat data produk dari server:", error);
      const mainContent = document.querySelector(".main-content");
      if (mainContent)
        mainContent.innerHTML =
          '<p class="text-center text-danger">Gagal memuat produk. Pastikan server backend (Laragon) berjalan dan API sudah benar.</p>';
    }
  }

  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const id = document.getElementById("product-id").value;
      const isUpdating = id !== "";

      const formData = new FormData();
      formData.append("action", isUpdating ? "update" : "create");
      formData.append("name", document.getElementById("product-name").value);
      formData.append("price", document.getElementById("product-price").value);
      formData.append(
        "imageUrl",
        document.getElementById("product-image").value
      );
      if (isUpdating) {
        formData.append("id", id);
      }

      try {
        const response = await fetch("api/handle_product.php", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();

        if (result.success) {
          alert(result.message);
          loadProducts(); // Muat ulang data dari database setelah berhasil
          productForm.reset();
          document.getElementById("product-id").value = "";
          document.getElementById("save-product-btn").textContent =
            "Tambah Produk";
          document.getElementById("cancel-edit-btn").style.display = "none";
        } else {
          alert("Error: " + result.error);
        }
      } catch (error) {
        console.error("Error saat mengirim data:", error);
        alert("Terjadi kesalahan saat berkomunikasi dengan server.");
      }
    });
  }

  function attachAdminEventListeners() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const item = this.closest(".list-group-item");
        const product = products.find((p) => p.id == item.dataset.id);
        if (product) {
          document.getElementById("product-id").value = product.id;
          document.getElementById("product-name").value = product.name;
          document.getElementById("product-price").value = product.price;
          document.getElementById("product-image").value = product.imageUrl;
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

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async function () {
        if (confirm("Anda yakin ingin menghapus produk ini?")) {
          const item = this.closest(".list-group-item");
          const productId = item.dataset.id;

          const formData = new FormData();
          formData.append("action", "delete");
          formData.append("id", productId);

          try {
            const response = await fetch("api/handle_product.php", {
              method: "POST",
              body: formData,
            });
            const result = await response.json();
            if (result.success) {
              alert(result.message);
              loadProducts(); // Muat ulang data setelah berhasil hapus
            } else {
              alert("Error: " + result.error);
            }
          } catch (error) {
            console.error("Error saat menghapus:", error);
            alert("Gagal menghapus produk.");
          }
        }
      });
    });
  }

  function renderAllProducts() {
    const grids = {
      1: document.getElementById("public-product-grid-1"),
      2: document.getElementById("public-product-grid-2"),
      3: document.getElementById("public-product-grid-3"),
    };
    const adminProductList = document.getElementById("admin-product-list");

    Object.values(grids).forEach((grid) => {
      if (grid) grid.innerHTML = "";
    });
    if (adminProductList) adminProductList.innerHTML = "";

    products.forEach((product) => {
      const productCol = document.createElement("div");
      productCol.className = "col";
      productCol.innerHTML = `
        <div class="product-card" data-product-name="${
          product.name
        }" data-product-price="${product.price}">
          <div class="img-container"><img src="${product.imageUrl}" alt="${
        product.name
      }" onerror="this.onerror=null;this.src='https://placehold.co/200x200/0a0a0a/ffffff?text=Image+Error';"></div>
          <h3>${product.name}</h3><p>${product.price}</p>
          <div>
            ${
              !product.soldOut
                ? '<span class="badge pre-order me-1">PRE-ORDER</span>'
                : ""
            }
            ${
              product.soldOut
                ? '<span class="badge sold-out">SOLD OUT</span>'
                : ""
            }
          </div>
        </div>`;
      if (grids[product.category])
        grids[product.category].appendChild(productCol);

      if (adminProductList) {
        const adminListItemHTML = `
          <div class="list-group-item d-flex justify-content-between align-items-center" data-id="${product.id}">
            <span>${product.name} (${product.price})</span>
            <div class="admin-item-actions">
              <button class="btn btn-sm edit-btn">Edit</button>
              <button class="btn btn-sm delete-btn ms-2">Delete</button>
            </div>
          </div>`;
        adminProductList.innerHTML += adminListItemHTML;
      }
    });

    attachPublicEventListeners();
    if (localStorage.getItem("userType") === "admin") {
      attachAdminEventListeners();
    }
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value.trim();
      const password = document.getElementById("password").value;
      const loginMessage = document.getElementById("login-message");

      if (username === "admin" && password === "admin123") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("userType", "admin");
        updateNavVisibility();
        loginModal.hide();
      } else if (username === "user" && password === "password123") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("userType", "user");
        updateNavVisibility();
        loginModal.hide();
      } else {
        loginMessage.textContent = "Username atau password salah.";
        loginMessage.className = "mt-3 text-danger";
      }
    });
  }

  function updateNavVisibility() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userType = localStorage.getItem("userType");
    const loggedInUser = localStorage.getItem("loggedInUser");

    const loginItem = document.getElementById("login-item");
    const accountItem = document.getElementById("account-item");
    const logoutItem = document.getElementById("logout-item");
    const adminPanel = document.getElementById("admin-panel");

    if (isLoggedIn === "true") {
      loginItem.style.display = "none";
      accountItem.style.display = "block";
      logoutItem.style.display = "block";

      if (userType === "admin") {
        document.getElementById(
          "account-btn"
        ).textContent = `Hi, Admin ${loggedInUser}`;
        if (adminPanel) adminPanel.style.display = "block";
      } else {
        document.getElementById(
          "account-btn"
        ).textContent = `Hi, ${loggedInUser}`;
        if (adminPanel) adminPanel.style.display = "none";
      }
    } else {
      loginItem.style.display = "block";
      accountItem.style.display = "none";
      logoutItem.style.display = "none";
      if (adminPanel) adminPanel.style.display = "none";
    }
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.clear();
      updateNavVisibility();
      window.location.reload();
    });
  }

  function attachPublicEventListeners() {
    document.querySelectorAll(".badge.pre-order").forEach((button) => {
      if (!button.closest(".product-card").querySelector(".badge.sold-out")) {
        button.addEventListener("click", function () {
          if (localStorage.getItem("isLoggedIn") === "true") {
            const productCard = this.closest(".product-card");
            const productName = productCard.getAttribute("data-product-name");
            const productPrice = productCard.getAttribute("data-product-price");
            const message = `Halo, saya ingin pre-order:\n\nProduk: ${productName}\nHarga: ${productPrice}\n\nTerima kasih!`;
            const whatsappUrl = `https://wa.me/6285225705041?text=${encodeURIComponent(
              message
            )}`;
            window.open(whatsappUrl, "_blank");
          } else {
            alert(
              "Anda harus login terlebih dahulu untuk melakukan pre-order."
            );
            loginModal.show();
          }
        });
      }
    });
  }

  if (loginModalEl) {
    loginModalEl.addEventListener("show.bs.modal", (event) => {
      const form = event.target.querySelector("form");
      if (form) form.reset();
      const messageEl = event.target.querySelector('[id$="-message"]');
      if (messageEl) messageEl.textContent = "";
    });
  }

  const cancelEditBtn = document.getElementById("cancel-edit-btn");
  if (cancelEditBtn) {
    cancelEditBtn.addEventListener("click", function () {
      productForm.reset();
      document.getElementById("product-id").value = "";
      document.getElementById("save-product-btn").textContent = "Tambah Produk";
      this.style.display = "none";
    });
  }

  function initializeApp() {
    updateNavVisibility();
    loadProducts();
  }

  initializeApp();
});
