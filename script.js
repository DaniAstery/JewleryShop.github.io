let selectedItems = [];

document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // GLOBALS
  // ==========================
  const BACKEND_URL = "https://backend-production-b183.up.railway.app";
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const adminToken = localStorage.getItem("adminToken");

  // ==========================
  // SHOP ELEMENTS
  // ==========================
  const productGrid = document.querySelector(".product-grid");
  const cartBtn = document.getElementById("cart-btn");
  const cartModal = document.getElementById("checkout-modal");
  const closeCart = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  if (!productGrid) return; // page safety

  // ==========================
  // PRODUCTS
  // ==========================
  const products = [
    { id: 1, name: "Classic Dress", price: 49.99, image: "images/placeholder2.png", video: `${BACKEND_URL}/videos/OP-0002-4-7.00 Grams.mp4` },
    { id: 2, name: "Stylish Heels", price: 59.99, image: "images/headphone2.png", video: `${BACKEND_URL}/videos/OP-0002-4-7.00 Grams.mp4` },
  ];

  // ==========================
  // INTERSECTION OBSERVER
  // ==========================
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      const img = video.previousElementSibling;

      if (entry.isIntersecting) {
        video.play().catch(() => {});
        video.style.opacity = 1;
        img.style.opacity = 0;
      } else {
        video.pause();
        video.currentTime = 0;
        video.style.opacity = 0;
        img.style.opacity = 1;
      }
    });
  }, { threshold: 0.5 });

  // ==========================
  // RENDER PRODUCTS
  // ==========================
  function renderProducts() {
    productGrid.innerHTML = "";

    products.forEach(product => {
      const div = document.createElement("div");
      div.className = "product-card";

      div.innerHTML = `
        <div class="media-wrapper">
          <img class="product-img" src="${product.image}">
          <video class="product-video" muted loop playsinline preload="metadata">
            <source src="${product.video}">
          </video>
        </div>
        <h3>${product.name}</h3>
        <p>$${product.price}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;

      const video = div.querySelector("video");
      observer.observe(video);

      div.addEventListener("mouseenter", () => video.play().catch(() => {}));
      div.addEventListener("mouseleave", () => {
        video.pause();
        video.currentTime = 0;
      });

      productGrid.appendChild(div);
    });
  }

  // ==========================
  // CART
  // ==========================
  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
      const li = document.createElement("li");
      li.textContent = `${item.name} × ${item.quantity}`;
      cartItemsContainer.appendChild(li);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((s, i) => s + i.quantity, 0);
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  productGrid.addEventListener("click", e => {
    if (!e.target.classList.contains("add-to-cart")) return;
    const id = Number(e.target.dataset.id);
    const product = products.find(p => p.id === id);
    if (!product) return;

    const existing = cart.find(i => i.id === id);
    existing ? existing.quantity++ : cart.push({ ...product, quantity: 1 });

    updateCart();
    alert("Added to cart");
  });

  cartBtn?.addEventListener("click", () => cartModal.classList.remove("hidden"));
  closeCart?.addEventListener("click", () => cartModal.classList.add("hidden"));

  // ==========================
  // OTP VERIFICATION (ONCE)
  // ==========================
  document.getElementById("Check-otp")?.addEventListener("click", async () => {
    const email = document.getElementById("cust-email").value;
    const otp = document.getElementById("cust-otp").value;

    const res = await fetch(`${BACKEND_URL}/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: otp })
    });

    if (res.ok) alert("Email verified");
    else alert("Invalid OTP");
  });

  // ==========================
  // ADMIN
  // ==========================
  async function fetchOrders() {
    if (!adminToken) return;

    const res = await fetch(`${BACKEND_URL}/api/orders`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    if (!res.ok) return;
    const orders = await res.json();
    console.log("Orders:", orders);
  }

  // ==========================
  // INIT
  // ==========================
  renderProducts();
  updateCart();
  fetchOrders();
});
