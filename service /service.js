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
    })
    .catch(err => {
        console.error("❌ Error sending OTP:", err);
        alert("❌ Failed to send OTP. See console for details.");
    });

    // Verify OTP logic would go here, perhaps by enabling the next input field
    // or changing a UI state.
});