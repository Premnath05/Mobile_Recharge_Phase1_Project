// admin.js

document.addEventListener('DOMContentLoaded', function() {
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Function to initialize charts
    function initializeCharts() {
        const revenueCtx = document.getElementById('revenueChart');
        if (revenueCtx) {
            const revenueChart = new Chart(revenueCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Revenue (₹)',
                        data: [125000, 148000, 156000, 132000, 168000, 192000],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } },
                    scales: { y: { beginAtZero: true } }
                }
            });
            console.log('Revenue chart initialized');
        } else {
            console.warn('Revenue chart canvas not found');
        }

        const planDistributionCtx = document.getElementById('planDistributionChart');
        if (planDistributionCtx) {
            const planDistributionChart = new Chart(planDistributionCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Monthly', 'Quarterly', 'Annual'],
                    datasets: [{
                        data: [45, 35, 20],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(255, 206, 86, 0.7)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    cutout: '70%',
                    plugins: { legend: { position: 'bottom' } }
                }
            });
            console.log('Plan distribution chart initialized');
        } else {
            console.warn('Plan distribution chart canvas not found');
        }
    }

    // Initialize charts only if on Reports tab or when it becomes active
    const reportsTab = document.getElementById('reports');
    if (reportsTab && reportsTab.classList.contains('active')) {
        initializeCharts();
    }

    // Listen for tab change to initialize charts when Reports tab is activated
    document.querySelectorAll('.nav-link[data-bs-toggle="tab"]').forEach(tab => {
        tab.addEventListener('shown.bs.tab', function(e) {
            if (e.target.getAttribute('href') === '#reports') {
                initializeCharts();
            }
        });
    });
});

// Load Expiring Plans
function loadExpiringPlans() {
    const expiringPlans = [
        { name: "Rahul Singh", mobile: "9876543210", plan: "Monthly Unlimited", expiry: "March 6, 2025", daysLeft: 3 },
        { name: "Priya Sharma", mobile: "8765432109", plan: "Data Pack 2GB/day", expiry: "March 5, 2025", daysLeft: 2 },
        { name: "Amit Kumar", mobile: "7654321098", plan: "Quarterly Premium", expiry: "March 4, 2025", daysLeft: 1 }
    ];

    const tableBody = document.getElementById("expiringPlansTable");
    if (tableBody) {
        tableBody.innerHTML = "";
        expiringPlans.forEach(user => {
            tableBody.innerHTML += `
                <tr>
                    <td>${user.name}</td>
                    <td>${user.mobile}</td>
                    <td>${user.plan}</td>
                    <td>${user.expiry}</td>
                    <td><span class="badge ${user.daysLeft <= 1 ? 'bg-danger' : 'bg-warning'}">${user.daysLeft} days</span></td>
                </tr>
            `;
        });
        console.log('Expiring plans loaded');
    } else {
        console.error('Expiring plans table not found');
    }
}

// Load Transactions
function loadTransactions() {
    const transactionsTab = document.querySelector('[href="#transactions"]');
    if (transactionsTab) {
        transactionsTab.click();
        console.log('Switched to Transactions tab');
    } else {
        console.error('Transactions tab link not found');
    }
}