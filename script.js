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
