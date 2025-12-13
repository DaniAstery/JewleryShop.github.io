// --------------------------
// send OTP
// --------------------------
let selectedItems=cart;
document.addEventListener("click", e => {

    alert(selectedItems.count); 

    if (!e.target.classList.contains("send-otp")) return;
    e.preventDefault(); 
    
    const email = document.getElementById("cust-email").value;
    const selectedCurrency = document.getElementById("cust-currency").value;

    const cart = JSON.parse(localStorage.getItem("cart")) || [];

   

    if (!email) {
        alert("Please enter your email address.");
        return;
    }

    const payload = {
        email: email,
        currency: selectedCurrency,
        cart: selectedItems    // 🟢 SEND THE CART TO BACKEND
    };

    fetch("http://localhost:5001/api/send-code", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
    })
    .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
    })
    .then(data => {
        console.log("Response data:", data);
        alert("✅ OTP sent to your email!");
    })
    .catch(err => {
        console.error("❌ Error sending OTP:", err);
        alert("❌ Failed to send OTP. See console for details.");
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

    
