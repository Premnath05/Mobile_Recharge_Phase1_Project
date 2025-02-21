console.log("script.js loaded successfully!");


function validateInput(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, ''); // Removes anything that is not 0-9
}

document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    let mobileNumber = document.getElementById("mobile-number").value;
    let errorMessage = document.getElementById("error-message");

    if (!/^\d{10}$/.test(mobileNumber)) { // Ensures exactly 10 digits
        errorMessage.textContent = "Please enter a valid 10-digit mobile number";
        errorMessage.style.display = "block";
    } else {
        errorMessage.style.display = "none";
        window.location.href = "otppage.html"; // Redirect to OTP Page
    }
});



// otp validation




// plans filter

function filterPlans(category) {
    let plans = document.querySelectorAll(".plan-card"); // Select all plan cards
    let buttons = document.querySelectorAll(".filter-btn"); // Select all filter buttons

    // Remove 'active' class from all buttons
    buttons.forEach(btn => btn.classList.remove("active"));

    // Add 'active' class to the clicked button
    event.target.classList.add("active");

    // Show/hide plans based on category
    plans.forEach(plan => {
        if (category === "all") {
            plan.style.display = "block"; // Show all plans
        } else {
            if (plan.classList.contains(category)) {
                plan.style.display = "block"; // Show matching category
            } else {
                plan.style.display = "none"; // Hide non-matching plans
            }
        }
    });
}





//for payment page

function redirectToPayment(price, data, validity, calls) {
    const params = new URLSearchParams();
    params.append("price", price);
    params.append("data", data);
    params.append("validity", validity);
    params.append("calls", calls);

    window.location.href = "paymentpage.html?" + params.toString();
}


