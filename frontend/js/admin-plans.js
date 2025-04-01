// admin-plans.js

const API_BASE_URL = 'http://localhost:8083/admin';
let addPlanModal;
let deletePlanModal;

// Centralized error handling with redirect for auth errors
const handleError = (error, context) => {
    console.error(`Error in ${context}:`, error);
    const message = error.message || 'Something went wrong';
    showMessage(`Error: ${message}`, false);
    if (message.includes('403') || message.includes('401') || message.includes('JWT')) {
        console.warn('Authentication error detected. Redirecting to login.');
        window.location.href = '/loginpage.html'; // Adjust path to your login page
    }
};

// Show notification messages
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

// Authentication helper with explicit token check
const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No JWT token found in localStorage.');
        throw new Error('No JWT token found. Please log in.');
    }
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize modals
    addPlanModal = new bootstrap.Modal(document.getElementById('addPlanModal'));
    deletePlanModal = new bootstrap.Modal(document.getElementById('deletePlanModal'));

    // Event listeners
    document.getElementById('savePlanBtn')?.addEventListener('click', savePlan);
    document.getElementById('confirmDeleteBtn')?.addEventListener('click', confirmDeletePlan);
    document.getElementById('addPlanModal')?.addEventListener('hidden.bs.modal', resetPlanForm);

    // Initial data load
    fetchCategories();
    fetchPlans();
});

// Fetch and populate categories
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`, {
            headers: getAuthHeaders()
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch categories: ${response.status} - ${errorText}`);
        }
        
        const categories = await response.json();
        const categorySelect = document.getElementById('category');
        
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.categoryId;
            option.textContent = category.categoryName;
            categorySelect.appendChild(option);
        });
    } catch (error) {
        handleError(error, 'fetchCategories');
    }
}

// Fetch all plans
async function fetchPlans() {
    const tableBody = document.querySelector('#plansTable tbody');
    if (!tableBody) return;

    tableBody.innerHTML = '<tr><td colspan="8" class="text-center py-4">Loading...</td></tr>';

    try {
        const response = await fetch(`${API_BASE_URL}/plans`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch plans: ${response.status} - ${errorText}`);
        }
        
        const plans = await response.json();
        renderPlansTable(plans);
        renderCategoryCards(plans);
    } catch (error) {
        tableBody.innerHTML = `<tr><td colspan="8" class="text-center py-4 text-danger">${error.message}</td></tr>`;
        handleError(error, 'fetchPlans');
    }
}

// Render plans table
function renderPlansTable(plans) {
    const tableBody = document.querySelector('#plansTable tbody');
    tableBody.innerHTML = plans.length === 0 
        ? '<tr><td colspan="8" class="text-center py-4">No plans found</td></tr>'
        : '';

    plans.forEach(plan => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${plan.planId}</td>
            <td>${plan.planName}</td>
            <td>₹${plan.planPrice.toFixed(2)}</td>
            <td>${plan.data || 'N/A'}</td>
            <td>${plan.validity || 'N/A'}</td>
            <td>${plan.benefits || 'None'}</td>
            <td>${plan.category?.categoryName || 'Uncategorized'}</td>
            <td>
                <button class="btn btn-outline-primary btn-sm edit-plan" data-id="${plan.planId}">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm delete-plan" data-id="${plan.planId}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tableBody.appendChild(row);
    });

    document.querySelectorAll('.edit-plan').forEach(btn => 
        btn.addEventListener('click', () => editPlan(btn.dataset.id))
    );
    document.querySelectorAll('.delete-plan').forEach(btn => 
        btn.addEventListener('click', () => showDeleteConfirmation(btn.dataset.id))
    );
}

// Render category cards
function renderCategoryCards(plans) {
    const container = document.getElementById('categoryCardsContainer');
    if (!container) return;

    const categoriesMap = new Map();
    plans.forEach(plan => {
        const catId = plan.category?.categoryId || 0;
        const catName = plan.category?.categoryName || 'Uncategorized';
        if (!categoriesMap.has(catId)) {
            categoriesMap.set(catId, { name: catName, plans: [] });
        }
        categoriesMap.get(catId).plans.push(plan);
    });

    container.innerHTML = '';
    categoriesMap.forEach(category => {
        const card = document.createElement('div');
        card.className = 'col-md-6 col-lg-4 mb-4';
        card.innerHTML = `
            <div class="card h-100">
                <div class="card-header d-flex justify-content-between">
                    <span>${category.name}</span>
                    <span class="badge bg-primary">${category.plans.length}</span>
                </div>
                <div class="card-body">
                    <ul class="list-group list-group-flush">
                        ${category.plans.map(plan => `
                            <li class="list-group-item d-flex justify-content-between">
                                <div>
                                    <h6>${plan.planName}</h6>
                                    <small>${plan.data || 'N/A'}, ${plan.validity || 'N/A'}</small>
                                </div>
                                <span>₹${plan.planPrice.toFixed(2)}</span>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

// Edit plan
async function editPlan(planId) {
    try {
        const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch plan ${planId}: ${response.status} - ${errorText}`);
        }
        
        const plan = await response.json();
        
        document.getElementById('planId').value = plan.planId;
        document.getElementById('planName').value = plan.planName;
        document.getElementById('planPrice').value = plan.planPrice;
        document.getElementById('data').value = plan.data || '';
        document.getElementById('validity').value = plan.validity || '';
        document.getElementById('benefits').value = plan.benefits || '';
        document.getElementById('planDetailsContent').value = plan.planDetailsContent || '';
        document.getElementById('category').value = plan.category?.categoryId || '';
        document.getElementById('addPlanModalLabel').textContent = 'Edit Plan';

        addPlanModal.show();
    } catch (error) {
        handleError(error, 'editPlan');
    }
}

// Save plan (Create/Update)
async function savePlan() {
    const form = document.getElementById('planForm');
    if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
    }

    const planId = document.getElementById('planId').value || null;
    const categoryId = parseInt(document.getElementById('category').value);

    if (!categoryId) {
        showMessage('Please select a category', false);
        return;
    }

    const basePlanData = {
        planName: document.getElementById('planName').value.trim(),
        planPrice: parseFloat(document.getElementById('planPrice').value),
        data: document.getElementById('data').value.trim() || null,
        validity: document.getElementById('validity').value.trim() || null,
        benefits: document.getElementById('benefits').value.trim() || null,
        planDetailsContent: document.getElementById('planDetailsContent').value.trim() || null
    };

    let planData = planId 
        ? { ...basePlanData, planId, category: { categoryId } }
        : { ...basePlanData, categoryId };

    const saveBtn = document.getElementById('savePlanBtn');
    saveBtn.disabled = true;
    saveBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';

    try {
        const method = planId ? 'PUT' : 'POST';
        const url = `${API_BASE_URL}/plans${planId ? '/' + planId : ''}`;

        const response = await fetch(url, {
            method,
            headers: getAuthHeaders(),
            body: JSON.stringify(planData)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to save plan: ${response.status} - ${errorText}`);
        }

        addPlanModal.hide();
        fetchPlans();
        showMessage(planId ? 'Plan updated successfully!' : 'Plan created successfully!');
    } catch (error) {
        handleError(error, 'savePlan');
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = 'Save Plan';
    }
}

// Show delete confirmation
function showDeleteConfirmation(planId) {
    document.getElementById('deletePlanId').value = planId;
    deletePlanModal.show();
}

// Delete plan
async function confirmDeletePlan() {
    const planId = document.getElementById('deletePlanId').value;
    const deleteBtn = document.getElementById('confirmDeleteBtn');
    deleteBtn.disabled = true;
    deleteBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Deleting...';

    try {
        const response = await fetch(`${API_BASE_URL}/plans/${planId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to delete plan ${planId}: ${response.status} - ${errorText}`);
        }

        deletePlanModal.hide();
        fetchPlans();
        showMessage('Plan deleted successfully!');
    } catch (error) {
        handleError(error, 'confirmDeletePlan');
    } finally {
        deleteBtn.disabled = false;
        deleteBtn.innerHTML = 'Delete';
    }
}

// Reset form
function resetPlanForm() {
    const form = document.getElementById('planForm');
    form.reset();
    form.classList.remove('was-validated');
    document.getElementById('planId').value = '';
    document.getElementById('addPlanModalLabel').textContent = 'Add New Plan';
}