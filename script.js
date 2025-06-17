document.addEventListener("DOMContentLoaded", function () {
  // Inisialisasi Modal Bootstrap
  const loginPopupEl = document.getElementById("loginPopup");
  const loginPopup = loginPopupEl ? new bootstrap.Modal(loginPopupEl) : null;

  const adminLoginPopupEl = document.getElementById("adminLoginPopup");
  const adminLoginPopup = adminLoginPopupEl
    ? new bootstrap.Modal(adminLoginPopupEl)
    : null;

  // ===================================================================
  // SUMBER DATA PRODUK (MANUAL / HARDCODED)
  // Semua data produk sekarang disimpan langsung di sini, di dalam kode.
  // ===================================================================
  const initialProductData = [
    {
      id: 1,
      name: "Club Athleisure Halfzip Sweatshirt",
      price: "$60.00",
      imageUrl: "assets/image copy.png",
      category: 1,
      soldOut: false,
    },
    {
      id: 2,
      name: "Club Athleisure Sweatshorts",
      price: "$60.00",
      imageUrl: "assets/image.png",
      category: 1,
      soldOut: false,
    },
    {
      id: 3,
      name: "Club Athleisure Classic Crew Socks",
      price: "$60.00",
      imageUrl: "assets/kaoskaki.png",
      category: 1,
      soldOut: false,
    },
    {
      id: 4,
      name: "Reality Club - Sunny Days T-shirt",
      price: "$100.00",
      imageUrl: "assets/sunnydays.png",
      category: 1,
      soldOut: true,
    },
    {
      id: 5,
      name: "Reality Club – Sunny Days Keychain",
      price: "$60.00",
      imageUrl: "assets/keychain.png",
      category: 2,
      soldOut: false,
    },
    {
      id: 6,
      name: "CLUB Red Silk Bandana",
      price: "$60.00",
      imageUrl: "assets/bandana.png",
      category: 2,
      soldOut: false,
    },
    {
      id: 7,
      name: "Reality Club - Lovestruck Premium Canvas Totebag",
      price: "$60.00",
      imageUrl: "assets/totebag.png",
      category: 2,
      soldOut: false,
    },
    {
      id: 8,
      name: "Reality Club - Black Logo Electronic Card",
      price: "$100.00",
      imageUrl: "assets/card.png",
      category: 2,
      soldOut: true,
    },
    {
      id: 9,
      name: "Reality Club 9th Anniversary Away Jersey",
      price: "$60.00",
      imageUrl: "assets/jersey.png",
      category: 3,
      soldOut: false,
    },
    {
      id: 10,
      name: "Reality Club Not Today Journal",
      price: "$60.00",
      imageUrl: "assets/journal.png",
      category: 3,
      soldOut: false,
    },
    {
      id: 11,
      name: "Reality Club - Lovestruck Limited Enamel Pin",
      price: "$60.00",
      imageUrl: "assets/pin.png",
      category: 3,
      soldOut: false,
    },
    {
      id: 12,
      name: "Reality Club - Am I Bothering You? Stainless Steel Mug",
      price: "$100.00",
      imageUrl: "assets/mug.png",
      category: 3,
      soldOut: true,
    },
    {
      id: 13,
      name: "Faiz Photocard",
      price: "$20.00",
      imageUrl:
        "https://i.pinimg.com/736x/fd/c0/86/fdc0866a1174683bcd42ac1704d2fd82.jpg",
      category: 1,
      soldOut: false,
    },
  ];

  // Variabel yang akan digunakan untuk manipulasi data (copy dari data awal)
  let products = [];

  // ===================================================================
  // FUNGSI UNTUK MEMUAT DATA (SEKARANG HANYA MENYALIN DARI VARIABEL DI ATAS)
  // ===================================================================
  function loadProducts() {
    // Tidak perlu 'fetch', cukup salin data dari 'initialProductData'
    // Menggunakan spread operator (...) untuk membuat salinan, bukan referensi langsung.
    products = [...initialProductData];
    renderAllProducts();
  }

  // ===================================================================
  // SEMUA FUNGSI LAINNYA TETAP SAMA KARENA MEREKA SUDAH BEKERJA
  // DENGAN VARIABEL LOKAL 'products'
  // ===================================================================

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
          <div class="list-group-item d-flex justify-content-between align-items-center admin-product-item" data-id="${product.id}">
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

  const productForm = document.getElementById("product-form");
  if (productForm) {
    productForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const id = document.getElementById("product-id").value;
      const name = document.getElementById("product-name").value;
      const price = document.getElementById("product-price").value;
      const imageUrl = document.getElementById("product-image").value;

      if (id) {
        const productIndex = products.findIndex((p) => p.id == id);
        if (productIndex > -1) {
          products[productIndex] = {
            ...products[productIndex],
            name,
            price,
            imageUrl,
          };
        }
      } else {
        const newId =
          products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
        products.push({
          id: newId,
          name,
          price,
          imageUrl,
          category: 1,
          soldOut: false,
        });
      }

      renderAllProducts();
      productForm.reset();
      document.getElementById("product-id").value = "";
      document.getElementById("save-product-btn").textContent = "Tambah Produk";
      document.getElementById("cancel-edit-btn").style.display = "none";
    });
  }

  function attachAdminEventListeners() {
    document.querySelectorAll(".edit-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        const item = this.closest(".admin-product-item");
        const product = products.find((p) => p.id == item.dataset.id);

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
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        if (confirm("Anda yakin ingin menghapus produk ini?")) {
          const item = this.closest(".admin-product-item");
          products = products.filter((p) => p.id != item.dataset.id);
          renderAllProducts();
        }
      });
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

  // Tombol ini menjadi sangat penting untuk menyimpan perubahan secara manual
  const exportBtn = document.getElementById("export-json-btn");
  if (exportBtn) {
    exportBtn.addEventListener("click", function () {
      // JSON.stringify(products, null, 2) membuat format JSON rapi dan mudah dibaca
      const jsonString = JSON.stringify(products, null, 2);
      console.log(jsonString);
      alert(
        "Data produk terbaru sudah dicetak di Console (Tekan F12).\n\nSalin teks tersebut dan tempel ke dalam variabel 'initialProductData' di file script.js untuk menyimpan perubahan secara permanen."
      );
    });
  }

  // (Sisa kode untuk login, navigasi, dll. tidak perlu diubah)
  function updateNavVisibility() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userType = localStorage.getItem("userType");
    const loggedInUser = localStorage.getItem("loggedInUser");

    const loginItem = document.getElementById("login-item");
    const adminLoginItem = document.getElementById("admin-login-item");
    const accountItem = document.getElementById("account-item");
    const logoutItem = document.getElementById("logout-item");
    const adminPanel = document.getElementById("admin-panel");

    loginItem.style.display = "none";
    adminLoginItem.style.display = "none";
    accountItem.style.display = "none";
    logoutItem.style.display = "none";
    if (adminPanel) adminPanel.style.display = "none";

    if (isLoggedIn === "true") {
      logoutItem.style.display = "block";
      accountItem.style.display = "block";
      if (userType === "user") {
        document.getElementById(
          "account-btn"
        ).textContent = `Hi, ${loggedInUser}`;
      } else if (userType === "admin") {
        document.getElementById(
          "account-btn"
        ).textContent = `Hi, Admin ${loggedInUser}`;
        if (adminPanel) adminPanel.style.display = "block";
      }
    } else {
      loginItem.style.display = "block";
      adminLoginItem.style.display = "block";
    }
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const loginMessage = document.getElementById("login-message");

      if (username === "user" && password === "password123") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("userType", "user");
        updateNavVisibility();
        loginPopup.hide();
      } else {
        loginMessage.textContent = "Username atau password salah.";
        loginMessage.className = "mt-3 text-danger";
      }
    });
  }

  const adminLoginForm = document.getElementById("adminLoginForm");
  if (adminLoginForm) {
    adminLoginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const username = document.getElementById("admin-username").value;
      const password = document.getElementById("admin-password").value;
      const adminLoginMessage = document.getElementById("admin-login-message");

      if (username === "admin" && password === "admin123") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", username);
        localStorage.setItem("userType", "admin");
        updateNavVisibility();
        renderAllProducts();
        adminLoginPopup.hide();
      } else {
        adminLoginMessage.textContent = "Username atau password admin salah.";
        adminLoginMessage.className = "mt-3 text-danger";
      }
    });
  }

  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loggedInUser");
      localStorage.removeItem("userType");
      updateNavVisibility();
      alert("Anda telah berhasil logout.");
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
            const message = `Halo Admin Reality Club, saya ingin pre-order produk berikut:\n\nNama: ${productName}\nHarga: ${productPrice}\n\nMohon informasi lebih lanjut. Terima kasih!`;
            const whatsappUrl = `https://wa.me/6285225705041?text=${encodeURIComponent(
              message
            )}`;
            window.location.href = whatsappUrl;
          } else {
            alert(
              "Anda harus login terlebih dahulu untuk melakukan pre-order."
            );
            loginPopup.show();
          }
        });
      }
    });
  }

  [loginPopupEl, adminLoginPopupEl].forEach((modalEl) => {
    if (modalEl) {
      modalEl.addEventListener("show.bs.modal", (event) => {
        const form = event.target.querySelector("form");
        if (form) form.reset();
        const messageEl = event.target.querySelector('[id$="-message"]');
        if (messageEl) messageEl.textContent = "";
      });
    }
  });

  // INISIALISASI HALAMAN
  function initializeApp() {
    loadProducts();
    updateNavVisibility();
  }

  initializeApp();
});
