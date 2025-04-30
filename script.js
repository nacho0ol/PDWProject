document.addEventListener("DOMContentLoaded", function () {
  // Variabel untuk popup
  const popup = document.getElementById("preOrderPopup");
  const closeBtn = document.querySelector(".popup-close");
  const popupProductImage = document.querySelector(".popup-product-image");
  const popupProductName = document.getElementById("popupProductName");
  const popupProductPrice = document.getElementById("popupProductPrice");
  const whatsappBtn = document.getElementById("whatsappBtn");

  // Nomor WhatsApp admin (ganti dengan nomor WhatsApp sebenarnya)
  const adminWhatsapp = "6285225705041"; // Ganti dengan nomor WhatsApp admin

  // Event listener untuk semua tombol pre-order
  const preOrderButtons = document.querySelectorAll(".badge.pre-order");

  preOrderButtons.forEach((button) => {
    // Hanya tambahkan event listener pada tombol yang tidak dalam produk sold out
    if (!button.parentElement.querySelector(".badge.sold-out")) {
      button.addEventListener("click", function () {
        // Ambil data produk dari parent element (product-card)
        const productCard = this.closest(".product-card");
        const productName = productCard.getAttribute("data-product-name");
        const productPrice = productCard.getAttribute("data-product-price");
        const productImage = productCard.querySelector("img").src;

        // Isi popup dengan data produk
        popupProductImage.src = productImage;
        popupProductName.textContent = productName;
        popupProductPrice.textContent = productPrice;

        // Buat pesan WhatsApp dengan data produk
        const message = `Halo Admin Reality Club, saya ingin pre-order produk berikut:\n\nNama: ${productName}\nHarga: ${productPrice}\n\nMohon informasi lebih lanjut. Terima kasih!`;

        // Update link WhatsApp
        whatsappBtn.href = `https://wa.me/${adminWhatsapp}?text=${encodeURIComponent(
          message
        )}`;

        // Tampilkan popup
        popup.classList.add("active");

        // Tambahkan class overflow-hidden ke body untuk mencegah scrolling
        document.body.style.overflow = "hidden";
      });
    }
  });

  // Tutup popup saat klik tombol close
  closeBtn.addEventListener("click", function () {
    popup.classList.remove("active");
    document.body.style.overflow = "";
  });

  // Tutup popup saat klik di luar popup content
  popup.addEventListener("click", function (e) {
    if (e.target === popup) {
      popup.classList.remove("active");
      document.body.style.overflow = "";
    }
  });

  // Tutup popup saat tekan ESC
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && popup.classList.contains("active")) {
      popup.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});
