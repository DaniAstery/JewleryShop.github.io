let cart = [];
let cartCount = 0;

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    cartCount++;
    document.getElementById("cart-count").textContent = cartCount;
  });
});


const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeCart = document.getElementById("close-cart");
const cartItemsList = document.getElementById("cart-items");
const cartTotalEl = document.getElementById("cart-total");

function updateCartUI() {
  cartItemsList.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price}`;
    cartItemsList.appendChild(li);
    total += item.price;
  });

  cartTotalEl.textContent = total;
  document.getElementById("cart-count").textContent = cart.length;
}

document.querySelectorAll(".add-to-cart").forEach((button, index) => {
  button.addEventListener("click", () => {
    const product = button.parentElement;
    const name = product.querySelector("h3").textContent;
    const price = parseFloat(product.querySelector("p").textContent.replace("$",""));

    cart.push({name, price});
    updateCartUI();
  });
});


cartBtn.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
});

closeCart.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});
