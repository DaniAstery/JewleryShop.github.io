// ==========================
// OTP SERVICE (Send & Verify)
// ==========================

const BACKEND_URL = "https://localhost:5001"; // Replace with your backend URL

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
  alert("clicked");
  if (!e.target.classList.contains("send-otp")) return;
  e.preventDefault();

  const email = document.getElementById("cust-email")?.value.trim();
  const currency = document.getElementById("cust-currency")?.value.trim();
  const cart = getCart();

  if (!email) {
    alert("⚠️ Please enter your email address.");
    return;
  }

  if (!cart.length) {
    alert("🛒 Your cart is empty.");
    return;
  }

  try {
    const res = await fetch(`${BACKEND_URL}/api/send-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        currency,
        cart
      })
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to send OTP");
    }

    alert("✅ OTP sent to your email!");
    console.log("OTP sent for cart:", cart);

  } catch (err) {
    console.error("Send OTP error:", err);
    alert("❌ Failed to send OTP. Please try again.");
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
    const res = await fetch(`${BACKEND_URL}/api/verify-code`, {
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
