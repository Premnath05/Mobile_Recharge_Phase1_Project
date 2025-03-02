
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

// Validate input (only allow numbers)
function validateInput(event) {
    event.target.value = event.target.value.replace(/[^0-9]/g, '');
}

// Handle login form submission
document.getElementById("login-form").addEventListener("submit", async function(event) {
    event.preventDefault();

    let mobileNumber = document.getElementById("mobile-number").value;
    let errorMessage = document.getElementById("error-message");

    if (!/^\d{10}$/.test(mobileNumber)) {
        errorMessage.textContent = "Please enter a valid 10-digit mobile number";
        errorMessage.style.display = "block";
        return;
    }

    let registeredUsers = await fetchRegisteredUsers();
    let user = registeredUsers.find(user => user.mobile === mobileNumber);

    if (!user) {
        errorMessage.textContent = "This number is not registered. Please sign up.";
        errorMessage.style.display = "block";
        return;
    }

    errorMessage.style.display = "none";

    // Generate a random 4-digit OTP
    let otp = Math.floor(1000 + Math.random() * 9000);

    // Store details in session storage
    sessionStorage.setItem("mobileNumber", mobileNumber);
    sessionStorage.setItem("userName", user.name);
    sessionStorage.setItem("userEmail", user.email);
    sessionStorage.setItem("otp", otp);

    // Show OTP for testing (REMOVE this in production)
    alert(`Your OTP is: ${otp}`);

    // Redirect to OTP Page
    window.location.href = "otppage.html";
});
