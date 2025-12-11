// --------------------------
// send OTP
// --------------------------
document.addEventListener("click", e => {
    // 1. Check if the clicked element has the "send-otp" class
    if (!e.target.classList.contains("send-otp")) {
        return;
    }

    // Prevents the default action (like form submission/page reload)
    // if the button is inside a form.
    e.preventDefault(); 
    
    // Get the email value
    const email = document.getElementById("cust-email").value;
    
    // Basic validation
    if (!email) {
        alert("Please enter your email address.");
        return;
    }

    // Prepare the data payload
    const payload = {
        email: email
    };

    // Make the POST request
    fetch("http://localhost:5001/api/send-code", {
        method: "POST",
        // Crucial: Set the content type to JSON
        headers: {
            "Content-Type": "application/json"
        },
        // Send the JSON stringified data
        body: JSON.stringify(payload)
    })
    .then(res => {
        // Check for HTTP errors (e.g., 400, 500 status codes)
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        // You might want to check the data object for a success indicator
        console.log("Response data:", data);
        alert("✅ OTP sent to your email!");
        alert(data.message);
    })
    .catch(err => {
        console.error("❌ Error sending OTP:", err);
        alert("❌ Failed to send OTP. See console for details.");
    });

    
});


// --------------------------// verify OTP
// --------------------------                       
document.getElementById("Check-otp").addEventListener("click", async () => {
  const email = document.getElementById("cust-email").value.trim();
  const otp = document.getElementById("cust-otp").value.trim();

  if (!email || !otp) {
    alert("⚠️ Please enter both email and OTP.");
    return;
  }

  try {
    const response = await fetch("http://localhost:5001/api/verify-code", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, code: otp })
    });

    const data = await response.json();

    if (response.ok) {
      alert("✅ Email verified successfully!");
      // You can now show the rest of the checkout form or enable the Place Order button
      document.getElementById("checkout-section").classList.remove("hidden");
    } else {
      alert("❌ Verification failed: " + data.error);
    }
  } catch (err) {
    console.error("Error verifying OTP:", err);
    alert("❌ Server error. Try again later.");
  }
});

