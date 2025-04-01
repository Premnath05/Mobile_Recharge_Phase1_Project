
    document.addEventListener('DOMContentLoaded', function() {
        
        const sidebarLinks = document.querySelectorAll('.sidebar-link[data-section]');
        const contentSections = document.querySelectorAll('.content-section');
        
        sidebarLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
               
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                
                const targetSection = document.getElementById(this.dataset.section);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
                
                
                sidebarLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            });
        });
        
       
       
const logoutLink = document.getElementById('logout-link');
const logoutDropdown = document.getElementById('logout-dropdown');
const logoutModal = new bootstrap.Modal(document.getElementById('logoutModal'));

if (logoutLink) {
logoutLink.addEventListener('click', function(e) {
    e.preventDefault();
    logoutModal.show();
});
}

if (logoutDropdown) {
logoutDropdown.addEventListener('click', function(e) {
    e.preventDefault();
    logoutModal.show();
});
}


const logoutConfirmButton = document.querySelector('#logoutModal .btn-primary');
if (logoutConfirmButton) {
logoutConfirmButton.addEventListener('click', function() {
    
    window.location.href = 'index.html';
});
}
        
        
        const viewAllRecharges = document.getElementById('view-all-recharges');
        const viewAllNotifications = document.getElementById('view-all-notifications');
        
        if (viewAllRecharges) {
            viewAllRecharges.addEventListener('click', function(e) {
                e.preventDefault();
                
                
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                const rechargeSection = document.getElementById('recharge-history-section');
                if (rechargeSection) {
                    rechargeSection.classList.add('active');
                }
                
                
                sidebarLinks.forEach(link => link.classList.remove('active'));
                document.querySelector('.sidebar-link[data-section="recharge-history-section"]').classList.add('active');
            });
        }
        
        
        const profileDropdown = document.getElementById('profile-dropdown');
        
        if (profileDropdown) {
            profileDropdown.addEventListener('click', function(e) {
                e.preventDefault();
                
                
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                const profileSection = document.getElementById('profile-settings-section');
                if (profileSection) {
                    profileSection.classList.add('active');
                }
                
                
                sidebarLinks.forEach(link => link.classList.remove('active'));
                document.querySelector('.sidebar-link[data-section="profile-settings-section"]').classList.add('active');
            });
        }
        
        // Handle settings dropdown
        const settingsDropdown = document.getElementById('settings-dropdown');
        
        if (settingsDropdown) {
            settingsDropdown.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Navigate to profile section
                contentSections.forEach(section => {
                    section.classList.remove('active');
                });
                
                const profileSection = document.getElementById('profile-settings-section');
                if (profileSection) {
                    profileSection.classList.add('active');
                }
                
                // Update active sidebar link
                sidebarLinks.forEach(link => link.classList.remove('active'));
                document.querySelector('.sidebar-link[data-section="profile-settings-section"]').classList.add('active');
            });
        }

        // Handle receipt download
        const viewReceiptLinks = document.querySelectorAll('.view-receipt');
        const transactionDetailsModal = new bootstrap.Modal(document.getElementById('transactionDetailsModal'));
        const downloadReceiptButton = document.getElementById('downloadReceiptButton');

        let currentReceiptFile = '';

        viewReceiptLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();

                // Get transaction details from data attributes
                const date = this.getAttribute('data-date');
                const plan = this.getAttribute('data-plan');
                const amount = this.getAttribute('data-amount');
                const status = this.getAttribute('data-status');
                const paymentMethod = this.getAttribute('data-payment-method');
                const receiptFile = this.getAttribute('data-receipt');

                // Populate modal with transaction details
                document.getElementById('transactionDate').textContent = date;
                document.getElementById('transactionPlan').textContent = plan;
                document.getElementById('transactionAmount').textContent = amount;
                document.getElementById('transactionStatus').textContent = status;
                document.getElementById('transactionPaymentMethod').textContent = paymentMethod;

                // Store the current receipt file for download
                currentReceiptFile = receiptFile;

                // Show the modal
                transactionDetailsModal.show();
            });
        });

        // Handle receipt download button click
        downloadReceiptButton.addEventListener('click', function() {
            if (currentReceiptFile) {
                // Create a temporary anchor element to trigger the download
                const downloadLink = document.createElement('a');
                downloadLink.href = `/path/to/receipts/${currentReceiptFile}`; // Update the path to your receipts folder
                downloadLink.download = currentReceiptFile; // Set the file name for download
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // Close the modal after download
                transactionDetailsModal.hide();
            }
        });
    });

///dashboard 

document.addEventListener('DOMContentLoaded', function () {
    // Dashboard Functionalities

    // 1. Renew Plan Button - Show Confirmation Modal
    const renewPlanButton = document.querySelector('.card-header .btn-primary');
    if (renewPlanButton) {
        renewPlanButton.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Are you sure you want to renew your current plan?');
            // You can replace this with a Bootstrap modal for better UX
        });
    }

    // 2. Change Plan Button - Redirect to Plans Page
    const changePlanButton = document.querySelector('.card-header .btn-outline-primary');
    if (changePlanButton) {
        changePlanButton.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'planspage.html'; // Redirect to the Plans page
        });
    }

    // 3. Progress Bar for Data Usage - Dynamically Update
    const dataUsageProgressBar = document.querySelector('.progress-bar.bg-warning');
    if (dataUsageProgressBar) {
        const totalData = 50; // Total data in GB
        const usedData = 32.5; // Used data in GB
        const remainingData = totalData - usedData;
        const percentageUsed = (usedData / totalData) * 100;

        // Update progress bar width
        dataUsageProgressBar.style.width = `${percentageUsed}%`;
        dataUsageProgressBar.setAttribute('aria-valuenow', percentageUsed);

        // Update the text showing data usage
        const dataUsageText = document.querySelector('.card-body .fw-bold');
        if (dataUsageText) {
            dataUsageText.textContent = `${usedData} GB used of ${totalData} GB`;
        }

        // Update the badge showing remaining data
        const remainingDataBadge = document.querySelector('.card-body .badge.bg-success');
        if (remainingDataBadge) {
            remainingDataBadge.textContent = `${remainingData} GB left`;
        }
    }

    // 4. View All Recharges Button - Redirect to Recharge History Section
    const viewAllRechargesButton = document.getElementById('view-all-recharges');
    if (viewAllRechargesButton) {
        viewAllRechargesButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from all sections
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });

            // Add active class to Recharge History section
            const rechargeHistorySection = document.getElementById('recharge-history-section');
            if (rechargeHistorySection) {
                rechargeHistorySection.classList.add('active');
            }

            // Update active sidebar link
            document.querySelectorAll('.sidebar-link').forEach(link => {
                link.classList.remove('active');
            });
            document.querySelector('.sidebar-link[data-section="recharge-history-section"]').classList.add('active');
        });
    }

    // 5. View All Notifications Button - Display All Notifications in a Modal
    const viewAllNotificationsButton = document.getElementById('view-all-notifications');
    if (viewAllNotificationsButton) {
        viewAllNotificationsButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Create a modal to display all notifications
            const notificationModal = new bootstrap.Modal(document.getElementById('notificationModal'));
            if (notificationModal) {
                // Populate the modal with notifications
                const notificationModalBody = document.getElementById('notificationModalBody');
                if (notificationModalBody) {
                    notificationModalBody.innerHTML = `
                        <div class="notification-item">
                            <div class="fw-bold">Your plan expires in 19 days</div>
                            <div class="text-muted">Today, 10:25 AM</div>
                        </div>
                        <div class="notification-item">
                            <div class="fw-bold">New offer available for you!</div>
                            <div class="text-muted">Yesterday, 3:45 PM</div>
                        </div>
                        <div class="notification-item">
                            <div class="fw-bold">Recharge successful - ₹299</div>
                            <div class="text-muted">Feb 20, 2025, 9:30 AM</div>
                        </div>
                    `;
                }

                // Show the modal
                notificationModal.show();
            }
        });
    }

    // Special Offers & Promotions Functionalities

    // 1. Get Offer Button - Show Confirmation Message
    const getOfferButtons = document.querySelectorAll('.btn-primary');
    getOfferButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            const offerTitle = this.closest('.card-body').querySelector('.card-title').textContent;
            alert(`You have selected the offer: ${offerTitle}`);
        });
    });

    // 2. Refer Now Button - Redirect to Referral Page
    const referNowButton = document.querySelector('.btn-primary[data-offer="refer"]');
    if (referNowButton) {
        referNowButton.addEventListener('click', function (e) {
            e.preventDefault();
            window.location.href = 'referral.html'; // Redirect to the Referral page
        });
    }

    // 3. Learn More Button - Display More Details
    const learnMoreButton = document.querySelector('.btn-primary[data-offer="premium"]');
    if (learnMoreButton) {
        learnMoreButton.addEventListener('click', function (e) {
            e.preventDefault();
            alert('Upgrade to Premium for unlimited high-speed data and exclusive benefits!');
        });
    }
});



///recharge history

document.addEventListener('DOMContentLoaded', function () {
    // Recharge History Functionalities

    // 1. Filter Transactions
    const filterSelect = document.querySelector('.form-select.form-select-sm');
    if (filterSelect) {
        filterSelect.addEventListener('change', function () {
            const selectedFilter = this.value;
            filterTransactions(selectedFilter);
        });
    }

    // Function to filter transactions
    function filterTransactions(filter) {
        const transactions = document.querySelectorAll('.table tbody tr');
        transactions.forEach(transaction => {
            const transactionDate = new Date(transaction.querySelector('td').textContent);
            const currentDate = new Date();
            let showTransaction = false;

            switch (filter) {
                case 'Last 30 days':
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(currentDate.getDate() - 30);
                    showTransaction = transactionDate >= thirtyDaysAgo;
                    break;
                case 'Last 3 months':
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(currentDate.getMonth() - 3);
                    showTransaction = transactionDate >= threeMonthsAgo;
                    break;
                case 'Last 6 months':
                    const sixMonthsAgo = new Date();
                    sixMonthsAgo.setMonth(currentDate.getMonth() - 6);
                    showTransaction = transactionDate >= sixMonthsAgo;
                    break;
                default:
                    showTransaction = true; // Show all transactions
            }

            // Show/hide the transaction based on the filter
            transaction.style.display = showTransaction ? '' : 'none';
        });
    }

    // 2. View Receipt Button - Open Modal with Transaction Details
    const viewReceiptButtons = document.querySelectorAll('.view-receipt');
    const transactionDetailsModal = new bootstrap.Modal(document.getElementById('transactionDetailsModal'));
    const downloadReceiptButton = document.getElementById('downloadReceiptButton');
    let currentReceiptFile = '';

    viewReceiptButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Get transaction details from data attributes
            const date = this.getAttribute('data-date');
            const plan = this.getAttribute('data-plan');
            const amount = this.getAttribute('data-amount');
            const status = this.getAttribute('data-status');
            const paymentMethod = this.getAttribute('data-payment-method');
            const receiptFile = this.getAttribute('data-receipt');

            // Populate modal with transaction details
            document.getElementById('transactionDate').textContent = date;
            document.getElementById('transactionPlan').textContent = plan;
            document.getElementById('transactionAmount').textContent = amount;
            document.getElementById('transactionStatus').textContent = status;
            document.getElementById('transactionPaymentMethod').textContent = paymentMethod;

            // Store the current receipt file for download
            currentReceiptFile = receiptFile;

            // Show the modal
            transactionDetailsModal.show();
        });
    });

    // 3. Download Receipt - Enable Receipt Download
    if (downloadReceiptButton) {
        downloadReceiptButton.addEventListener('click', function () {
            if (currentReceiptFile) {
                // Create a temporary anchor element to trigger the download
                const downloadLink = document.createElement('a');
                downloadLink.href = `/path/to/receipts/${currentReceiptFile}`; // Update the path to your receipts folder
                downloadLink.download = currentReceiptFile; // Set the file name for download
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);

                // Close the modal after download
                transactionDetailsModal.hide();
            }
        });
    }

    // 4. Pagination Controls - Simulate Switching Between Pages
    const paginationLinks = document.querySelectorAll('.pagination .page-link');
    const transactionsPerPage = 5; // Number of transactions to show per page
    let currentPage = 1;

    paginationLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            // Handle "Previous" and "Next" buttons
            if (this.textContent === 'Previous') {
                if (currentPage > 1) {
                    currentPage--;
                }
            } else if (this.textContent === 'Next') {
                currentPage++;
            } else {
                currentPage = parseInt(this.textContent);
            }

            // Update the active page in the pagination
            paginationLinks.forEach(link => link.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');

            // Show/hide transactions based on the current page
            const transactions = document.querySelectorAll('.table tbody tr');
            transactions.forEach((transaction, index) => {
                const startIndex = (currentPage - 1) * transactionsPerPage;
                const endIndex = startIndex + transactionsPerPage;
                transaction.style.display = (index >= startIndex && index < endIndex) ? '' : 'none';
            });
        });
    });
});



///payment method

document.addEventListener('DOMContentLoaded', function () {
    // Payment Methods Functionalities

    // 1. Add New Card - Open Modal for Adding a New Card
    const addNewCardButton = document.querySelector('.card-header .btn-primary.btn-sm');
    const addCardModal = new bootstrap.Modal(document.getElementById('addCardModal'));

    if (addNewCardButton) {
        addNewCardButton.addEventListener('click', function (e) {
            e.preventDefault();
            addCardModal.show();
        });
    }

    // Handle form submission for adding a new card
    const addCardForm = document.getElementById('addCardForm');
    if (addCardForm) {
        addCardForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form data
            const cardNumber = document.getElementById('cardNumber').value;
            const cardHolder = document.getElementById('cardHolder').value;
            const expiryDate = document.getElementById('expiryDate').value;
            const cvv = document.getElementById('cvv').value;

            // Simulate adding the card (you can replace this with an API call)
            const newCard = {
                type: 'VISA',
                number: cardNumber.slice(-4),
                holder: cardHolder,
                expiry: expiryDate,
                isDefault: false
            };

            // Add the new card to the list
            addCardToList(newCard);

            // Close the modal
            addCardModal.hide();

            // Reset the form
            addCardForm.reset();
        });
    }

    // Function to add a new card to the list
    function addCardToList(card) {
        const cardList = document.querySelector('.card-body .row');
        const newCardHtml = `
            <div class="col-md-6 mb-3">
                <div class="card bg-light">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <div>
                                <i class="fab fa-cc-${card.type.toLowerCase()} fa-2x me-2"></i>
                                <span class="fw-bold">${card.type} ending in ${card.number}</span>
                            </div>
                            ${card.isDefault ? '<span class="badge bg-success">Default</span>' : ''}
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <div>
                                <small class="text-muted">Expires: ${card.expiry}</small>
                            </div>
                            <div>
                                <a href="#" class="btn btn-sm btn-outline-primary me-2 edit-card">Edit</a>
                                <a href="#" class="btn btn-sm btn-outline-danger remove-card">Remove</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Append the new card to the list
        cardList.insertAdjacentHTML('beforeend', newCardHtml);

        // Attach event listeners to the new card's buttons
        attachCardEventListeners();
    }

    // 2. Edit Card - Open Modal for Editing a Card
    function attachCardEventListeners() {
        const editCardButtons = document.querySelectorAll('.edit-card');
        const editCardModal = new bootstrap.Modal(document.getElementById('editCardModal'));

        editCardButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();

                // Get card details from the card element
                const cardElement = this.closest('.card.bg-light');
                const cardType = cardElement.querySelector('.fab').classList[1].split('-')[2];
                const cardNumber = cardElement.querySelector('.fw-bold').textContent.split(' ')[3];
                const cardHolder = 'Vinayak Mahadev'; // Replace with actual card holder name
                const expiryDate = cardElement.querySelector('.text-muted').textContent.split(': ')[1];

                // Populate the edit modal with card details
                document.getElementById('editCardNumber').value = cardNumber;
                document.getElementById('editCardHolder').value = cardHolder;
                document.getElementById('editExpiryDate').value = expiryDate;

                // Show the edit modal
                editCardModal.show();
            });
        });

        // Handle form submission for editing a card
        const editCardForm = document.getElementById('editCardForm');
        if (editCardForm) {
            editCardForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Get updated card details
                const cardNumber = document.getElementById('editCardNumber').value;
                const cardHolder = document.getElementById('editCardHolder').value;
                const expiryDate = document.getElementById('editExpiryDate').value;

                // Simulate updating the card (you can replace this with an API call)
                alert('Card details updated successfully!');

                // Close the modal
                editCardModal.hide();
            });
        }
    }

    // 3. Remove Card - Confirm and Remove a Card
    const removeCardButtons = document.querySelectorAll('.remove-card');
    const removeCardModal = new bootstrap.Modal(document.getElementById('removeCardModal'));

    removeCardButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Store the card element to be removed
            const cardElement = this.closest('.col-md-6.mb-3');

            // Show the confirmation modal
            removeCardModal.show();

            // Handle confirmation for removing the card
            const confirmRemoveButton = document.getElementById('confirmRemoveButton');
            if (confirmRemoveButton) {
                confirmRemoveButton.addEventListener('click', function () {
                    // Remove the card element
                    cardElement.remove();

                    // Close the modal
                    removeCardModal.hide();
                });
            }
        });
    });

    // 4. Auto Recharge Settings - Enable/Disable and Configure
    const autoRechargeToggle = document.getElementById('autoRechargeToggle');
    const saveSettingsButton = document.querySelector('#autoRechargeSettingsForm .btn-primary');

    if (autoRechargeToggle) {
        autoRechargeToggle.addEventListener('change', function () {
            const isAutoRechargeEnabled = this.checked;
            alert(`Auto Recharge ${isAutoRechargeEnabled ? 'Enabled' : 'Disabled'}`);
        });
    }

    if (saveSettingsButton) {
        saveSettingsButton.addEventListener('click', function (e) {
            e.preventDefault();

            // Get auto-recharge settings
            const rechargeThreshold = document.getElementById('rechargeThreshold').value;
            const defaultPaymentMethod = document.getElementById('defaultPaymentMethod').value;

            // Simulate saving the settings (you can replace this with an API call)
            alert(`Auto Recharge Settings Saved:\nRecharge Threshold: ${rechargeThreshold}\nDefault Payment Method: ${defaultPaymentMethod}`);
        });
    }
});




/////////////////

