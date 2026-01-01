// --------------------------
// send OTP
// --------------------------

document.addEventListener("click", e => {
    
  if (!e.target.classList.contains("send-otp")) return;
  e.preventDefault();

  const email = document.getElementById("cust-email").value;
  const currency = document.getElementById("cust-currency").value;

  if (!email) {
    alert("Please enter your email address.");
    return;
  }

        fetch("http://backend-production-b183.up.railway.app/api/send-code", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
            email,
            currency,
            cart: selectedItems // Send selected items in the cart
            })
        })
        .then(res => res.json())
        .then(() => {
            alert("✅ OTP sent to your email!");
            localStorage.removeItem("cart");
        })
        .catch(err => {
            console.error(err);
            alert("❌ Failed to send OTP");
        });
        console.log("Selected Items for OTP:", selectedItems);
});


// --------------------------// verify OTP
                 
document.addEventListener("click", e => {
    // 1. Check if the clicked element has the "verify-otp" class
    if (!e.target.classList.contains("verify-otp")) {
        return;
    }

    // Prevents the default action (like form submission/page reload)
    e.preventDefault(); 
    
    // Get the email and OTP values
    const email = document.getElementById("cust-email").value;
    const otp = document.getElementById("cust-otp").value;
    
    // Basic validation
    if (!email || !otp) {
        alert("Please enter both email and OTP.");
        return;
    }

    // Prepare the data payload
    const payload = {
        email: email,
        code: otp
    };

    // Make the POST request
    fetch("http://backend-production-b183.up.railway.app/api/verify-code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
    })
    .then(data => {
        console.log("Response data:", data);
        if (data.success) {
            alert("✅ OTP verified successfully!");
             document.getElementById("confirm-checkout").disabled = false;
             document.getElementById("confirm-clear").disabled = false;
             document.getElementById("close-cart").disabled = false;
            // You can now show the rest of the checkout form or enable the Place Order button
           
        } else {
            alert("❌ Verification failed: " + data.error);
        }
    })
    
 });

    
