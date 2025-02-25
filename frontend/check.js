document.addEventListener('DOMContentLoaded', function() {
    // Sidebar Toggle
    document.getElementById('sidebarCollapse').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('active');
        document.getElementById('content').classList.toggle('active');
    });

    // Initialize Tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize Dropdowns
    var dropdownTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="dropdown"]'));
    dropdownTriggerList.map(function(dropdownTriggerEl) {
        return new bootstrap.Dropdown(dropdownTriggerEl);
    });

    // Initialize Charts
    initializeCharts();

    // Initialize Toast
    var toastElList = [].slice.call(document.querySelectorAll('.toast'));
    var toastList = toastElList.map(function(toastEl) {
        return new bootstrap.Toast(toastEl);
    });

    // Search Functionality
    const searchInput = document.querySelector('.search-bar input');
    searchInput.addEventListener('input', debounce(function(e) {
        // Add your search logic here
        console.log('Searching for:', e.target.value);
    }, 300));

    // Show notification toast function
    window.showNotification = function(message, type = 'success') {
        const toast = document.getElementById('notificationToast');
        const toastBody = toast.querySelector('.toast-body');
        toastBody.textContent = message;
        
        // Update toast styling based on type
        toast.className = `toast ${type === 'success' ? 'bg-success' : 'bg-danger'} text-white`;
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
    };
});

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize Charts
function initializeCharts() {
    // User Growth Chart
    const userGrowthCtx = document.getElementById('userGrowthChart').getContext('2d');
    const userGrowthChart = new Chart(userGrowthCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Total Users',
                data: [10000, 10800, 11500, 12000, 12345, 13000],
                borderColor: '#ffc107',
                tension: 0.4,
                fill: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: 'User Growth Over Time'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                }
            }
        }
    });

    // Plan Popularity Chart
    const planPopularityCtx = document.getElementById('planPopularityChart').getContext('2d');
    const planPopularityChart = new Chart(planPopularityCtx, {
        type: 'doughnut',
        data: {
            labels: ['Basic', 'Standard', 'Premium', 'Enterprise'],
            datasets: [{
                data: [30, 40, 20, 10],
                backgroundColor: [
                    '#ffc107',
                    '#17a2b8',
                    '#28a745',
                    '#dc3545'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right'
                },
                title: {
                    display: true,
                    text: 'Plan Distribution'
                }
            }
        }
    });

    // Update charts periodically (every 5 minutes)
    setInterval(updateCharts, 300000);
}

// Function to update charts with new data
function updateCharts() {
    // Simulate new data - in production, this would fetch from an API
    const newUserData = generateRandomData(6, 10000, 13000);
    const newPlanData = generateRandomData(4, 10, 40);

    // Update User Growth Chart
    const userGrowthChart = Chart.getChart('userGrowthChart');
    if (userGrowthChart) {
        userGrowthChart.data.datasets[0].data = newUserData;
        userGrowthChart.update();
    }

    // Update Plan Popularity Chart
    const planPopularityChart = Chart.getChart('planPopularityChart');
    if (planPopularityChart) {
        planPopularityChart.data.datasets[0].data = newPlanData;
        planPopularityChart.update();
    }
}

// Helper function to generate random data for charts
function generateRandomData(count, min, max) {
    return Array.from({ length: count }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

// Handle security alerts
function addSecurityAlert(message, level = 'warning') {
    const alertsContainer = document.querySelector('.card-body');
    const alertHTML = `
        <div class="alert alert-${level} alert-dismissible fade show">
            <i class="fas fa-exclamation-triangle me-2"></i>
            <strong>${message}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    alertsContainer.insertAdjacentHTML('afterbegin', alertHTML);
}

// Example of how to handle failed login attempts
window.handleFailedLogin = function(ipAddress) {
    addSecurityAlert(`Failed login attempt detected from IP ${ipAddress}`);
    showNotification('Security alert: Failed login attempt detected', 'warning');
};

// Handle sidebar menu interactions
document.querySelectorAll('#sidebar ul li a').forEach(link => {
    link.addEventListener('click', function(e) {
        // Remove active class from all links
        document.querySelectorAll('#sidebar ul li').forEach(li => li.classList.remove('active'));
        // Add active class to parent li
        this.parentElement.classList.add('active');
        
        // On mobile, close sidebar after selection
        if (window.innerWidth < 992) {
            document.getElementById('sidebar').classList.add('active');
            document.getElementById('content').classList.remove('active');
        }
    });
});

// Handle responsive behavior
window.addEventListener('resize', function() {
    if (window.innerWidth < 992) {
        document.getElementById('sidebar').classList.add('active');
        document.getElementById('content').classList.remove('active');
    } else {
        document.getElementById('sidebar').classList.remove('active');
        document.getElementById('content').classList.add('active');
    }
});