console.log("script.js loaded successfully!");


//user validation home page


// Function to fetch users from JSON
async function getUsers() {
    const response = await fetch("users.json");
    const users = await response.json();
    return users;
}

// Function to check if the user is registered
async function isUserRegistered(mobileNumber) {
    const users = await getUsers();
    return users.some(user => user.mobile === mobileNumber);
}

// Handle Proceed to Recharge Button Click
document.getElementById("proceedToRecharge").addEventListener("click", async function(event) {
    event.preventDefault(); // Prevent default navigation

    const mobileNumber = document.getElementById("mobileInput").value.trim(); // Get input value and trim spaces

    // Validate Mobile Number (Only 10 Digits)
    const mobilePattern = /^[6-9]\d{9}$/; // Ensures it starts with 6-9 and has exactly 10 digits
    if (!mobilePattern.test(mobileNumber)) {
        alert("Please enter a valid 10-digit mobile number.");
        return;
    }

    const registered = await isUserRegistered(mobileNumber);

    if (registered) {
        // ✅ Redirect with mobile number in the URL
        window.location.href = `planspage.html?mobile=${encodeURIComponent(mobileNumber)}`;
    } else {
        alert("You must be a registered user to proceed.");
        window.location.href = "homepage.html"; // Redirect to homepage if not registered
    }
});














//login




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



//fetch user for otp

// Fetch registered users from JSON
async function fetchRegisteredUsers() {
    try {
        const response = await fetch("users.json");
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
}

// Function to validate input
function validateInput(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, ''); // Removes anything that is not 0-9
}

// Listen for form submission
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    let mobileNumber = document.getElementById("mobile-number").value;
    let errorMessage = document.getElementById("error-message");

    if (!/^\d{10}$/.test(mobileNumber)) {
        errorMessage.textContent = "Please enter a valid 10-digit mobile number";
        errorMessage.style.display = "block";
        return;
    }

    // Get registered users
    let registeredUsers = await fetchRegisteredUsers();

    // Check if mobile number is registered
    let user = registeredUsers.find(user => user.mobile === mobileNumber);

    if (!user) {
        errorMessage.textContent = "This number is not registered. Please sign up.";
        errorMessage.style.display = "block";
        return;
    }

    errorMessage.style.display = "none";

    // Generate a random OTP (4-digit)
    let otp = Math.floor(1000 + Math.random() * 9000);

    // Store mobile number, user details, and OTP in session storage
    sessionStorage.setItem("mobileNumber", mobileNumber);
    sessionStorage.setItem("userName", user.name);
    sessionStorage.setItem("userEmail", user.email);
    sessionStorage.setItem("otp", otp);

    // Log OTP (For testing purposes)
    console.log("Generated OTP:", otp);

    // Redirect to OTP Page
    window.location.href = "otppage.html";
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
    // window.location.href = "ennakumar.html?" + params.toString();

}


