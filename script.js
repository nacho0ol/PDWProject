document.addEventListener("DOMContentLoaded", function () {
  const preOrderPopup = document.getElementById("preOrderPopup");
  const preOrderCloseBtn = document.getElementById("preOrderPopupClose");
  const popupProductImage = document.querySelector(".popup-product-image");
  const popupProductName = document.getElementById("popupProductName");
  const popupProductPrice = document.getElementById("popupProductPrice");
  const whatsappBtn = document.getElementById("whatsappBtn");
  const adminWhatsapp = "6285225705041";
  const preOrderButtons = document.querySelectorAll(".badge.pre-order");

  preOrderButtons.forEach((button) => {
    if (!button.parentElement.querySelector(".badge.sold-out")) {
      button.addEventListener("click", function () {
        const productCard = this.closest(".product-card");
        const productName = productCard.getAttribute("data-product-name");
        const productPrice = productCard.getAttribute("data-product-price");
        const productImageSrc = productCard.querySelector("img").src;

        popupProductImage.src = productImageSrc;
        popupProductName.textContent = productName;
        popupProductPrice.textContent = productPrice;

        const message = `Halo Admin Reality Club, saya ingin pre-order produk berikut:\n\nNama: ${productName}\nHarga: ${productPrice}\n\nMohon informasi lebih lanjut. Terima kasih!`;
        whatsappBtn.href = `https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(
          message
        )}`;

        if (preOrderPopup) {
          preOrderPopup.classList.add("active");
          document.body.style.overflow = "hidden";
        }
      });
    }
  });

  if (preOrderCloseBtn && preOrderPopup) {
    preOrderCloseBtn.addEventListener("click", function () {
      preOrderPopup.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  if (preOrderPopup) {
    preOrderPopup.addEventListener("click", function (e) {
      if (e.target === preOrderPopup) {
        preOrderPopup.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  const loginPopup = document.getElementById("loginPopup");
  const loginBtn = document.getElementById("login-btn");
  const loginPopupCloseBtn = document.getElementById("loginPopupClose");
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("login-message");

  const loginItem = document.getElementById("login-item");
  const accountItem = document.getElementById("account-item");
  const logoutItem = document.getElementById("logout-item");
  const logoutBtn = document.getElementById("logout-btn");
  const accountBtn = document.getElementById("account-btn");
  function updateNavVisibility() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const loggedInUser = localStorage.getItem("loggedInUser");

    if (isLoggedIn === "true" && loggedInUser) {
      if (loginItem) loginItem.style.display = "none";
      if (accountItem) accountItem.style.display = "block";
      if (logoutItem) logoutItem.style.display = "block";
      if (accountBtn) accountBtn.textContent = `Hi, ${loggedInUser}`;
    } else {
      if (loginItem) loginItem.style.display = "block";
      if (accountItem) accountItem.style.display = "none";
      if (logoutItem) logoutItem.style.display = "none";
    }
  }

  if (loginBtn && loginPopup) {
    loginBtn.addEventListener("click", function (e) {
      e.preventDefault();
      loginPopup.classList.add("active");
      document.body.style.overflow = "hidden";
      if (loginMessage) loginMessage.textContent = "";
      if (loginForm) loginForm.reset();
    });
  }

  if (loginPopupCloseBtn && loginPopup) {
    loginPopupCloseBtn.addEventListener("click", function () {
      loginPopup.classList.remove("active");
      document.body.style.overflow = "";
    });
  }

  if (loginPopup) {
    loginPopup.addEventListener("click", function (e) {
      if (e.target === loginPopup) {
        loginPopup.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const usernameInput = document.getElementById("username");
      const passwordInput = document.getElementById("password");
      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      if (username === "user" && password === "password123") {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("loggedInUser", username);
        updateNavVisibility();
        if (loginPopup) loginPopup.classList.remove("active");
        document.body.style.overflow = "";
        if (loginMessage) {
          loginMessage.textContent = "Login berhasil! Selamat datang.";
          loginMessage.style.color = "var(--neon-accent)";
        }
        setTimeout(() => {
          if (loginMessage) loginMessage.textContent = "";
        }, 3000);
      } else if (username === "" || password === "") {
        if (loginMessage) {
          loginMessage.textContent =
            "Username dan password tidak boleh kosong.";
          loginMessage.style.color = "red";
        }
      } else {
        if (loginMessage) {
          loginMessage.textContent = "Username atau password salah.";
          loginMessage.style.color = "red";
        }
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("loggedInUser");
      updateNavVisibility();
      alert("Anda telah berhasil logout.");
    });
  }

  if (accountBtn) {
    accountBtn.addEventListener("click", function (e) {
      e.preventDefault();
      const user = localStorage.getItem("loggedInUser");
      alert(
        `Ini adalah halaman akun Anda, ${user}.\n(Fitur ini adalah placeholder dan belum diimplementasikan sepenuhnya)`
      );
    });
  }

  updateNavVisibility();

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (preOrderPopup && preOrderPopup.classList.contains("active")) {
        preOrderPopup.classList.remove("active");
        document.body.style.overflow = "";
      }
      if (loginPopup && loginPopup.classList.contains("active")) {
        loginPopup.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Variabel untuk menyimpan data produk yang sudah dimuat
  let products = [];

  // ===== FUNGSI UNTUK MEMUAT DATA PRODUK DARI JSON =====
  async function loadProducts() {
    try {
      // Menambahkan cache-busting query untuk memastikan file selalu baru
      const response = await fetch(`db.json?v=${new Date().getTime()}`); 
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      products = await response.json(); // Mengubah response menjadi objek JSON
      renderAllProducts(); // Setelah data dimuat, tampilkan semuanya
    } catch (error) {
      console.error("Tidak dapat memuat data produk:", error);
      const mainContent = document.querySelector('.main-content');
      if(mainContent) mainContent.innerHTML = '<p style="text-align: center; color: red;">Gagal memuat produk. Cek file db.json dan pastikan formatnya benar.</p>';
    }
  }

  // ===== FUNGSI RENDER & CRUD =====

  // READ: Menampilkan semua produk untuk publik dan admin
  function renderAllProducts() {
    const grids = {
        1: document.getElementById('public-product-grid-1'),
        2: document.getElementById('public-product-grid-2'),
        3: document.getElementById('public-product-grid-3')
    };
    const adminProductList = document.getElementById('admin-product-list');

    // Kosongkan semua kontainer
    Object.values(grids).forEach(grid => { if(grid) grid.innerHTML = '' });
    if(adminProductList) adminProductList.innerHTML = '';

    products.forEach(product => {
      // Render untuk halaman publik
      const productCardHTML = `
        <div class="product-card" data-product-name="${product.name}" data-product-price="${product.price}">
          <div class="img-container"><img src="${product.imageUrl}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/200x200/0a0a0a/ffffff?text=Image+Error';"></div>
          <h3>${product.name}</h3><p>${product.price}</p>
          ${!product.soldOut ? '<span class="badge pre-order">PRE-ORDER</span>' : ''}
          ${product.soldOut ? '<span class="badge sold-out">SOLD OUT</span>' : ''}
        </div>`;
      if (grids[product.category]) {
        grids[product.category].innerHTML += productCardHTML;
      }

      // Render untuk panel admin
       if(adminProductList) {
        const adminListItemHTML = `
            <div class="admin-product-item" data-id="${product.id}">
                <span>${product.name} (${product.price})</span>
                <div class="admin-item-actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            </div>`;
        adminProductList.innerHTML += adminListItemHTML;
      }
    });
    
    attachPublicEventListeners(); 
    if(localStorage.getItem('userType') === 'admin') {
      attachAdminEventListeners(); 
    }
  }

  // CREATE & UPDATE: Logika untuk form admin
  const productForm = document.getElementById('product-form');
  if(productForm) {
    productForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const id = document.getElementById('product-id').value;
      const name = document.getElementById('product-name').value;
      const price = document.getElementById('product-price').value;
      const imageUrl = document.getElementById('product-image').value;

      if (id) { // Mode UPDATE
        const productIndex = products.findIndex(p => p.id == id);
        if (productIndex > -1) {
            products[productIndex].name = name;
            products[productIndex].price = price;
            products[productIndex].imageUrl = imageUrl;
        }
      } else { // Mode CREATE
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({ id: newId, name, price, imageUrl, category: 1, soldOut: false }); 
      }
      
      renderAllProducts();
      productForm.reset();
      document.getElementById('product-id').value = '';
      document.getElementById('save-product-btn').textContent = 'Tambah Produk';
      document.getElementById('cancel-edit-btn').style.display = 'none';
    });
  }
  
  // Event listener untuk tombol Edit dan Delete
  function attachAdminEventListeners() {
      document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.admin-product-item');
            const product = products.find(p => p.id == item.dataset.id);
            document.getElementById('product-id').value = product.id;
            document.getElementById('product-name').value = product.name;
            document.getElementById('product-price').value = product.price;
            document.getElementById('product-image').value = product.imageUrl;
            document.getElementById('save-product-btn').textContent = 'Update Produk';
            document.getElementById('cancel-edit-btn').style.display = 'inline-block';
            document.getElementById('admin-panel').scrollIntoView({ behavior: 'smooth' });
        });
      });

      document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Anda yakin ingin menghapus produk ini?')) {
                const item = this.closest('.admin-product-item');
                products = products.filter(p => p.id != item.dataset.id); 
                renderAllProducts();
            }
        });
      });
  }

  // Tombol batal edit
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  if(cancelEditBtn) {
    cancelEditBtn.addEventListener('click', function() {
        productForm.reset();
        document.getElementById('product-id').value = '';
        document.getElementById('save-product-btn').textContent = 'Tambah Produk';
        this.style.display = 'none';
    });
  }
  
  // Tombol untuk ekspor/menyimpan JSON
  const exportBtn = document.getElementById('export-json-btn');
  if(exportBtn) {
      exportBtn.addEventListener('click', function() {
          const jsonString = JSON.stringify(products, null, 2);
          console.log(jsonString);
          alert('Data JSON terbaru sudah dicetak di console (Tekan F12). Salin teks tersebut dan timpa isi file db.json Anda.');
      });
  }


  // ===== LOGIKA LOGIN & NAVIGASI =====
  function updateNavVisibility() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userType = localStorage.getItem('userType');
    const loggedInUser = localStorage.getItem('loggedInUser');

    const loginItem = document.getElementById("login-item");
    const adminLoginItem = document.getElementById("admin-login-item");
    const accountItem = document.getElementById("account-item");
    const logoutItem = document.getElementById("logout-item");
    const adminPanel = document.getElementById("admin-panel");

    loginItem.style.display = 'none';
    adminLoginItem.style.display = 'none';
    accountItem.style.display = 'none';
    logoutItem.style.display = 'none';
    if(adminPanel) adminPanel.style.display = 'none';

    if (isLoggedIn === 'true') {
        logoutItem.style.display = 'block';
        if (userType === 'user') {
            accountItem.style.display = 'block';
            document.getElementById('account-btn').textContent = `Hi, ${loggedInUser}`;
        } else if (userType === 'admin') {
            accountItem.style.display = 'block';
            document.getElementById('account-btn').textContent = `Hi, Admin ${loggedInUser}`;
            if(adminPanel) adminPanel.style.display = 'block';
        }
    } else {
        loginItem.style.display = 'block';
        adminLoginItem.style.display = 'block';
    }
  }

  // --- Login User ---
  const loginPopup = document.getElementById("loginPopup");
  const loginBtn = document.getElementById("login-btn");
  const loginForm = document.getElementById("loginForm");
  if (loginBtn) {
    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (loginForm) loginForm.reset();
      const loginMessage = document.getElementById('login-message');
      if (loginMessage) loginMessage.textContent = '';
      loginPopup.classList.add('active');
    });
  }
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      if (username === 'user' && password === 'password123') {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('loggedInUser', username);
          localStorage.setItem('userType', 'user');
          updateNavVisibility();
          loginPopup.classList.remove('active');
      } else {
          document.getElementById('login-message').textContent = 'Username atau password salah.';
      }
    });
  }

  // --- Login Admin ---
  const adminLoginPopup = document.getElementById("adminLoginPopup");
  const adminLoginBtn = document.getElementById("admin-login-btn");
  const adminLoginForm = document.getElementById("adminLoginForm");
  if(adminLoginBtn) {
    adminLoginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if(adminLoginForm) adminLoginForm.reset();
      const adminLoginMessage = document.getElementById('admin-login-message');
      if(adminLoginMessage) adminLoginMessage.textContent = '';
      adminLoginPopup.classList.add('active');
    });
  }
  if(adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const username = document.getElementById("admin-username").value;
      const password = document.getElementById("admin-password").value;
      if (username === 'admin' && password === 'admin123') {
          localStorage.setItem('isLoggedIn', 'true');
          localStorage.setItem('loggedInUser', username);
          localStorage.setItem('userType', 'admin');
          updateNavVisibility();
          renderAllProducts();
          adminLoginPopup.classList.remove('active');
      } else {
          document.getElementById('admin-login-message').textContent = 'Username atau password admin salah.';
      }
    });
  }

  // --- Logout ---
  const logoutBtn = document.getElementById("logout-btn");
  if(logoutBtn) {
    logoutBtn.addEventListener('click', function(e) {
      e.preventDefault();
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('userType');
      updateNavVisibility();
    });
  }

  // ===== KODE EVENT LISTENER LAIN (Popups, dll.) =====
  function attachPublicEventListeners() {
    const preOrderPopup = document.getElementById("preOrderPopup");
    const whatsappBtn = document.getElementById("whatsappBtn");
    const adminWhatsapp = "6285225705041";
    document.querySelectorAll(".badge.pre-order").forEach((button) => {
        if (!button.parentElement.querySelector(".badge.sold-out")) {
          button.addEventListener("click", function () {
              const productCard = this.closest(".product-card");
              const productName = productCard.getAttribute("data-product-name");
              const productPrice = productCard.getAttribute("data-product-price");
              const productImageSrc = productCard.querySelector("img").src;

              if(preOrderPopup) {
                preOrderPopup.querySelector(".popup-product-image").src = productImageSrc;
                preOrderPopup.querySelector("#popupProductName").textContent = productName;
                preOrderPopup.querySelector("#popupProductPrice").textContent = productPrice;
                
                const message = `Halo Admin Reality Club, saya ingin pre-order produk berikut:\n\nNama: ${productName}\nHarga: ${productPrice}\n\nMohon informasi lebih lanjut. Terima kasih!`;
                if(whatsappBtn) whatsappBtn.href = `https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(message)}`;

                preOrderPopup.classList.add("active");
              }
          });
        }
    });
  }

  // Menutup semua popup
  document.querySelectorAll('.popup-close').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.popup-overlay').classList.remove('active');
    });
  });
  document.querySelectorAll('.popup-overlay').forEach(overlay => {
    overlay.addEventListener('click', function(e) {
        if(e.target === this) {
            this.classList.remove('active');
        }
    });
  });
  
  // ===== INISIALISASI HALAMAN =====
  function initializeApp() {
    loadProducts(); 
    updateNavVisibility(); 
  }

  initializeApp(); 
});

