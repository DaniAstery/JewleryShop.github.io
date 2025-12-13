// --------------------------
// send OTP
// --------------------------
let selectedItems = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("click", e => {
  if (!e.target.classList.contains("send-otp")) return;
  e.preventDefault();

  const email = document.getElementById("cust-email").value;
  const currency = document.getElementById("cust-currency").value;

  if (!email) {
    alert("Please enter your email address.");
    return;
  }

            router.post("api/send-code", async (req, res) => {
            try {
                const { email, currency, cart } = req.body;

                console.log("send-code request body:", req.body);

                await sendVerificationCode(email, currency, cart); // ✅ pass cart

                res.json({ success: true });
            } catch (err) {
                console.error(err);
                res.status(500).json({ success: false });
            }
            });

});


// --------------------------// verify OTP
// --------------------------                       
document.addEventListener("click", e => {
    // 1. Check if the clicked element has the "verify-otp" class
    if (!e.target.classList.contains("verify-otp")) {
        return;
    }

    // Prevents the default action (like form submission/page reload)
    e.preventDefault(); 
    
    // Get the email and OTP values
    const email = document.getElementById("cust-email").value;
    const otp = document.getElementById("Verify-otp").value;
    
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
    fetch("http://localhost:5001/api/verify-code", {
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

    
