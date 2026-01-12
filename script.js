let selectedItems = [];

document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // GLOBALS
  // ==========================
  const BACKEND_URL = "http://localhost:5001";
  let cart=[]
  cart = JSON.parse(localStorage.getItem("cart")) || [];
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
    { id: 1, name: "Classic Dress", price: 49.99, image: "images/placeholder2.png", video: `${BACKEND_URL}/videos/OP-000 1-4-6.01 Grams.mp4` },
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
    alert("Updating cart...");
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
  // ADMIN
  // ==========================
    async function fetchOrders() {
      const token = localStorage.getItem("adminToken");
      if (!token) return;

      try {
        const res = await fetch(`${BACKEND_URL}/api/orders`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("adminToken");
          window.location.href = "admin.html";
          return;
        }

        const orders = await res.json();
        renderOrders(orders);
        renderCompletedOrders(orders);

      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      }
    }

    function renderOrders(orders) {
        const tbody = document.querySelector("#ordersTable tbody");
        if (!tbody) return;

        tbody.innerHTML = "";

        orders.forEach(order => {
          if (order.paymentStatus !== "Pending") return;

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${order.customer?.id || "-"}</td>
            <td>${order.customer?.name || "-"}</td>
            <td>${order.customer?.email || "-"}</td>
            <td>${order.items?.name || "-"}</td>
            <td>${order.paymentStatus || "-"}</td>
            <td>${order.advance || "-"}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${new Date(order.date).toLocaleString()}</td>
           
            <td>
              <button class="view-proof-btn" data-id="${order._id}">View Proof</button>
              <button class="complete-btn" data-id="${order._id}">Complete</button>
            </td>
          `;
          tbody.appendChild(tr);
       });
    }


    function renderCompletedOrders(orders) {
      const tbody = document.querySelector("#completedOrdersTable tbody");
      if (!tbody) return;

      tbody.innerHTML = "";

      orders.forEach(order => {
        if (order.status !== "Completed") return;

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${order.customer?.id|| "-"}</td>
          <td>${order.items?.name|| "-"}</td>
          <td>${order.customer?.name || "-"}</td>
          <td>${order.customer?.email || "-"}</td>
          <td>$${order.total.toFixed(2)}</td>
          <td>${new Date(order.date).toLocaleString()}</td>
          <td>
            <button class="view-proof-btn" data-id="${order._id}">View Proof</button>
            <button class="delete-btn" data-id="${order._id}">Delete</button>
          </td>
        `;
        tbody.appendChild(tr);
      });
    }

    document.addEventListener("click", async e => {
      const id = e.target.dataset.id;
      const token = localStorage.getItem("adminToken");
      if (!id || !token) return;

      if (e.target.classList.contains("complete-btn")) {
        await fetch(`${BACKEND_URL}/api/orders/${id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("✅ Order completed");
        fetchOrders();
      }

      if (e.target.classList.contains("delete-btn")) {
        if (!confirm("Delete this order?")) return;

        await fetch(`${BACKEND_URL}/api/orders/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        alert("🗑️ Order deleted");
        fetchOrders();
      }
    });
  
// for shop and cart logic
      // Only run cart logic if cart exists
      if (document.querySelector("#cart-btn")) {
        
          renderProducts();
   
     
      }

//for admin dashboard logic
    // Only run admin logic if admin table exists
      if (document.querySelector("#ordersTable")) {
        fetchOrders();
      }


});
