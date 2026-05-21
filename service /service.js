// ==========================
// OTP SERVICE (Send & Verify)
// ==========================

// Helper: safely get cart
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("cart")) || [];
  } catch {
    return [];
  }
}
// --------------------------
// SEND OTP
// --------------------------
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("send-otp")) return;

  e.preventDefault();

  try {
    const email = document.getElementById("cust-email").value;
    const currency = document.getElementById("cust-currency").value;

    if (!email) {
      window.alert("Please enter your email");
      return;
    }

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (!Array.isArray(cart) || cart.length === 0) {
      window.alert("Cart is empty");
      return;
    }

    const cleanedItems = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    }));

    console.log("Selected Items:", cleanedItems);

    const res = await fetch(
      "https://backend-gpgx.onrender.com/api/send-code",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email,
          currency,
          items: cleanedItems
        })
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed");
    }

    window.alert("✅ OTP sent!");

    localStorage.removeItem("cart");

  } catch (err) {
    console.error("Send OTP error:", err);
    window.alert("❌ Failed to send OTP");
  }
});

// --------------------------
// VERIFY OTP
// --------------------------
document.addEventListener("click", async (e) => {
  if (!e.target.classList.contains("verify-otp")) return;
  e.preventDefault();

  const email = document.getElementById("cust-email")?.value.trim();
  const otp = document.getElementById("cust-otp")?.value.trim();

  if (!email || !otp) {
    alert("⚠️ Please enter both email and OTP.");
    return;
  }

  try {
    const res = await fetch("https://backend-gpgx.onrender.com/api/verify-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code: otp })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Invalid OTP");
    }

    alert("✅ Email verified successfully!");

    // Enable checkout actions AFTER verification
    document.getElementById("confirm-checkout")?.removeAttribute("disabled");
    document.getElementById("confirm-clear")?.removeAttribute("disabled");
    document.getElementById("close-cart")?.removeAttribute("disabled");

    // Optional UI unlocks
    document.querySelector(".payment-info-box")?.classList.remove("hidden");
    document.querySelector(".payment-proof-section")?.classList.remove("hidden");

  } catch (err) {
    console.error("Verify OTP error:", err);
    alert("❌ OTP verification failed.");
  }
});

