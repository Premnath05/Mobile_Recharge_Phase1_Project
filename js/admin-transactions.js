// admin-transactions.js

const API_BASE_URL = 'http://localhost:8083/admin';
let expiringPlansModal;

document.addEventListener('DOMContentLoaded', () => {
    expiringPlansModal = new bootstrap.Modal(document.getElementById('expiringPlansModal'));
    fetchRecentTransactions();
    fetchExpiringPlans();

    document.querySelector('[href="#transactions"]')?.addEventListener('shown.bs.tab', fetchRecentTransactions);
    document.querySelector('a[onclick="loadExpiringPlans()"]')?.addEventListener('click', fetchExpiringPlans);
});

// Authentication helper
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No JWT token found. Please log in.');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

// Error handling
const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    showMessage(`Error: ${error.message || 'Something went wrong'}`, false);
    if (error.message.includes('403') || error.message.includes('401')) {
        window.location.href = 'adminlogin.html';
    }
};

// Show notification
const showMessage = (message, isSuccess = true) => {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${isSuccess ? 'success' : 'danger'} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '1050';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    document.body.appendChild(alertDiv);
    setTimeout(() => alertDiv.remove(), 5000);
};

// Fetch recent transactions
async function fetchRecentTransactions() {
    const tableBody = document.querySelector('#transactions .table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4">Loading...</td></tr>';

    try {
        const response = await fetch(`${API_BASE_URL}/recent-transactions`, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(await response.text());
        const transactions = await response.json();
        renderTransactionsTable(transactions, tableBody);
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="7" class="text-center py-4 text-danger">${error.message}</td></tr>`;
        handleError(error, 'fetchRecentTransactions');
    }
}

// Render transactions table
function renderTransactionsTable(transactions, tableBody) {
    tableBody.innerHTML = transactions.length === 0 
        ? '<tr><td colspan="7" class="text-center py-4">No transactions found</td></tr>'
        : '';

    transactions.forEach(tx => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.transactionId}</td>
            <td>${tx.user?.username || 'N/A'}</td>
            <td>${tx.plan?.planName || 'N/A'}</td>
            <td>₹${tx.amount?.toFixed(2) || 'N/A'}</td>
            <td>${new Date(tx.transactionDate).toLocaleDateString()}</td>
            <td><span class="badge bg-${tx.status === 'Completed' ? 'success' : 'danger'}">${tx.status}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary view-details" data-id="${tx.transactionId}">
                    View Details
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.querySelectorAll('.view-details').forEach(btn => 
        btn.addEventListener('click', () => viewTransactionDetails(btn.dataset.id))
    );
}

// Fetch expiring plans
async function fetchExpiringPlans() {
    const tableBody = document.getElementById('expiringPlansTable');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Loading...</td></tr>';

    try {
        const response = await fetch(`${API_BASE_URL}/expiring-plans`, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(await response.text());
        const transactions = await response.json();
        renderExpiringPlansTable(transactions);
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="5" class="text-center py-4 text-danger">${error.message}</td></tr>`;
        handleError(error, 'fetchExpiringPlans');
    }
}

// Render expiring plans table
function renderExpiringPlansTable(transactions) {
    const tableBody = document.getElementById('expiringPlansTable');
    tableBody.innerHTML = transactions.length === 0 
        ? '<tr><td colspan="5" class="text-center py-4">No plans expiring soon</td></tr>'
        : '';

    transactions.forEach(tx => {
        const expiryDate = new Date(tx.expiryDate);
        const today = new Date();
        const daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tx.user?.username || 'N/A'}</td>
            <td>${tx.user?.mobileNo || 'N/A'}</td>
            <td>${tx.plan?.planName || 'N/A'}</td>
            <td>${expiryDate.toLocaleDateString()}</td>
            <td><span class="badge bg-${daysLeft <= 1 ? 'danger' : 'warning'}">${daysLeft} days</span></td>
        `;
        tableBody.appendChild(row);
    });
}

// View transaction details (placeholder for modal)
async function viewTransactionDetails(transactionId) {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions/${transactionId}`, { headers: getAuthHeaders() });
        if (!response.ok) throw new Error(await response.text());
        const tx = await response.json();
        showMessage(`Transaction ${tx.transactionId}: ${tx.status} - ₹${tx.amount}`, true); // Replace with modal
    } catch (error) {
        handleError(error, 'viewTransactionDetails');
    }
}