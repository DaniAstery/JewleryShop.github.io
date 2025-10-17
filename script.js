let cart = [];

// Selectors
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeCart = document.getElementById("close-cart");
const cartItemsList = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");
const cartCountEl = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkout-btn");
const checkoutModal = document.getElementById("checkout-modal");
const checkoutForm = document.getElementById("checkout-form");
const cancelCheckout = document.getElementById("cancel-checkout");


// 🧮 Update Cart UI
function updateCartUI() {
  cartItemsList.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const li = document.createElement("li");
    li.classList.add("cart-item");
    li.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price}</p>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" data-action="decrease" data-index="${index}">−</button>
        <span>${item.quantity}</span>
        <button class="qty-btn" data-action="increase" data-index="${index}">+</button>
        <button class="remove-btn" data-index="${index}">🗑️</button>
      </div>
    `;
    cartItemsList.appendChild(li);
  });

  cartTotalEl.textContent = total.toFixed(2);
  cartCountEl.textContent = count;

  // 💾 Save cart to localStorage whenever it changes
  localStorage.setItem("cartData", JSON.stringify(cart));
}

// 🛍️ Add Product to Cart
function addToCart(product) {
  const existing = cart.find(item => item.name === product.name);
  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCartUI();
}

// 🧩 Event Delegation for Quantity + Remove
cartItemsList.addEventListener("click", e => {
  if (e.target.classList.contains("qty-btn")) {
    const index = e.target.dataset.index;
    const action = e.target.dataset.action;
    if (action === "increase") cart[index].quantity++;
    if (action === "decrease" && cart[index].quantity > 1) cart[index].quantity--;
    else if (action === "decrease" && cart[index].quantity === 1) cart.splice(index, 1);
    updateCartUI();
  }

  if (e.target.classList.contains("remove-btn")) {
    const index = e.target.dataset.index;
    cart.splice(index, 1);
    updateCartUI();
  }
});

// 🪄 Open/Close Cart
cartBtn.addEventListener("click", () => cartModal.classList.remove("hidden"));
closeCart.addEventListener("click", () => cartModal.classList.add("hidden"));

// 🧱 Load Products Dynamically
document.addEventListener("DOMContentLoaded", () => {
        // 🧾 Load cart from localStorage
        const savedCart = localStorage.getItem("cartData");
        if (savedCart) {
          cart = JSON.parse(savedCart);
          updateCartUI();
        }

        const products = [
          { name: "Headphone1", price: 120, img: "images/headphone1.png" },
          { name: "Headphone2", price: 350, img: "images/headphone2.png" },
          { name: "Headphone3", price: 90, img: "images/headphone3.png" },
          { name: "HeadPhone4", price: 70, img: "images/headphone4.png" }
        ];

        const productGrid = document.querySelector(".product-grid");
        products.forEach(p => {
          const div = document.createElement("div");
          div.classList.add("product");
          div.innerHTML = `
            <img src="${p.img}" alt="${p.name}" onerror="this.src='https://placehold.co/150x150'">
            <h3>${p.name}</h3>
            <p>$${p.price}</p>
            <button class="add-to-cart">Add to Cart</button>
          `;
          productGrid.appendChild(div);

          div.querySelector(".add-to-cart").addEventListener("click", () => addToCart(p));
        });
});



checkoutBtn.addEventListener("click", () => {
        if (cart.length === 0) return;
        cartModal.classList.add("hidden");      // hide cart
        checkoutModal.classList.remove("hidden"); // show checkout form
      });
      // 🛑 Cancel checkout
      cancelCheckout.addEventListener("click", () => {
        checkoutModal.classList.add("hidden");
      });

      checkoutForm.addEventListener("submit", e => {
        e.preventDefault();

        const name = document.getElementById("customer-name").value.trim();
        const email = document.getElementById("customer-email").value.trim();
        const address = document.getElementById("customer-address").value.trim();
        const shipping = document.getElementById("shipping-method").value;
        const payment = document.getElementById("payment-method").value;
        const advance = document.getElementById("advance-payment").value;

        if (!name || !email || !address || !shipping || !payment) {
          alert("Please fill in all fields!");
          return;
        }

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const order = {
          id: "ORD-" + Date.now(),
          customer: { name, email, address },
          shipping,
          payment,
          advance,
          items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
          total,
          date: new Date().toISOString(),
          status: "Pending"
        };

        const orders = JSON.parse(localStorage.getItem("orders")) || [];
        orders.push(order);
        localStorage.setItem("orders", JSON.stringify(orders));

        alert(`✅ Thank you, ${name}! Your order ${order.id} has been placed.`);

        cart = [];
        updateCartUI();
        localStorage.removeItem("cartData");
        checkoutForm.reset();
        checkoutModal.classList.add("hidden");
});
