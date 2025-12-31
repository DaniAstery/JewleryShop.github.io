let selectedItems = [] ;
document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // Products & Cart Setup
  // ==========================
  const productGrid = document.querySelector(".product-grid");
  const cartBtn = document.getElementById("cart-btn");
  const cartModal = document.getElementById("checkout-modal");
  const closeCart = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");
  
  cart = JSON.parse(localStorage.getItem("cart")) || [];

  const BACKEND_URL = "https://backend-production-b183.up.railway.app";

  const products = [
    { id: 1, name: "Classic Dress", price: 49.99, image: "images/placeholder2.png", video:`${BACKEND_URL}/videos/OP-000 1-4-6.01 Grams .mp4`},
    { id: 2, name: "Stylish Heels", price: 59.99, image: "images/headphone2.png", video:`${BACKEND_URL}/videos/OP-000 1-4-6.01 Grams .mp4`},
    { id: 3, name: "Casual Handbag", price: 39.99, image: "images/headphone3.png", video:`${BACKEND_URL}/videos/OP-000 1-4-6.01 Grams .mp4`},
    { id: 4, name: "Casual Handbag", price: 39.99, image: "images/placeholder.png", video:`${BACKEND_URL}/videos/OP-000 1-4-6.01 Grams .mp4`},
  ];

// RENDER PRODUCTS 

function renderProducts() {
  productGrid.innerHTML = "";

  products.forEach(product => {
    const div = document.createElement("div");
    div.classList.add("product-card");

    div.innerHTML = `
      <div class="media-wrapper" style="position:relative; overflow:hidden;">
        <img class="product-img" src="${product.image}" alt="${product.name}" style="width:100%; display:block;">
        <video class="product-video" src="${product.video}" loop muted playsinline preload="metadata" style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; transition: opacity 0.3s;"></video>
      </div>
      <h3>${product.name}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
    `;

    productGrid.appendChild(div);

    const video = div.querySelector(".product-video");
    const img = div.querySelector(".product-img");

  // ----------------------
// Desktop Hover
// ----------------------
div.addEventListener("mouseover", () => {
  video.play().catch(err => console.warn("Video play blocked:", err));
  video.style.opacity = 1;
  if (img) img.style.opacity = 0;
});

div.addEventListener("mouseout", () => {
  video.pause();
  video.currentTime = 0;
  video.style.opacity = 0;
  if (img) img.style.opacity = 1;
});

// ----------------------
// Intersection Observer (scroll into view)
// ----------------------
const videos = document.querySelectorAll(".product-video");
const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      const video = entry.target;
      const img = video.previousElementSibling;

      // Only auto-play if not hovered (desktop hover takes priority)
      if (!video.matches(":hover")) {
        if (entry.isIntersecting) {
          video.play().catch(err => console.warn("Video play blocked:", err));
          video.style.opacity = 1;
          if (img) img.style.opacity = 0;
        } else {
          video.pause();
          video.currentTime = 0;
          video.style.opacity = 0;
          if (img) img.style.opacity = 1;
        }
      }
    });
  },
  { threshold: 0.5 }
);

videos.forEach(video => observer.observe(video));
  });
}// RENDER PRODUCTS END 

  // --------------------------
  // Cart functions
  // --------------------------
  function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      total += item.price * item.quantity;
      const li = document.createElement("li");
      li.textContent = `${item.name} × ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
      cartItemsContainer.appendChild(li);
    });
    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((sum, i) => sum + i.quantity, 0);
    selectedItems=localStorage.getItem("cart"); // Update selectedItems whenever cart is updated
  }

  cartBtn.addEventListener("click", () => cartModal.classList.remove("hidden"));
  closeCart.addEventListener("click", () => cartModal.classList.add("hidden"));

  productGrid.addEventListener("click", e => {
    if (!e.target.classList.contains("add-to-cart")) return;
    const id = Number(e.target.dataset.id);
    const product = products.find(p => p.id === id);
    if (!product) return;
    const existing = cart.find(i => i.id === id);
    if (existing) existing.quantity++;
    else cart.push({ ...product, quantity: 1 });
    updateCart();
    localStorage.setItem("cart", JSON.stringify(cart));
    alert("✅ Item added to cart!");
    selectedItems=localStorage.getItem("cart"); // Update selectedItems whenever cart is updated
  });

  document.getElementById("confirm-clear").addEventListener("click", () => {
    if (!cart.length) return alert("🛒 Cart is already empty!");
    if (!confirm("Are you sure you want to clear your cart?")) return;

    cart = [];
    localStorage.removeItem("cart");
    updateCart();
    cartModal.classList.add("hidden");
    alert("✅ Cart cleared!");
  });

 

  document.getElementById("confirm-checkout").addEventListener("click", () => {
    const name = document.getElementById("cust-name").value.trim();
    const email = document.getElementById("cust-email").value.trim();
    const address = document.getElementById("cust-address").value.trim();
    const shipping = document.getElementById("cust-shipping").value.trim();
    const payment = document.getElementById("cust-payment").value.trim();
    const currency = document.getElementById("cust-currency").value.trim();
    const paymentProof = document.getElementById("payment-proof").files[0];

    if (!name || !email || !address || cart.length === 0 || !shipping || !payment || !currency) {
      alert("⚠️ Fill all fields and make sure your cart is not empty.");
      return;
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    //verifying OTP before placing order could be added here
    document.getElementById("Check-otp").addEventListener("click", async () => {
    const email = document.getElementById("cust-email").value.trim();
    const otp = document.getElementById("cust-otp").value.trim();

        if (!email || !otp) {
          alert("⚠️ Please enter both email and OTP.");
          return;
        }

        try {
          const response = await fetch(`${BACKEND_URL}/verify-code`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, code: otp })
          });

          const data = await response.json();

          if (response.ok) {
            alert("✅ Email verified successfully!");
            // SHOW ALL SECTIONS AFTER OTP VERIFIED
            
            document.getElementById("payment-proof").disabled = false;
            document.querySelector(".payment-info-box").classList.remove("hidden");
            document.querySelector(".payment-proof-section").classList.remove("hidden");
            document.getElementById("confirm-checkout").classList.remove("hidden");
            document.getElementById("confirm-clear").classList.remove("hidden");
            document.getElementById("close-cart").classList.remove("hidden");

             
          } else {
            alert("❌ Verification failed: " + data.error);
          }
        } catch (err) {
          console.error("Error verifying OTP:", err);
          alert("❌ Server error. Try again later.");
        }
      });


    const order = {
      customer: { name, email, address },
      shipping, payment, currency,
      items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
      total, date: new Date().toISOString(), status: "Pending Payment Invoice"
    };

    const formData = new FormData();
    formData.append("order", JSON.stringify(order));
    if (paymentProof) formData.append("paymentProof", paymentProof);

     // Validate payment proof
      if(!paymentProof){
        alert("⚠️ Please upload payment proof.");
        return;
      } 
    fetch(`${BACKEND_URL}/api/confirm-checkout`, { method: "POST", body: formData })
      .then(res => res.json())
      .then(data => {
        alert("✅ Order placed!");
        cart = [];
        localStorage.removeItem("cart");
        updateCart();
        cartModal.classList.add("hidden");
        fetchOrders();
      })
      .catch(err => console.error("❌ Error:", err));
  });

  // ==========================
  // Admin / Orders
  // ==========================
 

 async function fetchOrders() {
  const token = localStorage.getItem("adminToken");
  if (!token) return; // skip if not admin
  console.log("Admin token:", token);

  try {
    const res = await fetch("https://backend-production-b183.up.railway.app/api/orders", {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("adminToken");
      window.location.href = "admin.html";
      return;
    }

    const data = await res.json();
    console.log("Orders fetched:", data);

    renderOrders(data);
    renderCompletedOrders(data);

  } catch (err) {
    console.error("❌ Error fetching orders:", err);
  }
}

function renderOrders(orders) {
  const tbody = document.querySelector("#ordersTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  orders.forEach(order => {
    // Pending orders are those not shipped or not completed
    if (order.status === "Pending" || order.status === "Shipped") {
      const customer = order.customer || {};
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${customer.id || "-"}</td>
        <td>${customer.name || "-"}</td>
        <td>${customer.email || "-"}</td>
        <td>${order.shipping || "-"}</td>
        <td>${order.paymentStatus || "-"}</td>
        <td>${order.advance || 0}</td>
        <td>$${order.total?.toFixed(2) || "0.00"}</td>
        <td>${order.date ? new Date(order.date).toLocaleString() : "-"}</td>
        <td>${order.status || "-"}</td>
        <td>
          <button class="view-proof-btn" data-id="${order._id}">View Proof</button>
          <button class="complete-btn" data-id="${customer.id || ""}">Complete</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  });
}

function renderCompletedOrders(orders) {
  const tbody = document.querySelector("#completedOrdersTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";

  orders.forEach(order => {
    // Completed orders
    if (order.status === "Completed") {
      const customer = order.customer || {};
      const items = Array.isArray(order.items) && order.items.length > 0
        ? order.items.map(i => `${i.name} x${i.quantity}`).join(", ")
        : "No items";

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${customer.id || "-"}</td>
        <td>${customer.name || "-"}</td>
        <td>${customer.email || "-"}</td>
        <td>${items}</td>
        <td>$${order.total?.toFixed(2) || "0.00"}</td>
        <td>${order.status || "-"}</td>
        <td>
          <button class="view-proof-btn" data-id="${order._id}">View Proof</button>
          <button class="delete-btn" data-id="${customer.id || ""}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  });
}



  // --------------------------
  // Complete / Delete Order
  // --------------------------
  document.addEventListener("click", e => {
    const id = e.target.dataset.id;
    if (!id || !(e.target.classList.contains("complete-btn") || e.target.classList.contains("delete-btn"))) return;

    fetch(`${BACKEND_URL}/api/orders/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (e.target.classList.contains("complete-btn")) alert("✅ Order completed!");
        else if (confirm("Are you sure you want to delete this order?")) alert("✅ Order deleted!");
        fetchOrders();
      })
      .catch(err => console.error("❌ Error updating order:", err));
  });


  // --------------------------
  // View Payment Proof
  // --------------------------

 document.addEventListener("click", async e => {
  if (!e.target.classList.contains("view-proof-btn")) return;

  const id = e.target.dataset.id;

  const modalImg = document.querySelector("#proofModal img");
  if (!modalImg) {
    console.error("❌ Modal image element is missing.");
    return;
  }

  modalImg.src = `${BACKEND_URL}/api/orders/${id}/proof`;

  document.getElementById("proofModal").classList.remove("hidden");
});




  // ==========================
  // Initialize
  // ==========================
  renderProducts();  // display products
  updateCart();      // restore cart from localStorage
  fetchOrders(); 
});

