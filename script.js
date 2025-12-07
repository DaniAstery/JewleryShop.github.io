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

  const products = [
    { id: 1, name: "Classic Dress", price: 49.99, image: "images/placeholder2.png", video: "videos/SampleRing.mp4" },
    { id: 2, name: "Stylish Heels", price: 59.99, image: "images/headphone2.png", video: "videos/SampleRing.mp4" },
    { id: 3, name: "Casual Handbag", price: 39.99, image: "images/headphone3.png", video: "videos/SampleRing.mp4" },
    { id: 4, name: "Casual Handbag", price: 39.99, image: "images/placeholder.png", video: "videos/SampleRing.mp4" }
  ];

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // --------------------------
  // Render Products
  // --------------------------
  function renderProducts() {
    productGrid.innerHTML = "";

    products.forEach(product => {
      const div = document.createElement("div");
      div.classList.add("product-card");

      div.innerHTML = `
        <div class="media-wrapper" style="position:relative; overflow:hidden;">
          <img class="product-img" src="${product.image}" alt="${product.name}" style="width:100%; display:block;">
          <video class="product-video" src="${product.video}" loop muted playsinline style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; transition: opacity 0.3s;"></video>
        </div>
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;

      productGrid.appendChild(div);

      // Hover video
      const video = div.querySelector("video");
      const img = div.querySelector(".product-img");

      div.addEventListener("mouseover", () => {
        video.play();
        video.style.opacity = 1;
        img.style.opacity = 0;
      });

      div.addEventListener("mouseout", () => {
        video.pause();
        video.currentTime = 0;
        video.style.opacity = 0;
        img.style.opacity = 1;
      });
    });
  }

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
    const advance = parseFloat(document.getElementById("cust-advance").value || 0);
    const paymentProof = document.getElementById("payment-proof").files[0];

    if (!name || !email || !address || cart.length === 0) {
      alert("⚠️ Fill all fields and make sure your cart is not empty.");
      return;
    }

    const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const order = {
      customer: { name, email, address },
      shipping, payment, currency, advance,
      items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
      total, date: new Date().toISOString(), status: "Pending Payment Invoice"
    };

    const formData = new FormData();
    formData.append("order", JSON.stringify(order));
    if (paymentProof) formData.append("paymentProof", paymentProof);

    fetch("http://localhost:5001/api/confirm-checkout", { method: "POST", body: formData })
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
  const token = localStorage.getItem("adminToken");

  async function fetchOrders() {
    if (!token) return; // skip if not admin

    try {
      const res = await fetch("http://localhost:5001/api/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("adminToken");
        window.location.href = "index.html";
        return;
      }

      const data = await res.json();
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
      if (order.status === "Pending Payment Invoice") {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${order.customer.id}</td>
          <td>${order.customer.name}</td>
          <td>${order.customer.email}</td>
          <td>${order.shipping || ""}</td>
          <td>${order.payment || ""}</td>
          <td>${order.advance || 0}</td>
          <td>$${order.total.toFixed(2)}</td>
          <td>${new Date(order.date).toLocaleString()}</td>
          <td>${order.status}</td>
          <td>
            <button class="view-proof-btn" data-id="${order._id}">View Proof</button>
            <button class="complete-btn" data-id="${order.customer.id}">Complete</button>
          </td>
        `;
        tbody.appendChild(tr);
      }
    });
  }

  function renderCompletedOrders(orders) {
    alert('Rendering completed orders');
    alert(orders._id);
    const tbody = document.querySelector("#completedOrdersTable tbody");
    if (!tbody) return;
    tbody.innerHTML = "";
    orders.forEach(order => {
      if (order.status === "Completed") {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${order.customer.id}</td>
          <td>${order.customer.name}</td>
          <td>${order.customer.email}</td>
          <td>${order.items.map(i => i.name + " x" + i.quantity).join(", ")}</td>
          <td>$${order.total.toFixed(2)}</td>
          <td>${order.status}</td>
          <td>
          <button class="view-proof-btn" data-id="${order._id}">View Proof</button>
          <button class="delete-btn" data-id="${order.customer.id}">Delete</button>
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

    fetch(`http://localhost:5001/api/orders/${id}`, {
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

  modalImg.src = `http://localhost:5001/api/orders/${id}/proof`;

  document.getElementById("proofModal").classList.remove("hidden");
});


  // ==========================
  // Initialize
  // ==========================
  renderProducts();  // display products
  updateCart();      // restore cart from localStorage
  fetchOrders();     // fetch admin orders if token exists

});
