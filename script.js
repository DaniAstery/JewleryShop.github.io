let selectedItems = [];

document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // GLOBALS
  // ==========================
  const BACKEND_URL = "https://backend-gpgx.onrender.com";
  let cart=[];
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
    { id: 1, name: "4 pcs Ethiopian Opal | 35 ct (7.00 g) | Oval Cabochon | ~12 × 9 × 5 mm avg | Multicolor |shipped", price:330.00, image: "images/1.png", video: "https://res.cloudinary.com/dv2ff7sl2/video/upload/1_uspnc6.mp4"},
    { id: 2, name: "5 pcs Ethiopian Opal | 36.65 ct (7.33 g) | Oval Cabochon | ~11 × 9 × 5 mm avg | Multicolor |shipped", price: 340.00, image: "images/2.png", video: "https://res.cloudinary.com/dv2ff7sl2/video/upload/v1770312722/2_qaxubl.mp4" },
    { id: 3, name: "4 pcs Ethiopian Opal | 36.05 ct (7.21 g) | Oval Cabochon | ~12 × 10 × 5 mm avg | Multicolor |shipped", price: 335.00, image: "images/3.png", video: "https://res.cloudinary.com/dv2ff7sl2/video/upload/v1770312713/3_m86zxy.mp4"},
    { id: 4, name: "3 pcs | 39.45 ct  Ethiopian Opal | 39.45 ct (7.89 g) | Oval Cabochon | ~14 × 10 × 6 mm avg | Multicolor |shipped", price: 355.00, image: "images/4.png", video: "https://res.cloudinary.com/dv2ff7sl2/video/upload/v1770312710/4_zgfmg2.mp4"},
    { id: 5, name: "4 pcs | 29.45 ct  Ethiopian Opal | 29.45 ct (5.89 g) | Oval Cabochon | ~11 × 9 × 5 mm avg | Multicolor | shipped", price: 265.00, image: "images/5.png", video:"https://res.cloudinary.com/dv2ff7sl2/video/upload/v1770312719/5_fvrjjz.mp4"},
    { id: 6, name: "4 pcs | 30.80 ct  Ethiopian Opal | 30.80 ct (6.16 g) | Oval Cabochon | ~11 × 9 × 5 mm avg | Multicolor | shipped", price: 275.00, image: "images/6.png", video: "https://res.cloudinary.com/dv2ff7sl2/video/upload/v1770312719/6_ip4pdi.mp4"},
    { id: 7, name: "8 pcs | 57.35 ct  Ethiopian Opal | 57.35 ct (11.47 g) | Oval Cabochon | ~10 × 8 × 4.5 mm avg | Multicolor |shipped", price: 430.00, image: "images/7.png", video:"https://res.cloudinary.com/dv2ff7sl2/video/upload/v1770312702/7_cvfqae.mp4"},
    { id: 8, name: "8 pcs | 50.05 ct  Ethiopian Opal | 50.05 ct (10.01 g) | Oval Cabochon | ~10 × 8 × 4.5 mm avg | Multicolor |shipped", price: 375.00, image: "images/8.png", video:"https://res.cloudinary.com/dv2ff7sl2/video/upload/v1770312704/8_rmbruy.mp4"},
    { id: 9, name: "36 pcs | 332.25 ct  Ethiopian Opal | 332.25 ct (66.45 g) | Mixed Oval Cabochon | ~9 × 7 × 4 mm avg | Multicolor |shipped — wholesale", price: 1495.00, image: "images/9.png", video: "https://res.cloudinary.com/dv2ff7sl2/video/upload/v1770312715/9_nqxrzj.mp4"},
   // { id: 10, name:"74 pcs | 498.55 ct  Ethiopian Opal | 498.55 ct (99.71 g) | Mixed Oval Cabochon | ~8 × 7 × 4 mm avg | Multicolor |shipped", price: 2150.00, image:"images/10.png", video:"https://res.cloudinary.com/dv2ff7sl2/video/upload/v1770312704/8_rmbruy.mp4"},
  //  { id: 11, name:"75 pcs | 645.60 ct  Ethiopian Opal | 645.60 ct (129.12 g) | Mixed Oval Cabochon | ~9 × 7 × 4 mm avg | Multicolor | shipped", price: 2650.00, image:"images/11.png", video: "https://res.cloudinary.com/dv2ff7sl2/video/upload/v1770312699/11_udhyxj.mp4"},
 
  ];

  // ==========================
// INTERSECTION OBSERVER
// ==========================
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const video = entry.target;
    const placeholder = video.previousElementSibling;

    if (entry.isIntersecting) {

      // Only show video once it has loaded enough data
      const showVideo = () => {
        video.style.opacity = 1;       // show video
        placeholder.style.opacity = 0; // hide placeholder
      };

      if (video.readyState >= 3) { // HAVE_FUTURE_DATA
        showVideo();
      } else {
        video.addEventListener("loadeddata", showVideo, { once: true });
      }

      video.play().catch(() => {});

    } else {
      // Reset when out of viewport
      video.pause();
      video.currentTime = 0;
      video.style.opacity = 0;
      placeholder.style.opacity = 1;
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
         if (order.paymentStatus !== "Pending" || order.status === "Deleted") return;

          // Handle order.items as an array
          const items = Array.isArray(order.items)
            ? order.items.map(item => item.name).join(", ")
            : order.items?.name || "-";

          const tr = document.createElement("tr");
          tr.innerHTML = `
            <td>${order.customer?.id || "-"}</td>
            <td>${order.customer?.name || "-"}</td>
            <td>${order.customer?.email || "-"}</td>
            <td>${items}</td>
            <td>${order.paymentStatus || "-"}</td>
            <td>${order.advance || "-"}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td>${new Date(order.date).toLocaleString()}</td>
           
            <td>

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
        if (order.paymentStatus !== "Completed") return;

        // Handle order.items as an array
        const items = Array.isArray(order.items)
            ? order.items.map(item => item.name).join(", ")
            : order.items?.name || "-";

        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${order.customer?.id || "-"}</td>
          <td>${items}</td>
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

    });
  
    document.addEventListener("click", async (e) => {
      const id = e.target.dataset.id;

      if (e.target.classList.contains("view-proof-btn")) {
        try {
          const token = localStorage.getItem("adminToken");
          if (!token) {
            alert("Unauthorized: Admin token is missing.");
            return;
          }

          const res = await fetch(`${BACKEND_URL}/api/orders/${id}/proof`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (!res.ok) {
            alert("Failed to fetch proof. Please try again.");
            return;
          }

          const proofData = await res.json();
          const proofUrl = proofData.proofUrl; // Assuming the backend returns a proof URL

          if (proofUrl) {
            window.open(proofUrl, "_blank"); // Open proof in a new tab
          } else {
            alert("No proof available for this order.");
          }
        } catch (error) {
          console.error("Error fetching proof:", error);
          alert("An error occurred while fetching the proof.");
        }
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

      document.getElementById("confirm-checkout")?.addEventListener("click", async () => {
        if (cart.length === 0) {
          alert("🛒 Your cart is empty.");
          return;
        }
  
        const paymentProofInput = document.getElementById("payment-proof");
        const paymentProofFile = paymentProofInput?.files[0];
  
        const customerName = document.getElementById("cust-name")?.value.trim();
        const customerEmail = document.getElementById("cust-email")?.value.trim();
        const customerAddress = document.getElementById("cust-address")?.value.trim();
  
        if (!customerName || !customerEmail || !customerAddress) {
          alert("⚠️ Please fill in all customer details.");
          return;
        }
  
        if (!paymentProofFile) {
          alert("⚠️ Please upload your payment proof.");
          return;
        }
  
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
        const order = {
          customer: {
            name: customerName,
            email: customerEmail,
            address: customerAddress,
          },
          items: cart,
          total,
        };
  
        const formData = new FormData();
        formData.append("order", JSON.stringify(order));
        formData.append("paymentProof", paymentProofFile);
  
        try {
          const response = await fetch(`${BACKEND_URL}/api/confirm-checkout`, {
            method: "POST",
            body: formData
          });
  
          const result = await response.json();
  
          if (!response.ok) {
            throw new Error(result.error || "Failed to confirm checkout.");
          }
  
          // Call the backend endpoint to send the order confirmation email
          await fetch(`${BACKEND_URL}/api/send-order-confirmation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customerEmail,
              customerName, 
            }),
          });
  
          alert("✅ Order placed successfully! Your order ID: " + result.orderId);
          localStorage.removeItem("cart");
          cart = [];
          updateCart();
  
        } catch (error) {
          console.error("❌ Checkout error:", error);
          alert("❌ Failed to place order. Please try again later.");
        }
      });
    }); // Close the confirm-checkout event listener

    // Updating confirm-clear button to clear cart and refresh the page
    const confirmClearBtn = document.getElementById("confirm-clear");
    if (confirmClearBtn) {
      confirmClearBtn.addEventListener("click", () => {
        localStorage.removeItem("cart"); // Clear only the cart from local storage
        alert("Cart cleared successfully!");
        location.reload(); // Refresh the page
      });
    }

