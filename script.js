const products = [
  { id: 1, name: "Classic Dress", price: 49.99, image: "images/headphone1.png" },
  { id: 2, name: "Stylish Heels", price: 59.99, image: "images/headphone2.png" },
  { id: 3, name: "Casual Handbag", price: 39.99, image: "images/headphone3.png" },
  { id: 4, name: "Casual Handbag", price: 39.99, image: "images/placeholder.png" }
];

let cart = [];

document.addEventListener("DOMContentLoaded", () => {
  const productGrid = document.querySelector(".product-grid");
  const cartBtn = document.getElementById("cart-btn");
  const cartModal = document.getElementById("checkout-modal");
  const closeCart = document.getElementById("close-cart");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  const cartCount = document.getElementById("cart-count");

  function renderProducts() {
    productGrid.innerHTML = "";
    products.forEach(product => {
      const div = document.createElement("div");
      div.classList.add("product-card");
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
      `;
      productGrid.appendChild(div);
    });
  }

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
  });
  fetchOrders();
  renderProducts();
  renderOrders();
  renderCompletedOrders();
});

// ✅ Checkout Button Handler
document.getElementById("confirm-checkout").addEventListener("click", () => {
  if (!cart.length) return alert("Cart is empty!");

  const name = document.getElementById("cust-name").value.trim();
  const email = document.getElementById("cust-email").value.trim();
  const address = document.getElementById("cust-address").value.trim();
  const shipping = document.getElementById("cust-shipping").value.trim();
  const payment = document.getElementById("cust-payment").value.trim();
  const advance = parseFloat(document.getElementById("cust-advance").value || 0);

  if (!name || !email || !address) {
    return alert("Please fill in customer details.");
  }

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const order = {
    id: "ORD-" + Date.now(),
    customer: { name, email, address },
    shipping,
    payment,
    advance,
    items: cart.map(i => ({
      name: i.name,
      price: i.price,
      quantity: i.quantity
    })),
    total,
    date: new Date().toISOString(),
    status: "Pending"
  };

  // ✅ Send order to backend
  fetch("http://localhost:5000/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(order),
  })
    .then(res => {
      if (!res.ok) throw new Error("Server error: " + res.status);
      return res.json();
    })
    .then(data => {
      console.log("✅ Order saved:", data);
      alert("✅ Order saved to backend!");

      // ✅ Clear cart after successful save
      cart = [];
      localStorage.removeItem("cart");

      // ✅ Update UI
      document.getElementById("cart-items").innerHTML = "";
      document.getElementById("cart-total").textContent = "0.00";
      document.getElementById("cart-count").textContent = "0";
      document.getElementById("checkout-modal").classList.add("hidden");

      renderOrders();
      renderCompletedOrders();
    })
    .catch(err => {
      console.error("❌ Failed to save order:", err);
      alert("❌ Failed to save order. Check your backend connection.");
    });
});


// Clear Cart Button Logic
document.getElementById("confirm-clear").addEventListener("click", () => {

  if (!cart.length) return alert("🛒 Your cart is already empty!");

  const confirmClear = confirm("Are you sure you want to clear your cart?");
  if (!confirmClear) return;

  cart = [];
  localStorage.removeItem("cart");

  // Update UI
  document.getElementById("cart-items").innerHTML = "";
  document.getElementById("cart-total").textContent = "0.00";
  document.getElementById("cart-count").textContent = "0";

  // Hide modal after clear
  document.getElementById("checkout-modal").classList.add("hidden");

  alert("✅ Cart cleared successfully!");
});


// Fetch all orders from backend
function fetchOrders() {
  fetch("http://localhost:5001/api/orders")
    .then(function(res) {
      return res.json();
    })
    .then(function(data) {
      renderOrders(data);
      renderCompletedOrders(data);
    })
    .catch(function(err) {
      console.error("❌ Error fetching orders:", err);
    });
}

// Render pending orders
function renderOrders(orders) {
  var tbody = document.querySelector("#ordersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  orders.forEach(function(order) {
    if (order.status === "Pending") {
      var tr = document.createElement("tr");
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
          <button class="view-btn" data-id="${order.id}">View</button>
          <button class="delete-btn" data-id="${order.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  });
}

// Render completed orders
function renderCompletedOrders(orders) {
  var tbody = document.querySelector("#completedOrdersTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";
  orders.forEach(function(order) {
    if (order.status === "Completed") {
      var tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${order.customer.id}</td>
        <td>${order.customer.name}</td>
        <td>${order.customer.email}</td>
        <td>${order.items.map(function(i){ return i.name + " x" + i.quantity; }).join(", ")}</td>
        <td>$${order.total.toFixed(2)}</td>
        <td>${order.status}</td>
         <td>
          <button class="view-btn" data-id="${order.id}">View</button>
          <button class="delete-btn" data-id="${order.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  });
}



// View Order
document.addEventListener("click", e => {
  if (e.target.classList.contains("view-btn")) {
    const id = e.target.dataset.id;
    const orders = JSON.parse(localStorage.getItem("orders")) || [];
    const completed = JSON.parse(localStorage.getItem("completedOrders")) || [];
    const allOrders = [...orders, ...completed];

    const order = allOrders.find(o => o.id === id);
    if (!order) return alert("Order not found!");

    // Populate modal fields
    document.getElementById("view-id").textContent = order.id;
    document.getElementById("view-name").textContent = order.customer?.name || "-";
    document.getElementById("view-email").textContent = order.customer?.email || "-";
    document.getElementById("view-address").textContent = order.customer?.address || "-";
    document.getElementById("view-shipping").textContent = order.shipping || "-";
    document.getElementById("view-payment").textContent = order.payment || "-";
    document.getElementById("view-advance").textContent = order.advance || "0";
    document.getElementById("view-status").textContent = order.status || "Pending";
    document.getElementById("view-total").textContent = order.total ? Number(order.total).toFixed(2) : "0.00";

    const itemsList = document.getElementById("view-items");
    itemsList.innerHTML = "";
    if (order.items && order.items.length) {
      order.items.forEach(i => {
        const li = document.createElement("li");
        li.textContent = `${i.name} - ${i.quantity} x $${i.price}`;
        itemsList.appendChild(li);
      });
    } else {
      itemsList.innerHTML = "<li>No items</li>";
    }

    // Show modal
    document.getElementById("view-modal").classList.remove("hidden");
  }
});


// Close view modal
document.getElementById("close-view").addEventListener("click", () => {
  document.getElementById("view-modal").classList.add("hidden");
});

document.getElementById("close-view-btn").addEventListener("click", () => {
  document.getElementById("view-modal").classList.add("hidden");
});



document.addEventListener("click", e => {
  const id = e.target.dataset.id;

  // 🗑️ DELETE COMPLETED ORDER
  if (e.target.classList.contains("delete-complete")) {
    const isConfirmed = confirm("Are you sure you want to delete this completed order?");
    if (!isConfirmed) return;

    // Load completed orders
    let completedOrders = JSON.parse(localStorage.getItem("completedOrders")) || [];
    
 
    // Find the order by ID
    const index = completedOrders.findIndex(o => o.id === id);
    if (index === -1) {
      alert("⚠️ Order not found.");
      return;
    }

    // Change status to Deleted (instead of removing permanently)
    completedOrders[index].status = "Deleted";

    // Optionally remove it completely if you want
    // completedOrders.splice(index, 1);

    // Save the updated list
    localStorage.setItem("completedOrders", JSON.stringify(completedOrders));

    // Re-render updated completed orders list
    renderCompletedOrders();

    alert("✅ Completed order deleted successfully!");
  }
});


// Complete/Delete Orders
document.addEventListener("click", e => {
  const id = e.target.dataset.id;
  if (e.target.classList.contains("complete-btn")) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    let completed = JSON.parse(localStorage.getItem("completedOrders")) || [];
    const index = orders.findIndex(o => o.id === id);
    if (index === -1) return;
    const [completedOrder] = orders.splice(index, 1);
    completedOrder.status = "Completed";
    completed.push(completedOrder);
    localStorage.setItem("orders", JSON.stringify(orders));
    localStorage.setItem("completedOrders", JSON.stringify(completed));
    renderOrders();
    renderCompletedOrders();
    alert("✅ Order marked as completed");
  }

  if (e.target.classList.contains("delete-btn")) {
    let orders = JSON.parse(localStorage.getItem("orders")) || [];
    if (confirm("Delete this order?")) {
      orders = orders.filter(o => o.id !== id);
      localStorage.setItem("orders", JSON.stringify(orders));
      renderOrders();
    }
  }
});

document.getElementById("close-checkout").addEventListener("click", () => {
  document.getElementById("checkout-modal").classList.add("hidden");
});

document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("checkout-modal").classList.add("hidden");
});
