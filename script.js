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
              localStorage.setItem("cart", JSON.stringify(cart));
            });
            fetchOrders();
            renderProducts();
            renderOrders();
            renderCompletedOrders();
          });

          // ✅ Checkout Button Handler
          document.getElementById("confirm-checkout").addEventListener("click", function () {
            // Assume cart is globally available or stored in localStorage
           
            var cart = JSON.parse(localStorage.getItem("cart")) || [];


            var name = document.getElementById("cust-name").value.trim();
            var email = document.getElementById("cust-email").value.trim();
            var address = document.getElementById("cust-address").value.trim();
            var shipping = document.getElementById("cust-shipping").value.trim();
            var payment = document.getElementById("cust-payment").value.trim();
            var advance = parseFloat(document.getElementById("cust-advance").value || 0);
            
             if (!name || !email || !address && cart.length === 0) {
               alert("⚠️ Please fill in all required fields and ensure your cart is not empty.");
              return;
               }

             alert(cart);
               
              var total = cart.reduce(function (sum, item) {
                return sum + item.price * item.quantity;
              }, 0);
                
              var order = {
              id: "",
              customer: { name: name, email: email, address: address },
              shipping: shipping,
              payment: payment,
              advance: advance,
              items: cart.map(function (i) {
                return { name: i.name, price: i.price, quantity: i.quantity };
              }),
              total: total,
              date: new Date().toISOString(),
              status: "Pending Payment Invoice"
            };

            // ✅ Send to backend
            fetch("http://localhost:5001/api/orders", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(order)
            })
              .then(function (res) {
                if (!res.ok) throw new Error("Failed to save order");
                return res.json();
              })
              .then(function (data) {
                alert("✅ Order placed successfully!");
                console.log("✅ Order response:", data);

                // Clear cart and update UI
                localStorage.removeItem("cart");
                document.getElementById("cart-items").innerHTML = "";
                document.getElementById("cart-total").textContent = "0.00";
                document.getElementById("cart-count").textContent = "0";
                document.getElementById("checkout-modal").classList.add("hidden");

                // Refresh order display
                fetchOrders(); // refetch all from backend
              })
              .catch(function (err) {
                console.error("❌ Error creating order:", err);
                alert("❌ Failed to save order. Check backend connection.");
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

// Render pending orders fetched from backend by fetchOrders
function renderOrders(orders) {
  alert("Rendering Orders");
  alert(orders.length);
  var tbody = document.querySelector("#ordersTable tbody");
  if (!tbody) return;
  tbody.innerHTML = "";
  orders.forEach(function(order) {
    if (order.status === "Pending Payment Invoice") {
      var tr = document.createElement("tr");
      alert(order.customer.id);
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
          <button class="view-btn" data-id="${order.customer.id}">View</button>
          <button class="complete-btn" data-id="${order.customer.id}">Complete</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  });
}

// Render completed orders from backend by fetchOrders
function renderCompletedOrders(orders) {

alert("Rendering Completed Orders");

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
          <button class="view-btn" data-id="${order.customer.id}">View</button>
          <button class="complete-btn" data-id="${order.customer.id}">Complete</button>
          <button class="delete-btn" data-id="${order.customer.id}">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    }
  });
}



// ✅ View Order Handler
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("view-btn")) {
    const id = e.target.dataset.id; // The custom order id (like ORD-... )
 
    if (!id) return alert("No order ID found!");

    // Fetch the order by ID from the backend
    fetch(`http://localhost:5001/api/orders/id/${id}`)
      .then(function (res) {
        return res.json();
      })
      .then(function (order) {
        if (!order || order.message === "Order not found") {
          return alert("Order not found!");
        }

        // ✅ Populate modal fields
        document.getElementById("view-id").textContent = order.customer?.id || "-";
        document.getElementById("view-name").textContent = order.customer?.name || "-";
        document.getElementById("view-email").textContent = order.customer?.email || "-";
        document.getElementById("view-address").textContent = order.customer?.address || "-";
        document.getElementById("view-shipping").textContent = order.shipping || "-";
        document.getElementById("view-payment").textContent = order.payment || "-";
        document.getElementById("view-advance").textContent = order.advance || "0";
        document.getElementById("view-status").textContent = order.status || "Pending";
        document.getElementById("view-total").textContent =
          order.total ? Number(order.total).toFixed(2) : "0.00";

        // ✅ Render items
        const itemsList = document.getElementById("view-items");
        itemsList.innerHTML = "";
        if (order.items && order.items.length) {
          order.items.forEach(function (i) {
            const li = document.createElement("li");
            li.textContent = `${i.name} - ${i.quantity} × $${i.price}`;
            itemsList.appendChild(li);
          });
        } else {
          itemsList.innerHTML = "<li>No items</li>";
        }

        // ✅ Show modal
        document.getElementById("view-modal").classList.remove("hidden");
      })
      .catch(function (err) {
        console.error("❌ Error fetching order:", err);
        alert("Failed to load order details.");
      });
  }
});


// Close view modal
document.getElementById("close-view").addEventListener("click", () => {
  document.getElementById("view-modal").classList.add("hidden");
});

document.getElementById("close-view-btn").addEventListener("click", () => {
  document.getElementById("view-modal").classList.add("hidden");
});


// ✅ Complete And Delete Order Handler

document.addEventListener("click", e => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (
    e.target.classList.contains("complete-btn") ||
    e.target.classList.contains("delete-btn")
  ) {
    fetch(`http://localhost:5001/api/orders/${id}`, { method: "PUT" })
      .then(res => res.json())
      .then(data => {
        if(e.target.classList.contains("complete-btn")==true){
          alert("✅ Order completed!");     
        } 
        else {
          window.prompt("Are you sure you want to delete this order?") && alert("✅ Order deleted!");
        }
        fetchOrders(); // Refresh orders
      })
      .catch(err => console.error("❌ Error updating order:", err));
  }
});






document.getElementById("close-checkout").addEventListener("click", () => {
  document.getElementById("checkout-modal").classList.add("hidden");
});

document.getElementById("close-cart").addEventListener("click", () => {
  document.getElementById("checkout-modal").classList.add("hidden");
});
