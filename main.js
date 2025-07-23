document.addEventListener('DOMContentLoaded', () => {
    const mockData = {
        all: {
            sales: {
                labels: ['2023-05-01', '2023-05-02', '2023-05-03', '2023-05-04', '2023-05-05', '2023-05-06', '2023-05-07'],
                data: [1200, 1900, 1500, 2200, 1800, 2500, 2800]
            },
            activity: {
                labels: ['2023-05-01', '2023-05-02', '2023-05-03', '2023-05-04', '2023-05-05', '2023-05-06', '2023-05-07'],
                activeUsers: [150, 230, 180, 250, 200, 280, 320],
                newUsers: [30, 45, 35, 50, 40, 55, 60]
            },
            inventory: { labels: ['Smartphone', 'Headphones', 'Notebook', 'Monitor'], data: [5, 3, 12, 25] },
            customers: { labels: ['18-24', '25-34', '35-44', '45+'], data: [30, 45, 15, 10] },
            reviews: [
                { id: 1, author: 'Maria J.', rating: 5, text: 'Love the product! Fast delivery and exceeded expectations.', date: '2023-05-15' },
                { id: 2, author: 'John S.', rating: 4, text: 'Great sound quality. Battery life could be better.', date: '2023-05-14' },
            ],
            orders: 184,
            revenue: 24580,
            notifications: [
                { id: 1, type: 'danger', message: 'Product "Headphones Pro" has only 3 units left in stock.', date: '2023-05-15T10:30:00', read: false },
                { id: 2, type: 'danger', message: 'Product "Smartphone X9" has only 5 units left in stock.', date: '2023-05-14T14:15:00', read: false },
            ]
        },
        electronics: {
            sales: {
                labels: ['2023-05-01', '2023-05-02', '2023-05-03', '2023-05-04', '2023-05-05', '2023-05-06', '2023-05-07'],
                data: [800, 1200, 900, 1500, 1100, 1800, 2000]
            },
            activity: {
                labels: ['2023-05-01', '2023-05-02', '2023-05-03', '2023-05-04', '2023-05-05', '2023-05-06', '2023-05-07'],
                activeUsers: [100, 150, 120, 180, 140, 200, 220],
                newUsers: [20, 30, 25, 35, 30, 40, 45]
            },
            inventory: { labels: ['Smartphone', 'Headphones', 'Notebook'], data: [5, 3, 12] },
            customers: { labels: ['18-24', '25-34', '35-44', '45+'], data: [35, 50, 10, 5] },
            reviews: [
                { id: 2, author: 'John S.', rating: 4, text: 'Great sound quality. Battery life could be better.', date: '2023-05-14' },
            ],
            orders: 92,
            revenue: 13799,
            notifications: [
                { id: 1, type: 'danger', message: 'Product "Headphones Pro" has only 3 units left in stock.', date: '2023-05-15T10:30:00', read: false },
            ]
        },
        clothing: {
            sales: {
                labels: ['2023-05-01', '2023-05-02', '2023-05-03', '2023-05-04', '2023-05-05', '2023-05-06', '2023-05-07'],
                data: [400, 700, 600, 700, 700, 700, 800]
            },
            activity: {
                labels: ['2023-05-01', '2023-05-02', '2023-05-03', '2023-05-04', '2023-05-05', '2023-05-06', '2023-05-07'],
                activeUsers: [50, 80, 60, 70, 60, 80, 100],
                newUsers: [10, 15, 10, 15, 10, 15, 15]
            },
            inventory: { labels: ['T-Shirts', 'Jeans', 'Jackets'], data: [45, 32, 18] },
            customers: { labels: ['18-24', '25-34', '35-44', '45+'], data: [25, 40, 20, 15] },
            reviews: [
                { id: 1, author: 'Maria J.', rating: 5, text: 'Love the product! Fast delivery and exceeded expectations.', date: '2023-05-15' },
            ],
            orders: 92,
            revenue: 10781,
            notifications: [
                { id: 2, type: 'danger', message: 'Product "Smartphone X9" has only 5 units left in stock.', date: '2023-05-14T14:15:00', read: false },
            ]
        }
    };

    let currentData = JSON.parse(JSON.stringify(mockData.all));
    let debounceTimer;
    let chartInstances = {};

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function formatShortDate(dateString) {
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    function filterDataByDateRange(data, startDate, endDate) {
        if (!startDate || !endDate) return data;

        const filteredData = JSON.parse(JSON.stringify(data));


        if (filteredData.sales && filteredData.sales.labels) {
            const salesIndices = [];
            filteredData.sales.labels.forEach((date, index) => {
                const currentDate = new Date(date);
                if (currentDate >= startDate && currentDate <= endDate) {
                    salesIndices.push(index);
                }
            });

            if (salesIndices.length > 0) {
                filteredData.sales.labels = salesIndices.map(i => filteredData.sales.labels[i]);
                filteredData.sales.data = salesIndices.map(i => filteredData.sales.data[i]);
            }
        }

        if (filteredData.activity && filteredData.activity.labels) {
            const activityIndices = [];
            filteredData.activity.labels.forEach((date, index) => {
                const currentDate = new Date(date);
                if (currentDate >= startDate && currentDate <= endDate) {
                    activityIndices.push(index);
                }
            });

            if (activityIndices.length > 0) {
                filteredData.activity.labels = activityIndices.map(i => filteredData.activity.labels[i]);
                filteredData.activity.activeUsers = activityIndices.map(i => filteredData.activity.activeUsers[i]);
                filteredData.activity.newUsers = activityIndices.map(i => filteredData.activity.newUsers[i]);
            }
        }

        if (filteredData.reviews) {
            filteredData.reviews = filteredData.reviews.filter(review => {
                const reviewDate = new Date(review.date);
                return reviewDate >= startDate && reviewDate <= endDate;
            });
        }

        if (filteredData.notifications) {
            filteredData.notifications = filteredData.notifications.filter(notification => {
                const notifDate = new Date(notification.date);
                return notifDate >= startDate && notifDate <= endDate;
            });
        }

        if (filteredData.sales && filteredData.sales.data) {

            filteredData.orders = filteredData.sales.data.reduce((sum, value) => sum + 1, 0);

            filteredData.revenue = filteredData.sales.data.reduce((sum, value) => sum + value, 0);
        }

        return filteredData;
    }

    const chartOptions = (isDonut = false) => ({
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 1000, easing: 'easeOutQuart' },
        plugins: {
            legend: {
                display: true,
                position: isDonut ? 'right' : 'top',
                labels: {
                    color: 'lightgray',
                    font: { family: 'Quicksand', weight: '600', size: 12 },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(45, 55, 72, 0.95)',
                titleColor: 'white',
                bodyColor: 'var(--light-gray)',
                titleFont: { family: 'Quicksand', size: 14, weight: '600' },
                bodyFont: { family: 'Quicksand', size: 12, weight: '500' },
                borderColor: 'rgba(66, 153, 225, 0.5)',
                borderWidth: 1,
                padding: 12,
                cornerRadius: 8,
                displayColors: true,
                usePointStyle: true
            }
        },
        scales: isDonut ? {} : {
            y: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: { color: 'white', font: { family: 'Quicksand', weight: '600' }, padding: 8 }
            },
            x: {
                grid: { color: 'rgba(255, 255, 255, 0.05)', drawBorder: false },
                ticks: { color: 'white', font: { family: 'Quicksand', weight: '600' }, padding: 8 }
            }
        },
        elements: {
            line: { tension: 0.4, borderWidth: 2 },
            point: { radius: 4, hoverRadius: 6, backgroundColor: 'white', borderColor: 'var(--electric-blue)', borderWidth: 2 },
            bar: { borderRadius: 4, borderSkipped: false }
        }
    });

    function renderOrUpdateChart(id, config) {
        const container = document.getElementById(id)?.parentElement;
        if (!container) return;

        container.innerHTML = '<div class="loading-state"><div class="loading-spinner"></div></div>';

        setTimeout(() => {
            if (document.getElementById(id)) {
                if (chartInstances[id]) chartInstances[id].destroy();
            }
            container.innerHTML = `<canvas id="${id}" role="img" aria-label="${config.data.datasets[0].label} chart"></canvas>`;
            const ctx = document.getElementById(id).getContext('2d');
            chartInstances[id] = new Chart(ctx, config);
        }, 500);
    }

    function populateDashboard(data) {

        const salesLabels = data.sales?.labels?.map(label => formatShortDate(label)) || [];
        const activityLabels = data.activity?.labels?.map(label => formatShortDate(label)) || [];

        if (data.sales && data.sales.labels && data.sales.labels.length > 0) {
            renderOrUpdateChart('salesChart', {
                type: 'line',
                data: {
                    labels: salesLabels,
                    datasets: [{
                        label: 'Sales ($)',
                        data: data.sales.data,
                        backgroundColor: 'rgba(66, 153, 225, 0.1)',
                        borderColor: 'lightgray',
                        fill: true
                    }]
                },
                options: chartOptions()
            });
        } else {
            document.querySelector('#salesChart').parentElement.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-chart-line"></i>
                            <p>No sales data available for the selected filters</p>
                        </div>`;
        }

        if (data.inventory && data.inventory.labels && data.inventory.labels.length > 0) {
            renderOrUpdateChart('inventoryChart', {
                type: 'bar',
                data: {
                    labels: data.inventory.labels,
                    datasets: [{
                        label: 'Stock Levels',
                        data: data.inventory.data,
                        backgroundColor: [
                            'rgba(66, 153, 225, 0.7)', 'rgba(72, 187, 120, 0.7)',
                            'rgba(246, 173, 85, 0.7)', 'rgba(245, 101, 101, 0.7)'
                        ].slice(0, data.inventory.labels.length),
                    }]
                },
                options: chartOptions()
            });
        } else {
            document.querySelector('#inventoryChart').parentElement.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-boxes"></i>
                            <p>No inventory data available for the selected filters</p>
                        </div>`;
        }

        if (data.activity && data.activity.labels && data.activity.labels.length > 0) {
            renderOrUpdateChart('activityChart', {
                type: 'line',
                data: {
                    labels: activityLabels,
                    datasets: [
                        {
                            label: 'Active Users',
                            data: data.activity.activeUsers,
                            borderColor: 'lightgray',
                            backgroundColor: 'rgba(66, 153, 225, 0.1)',
                            fill: true
                        },
                        {
                            label: 'New Users',
                            data: data.activity.newUsers,
                            borderColor: 'lightgray',
                            backgroundColor: 'rgba(72, 187, 120, 0.1)',
                            fill: true
                        }
                    ]
                },
                options: chartOptions()
            });
        } else {
            document.querySelector('#activityChart').parentElement.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-users"></i>
                            <p>No activity data available for the selected filters</p>
                        </div>`;
        }

        if (data.customers && data.customers.labels && data.customers.labels.length > 0) {
            renderOrUpdateChart('customerChart', {
                type: 'doughnut',
                data: {
                    labels: data.customers.labels,
                    datasets: [{
                        label: 'Age Group',
                        data: data.customers.data,
                        backgroundColor: [
                            'rgba(66, 153, 225, 0.7)', 'rgba(72, 187, 120, 0.7)',
                            'rgba(246, 173, 85, 0.7)', 'rgba(245, 101, 101, 0.7)'
                        ],
                        borderColor: 'lightgray',
                        borderWidth: 2
                    }]
                },
                options: chartOptions(true)
            });
        } else {
            document.querySelector('#customerChart').parentElement.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-user-friends"></i>
                            <p>No demographic data available for the selected filters</p>
                        </div>`;
        }

        document.getElementById('revenueValue').textContent = data.revenue ? `$${data.revenue.toLocaleString()}` : '$0';
        document.getElementById('ordersValue').textContent = data.orders || '0';

        const reviewsContainer = document.getElementById('reviewsContainer');
        if (data.reviews && data.reviews.length > 0) {
            reviewsContainer.innerHTML = data.reviews.map(review => `
                        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid rgba(255,255,255,0.1);">
                            <div style="display:flex; justify-content:space-between; margin-bottom:5px;">
                                <span style="font-weight:600; color: var(--white)">${review.author}</span>
                                <span style="color:var(--warning);">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</span>
                            </div>
                            <p style="font-size:14px; opacity: 0.8; color: var(--light-gray)">"${review.text}"</p>
                            <div style="font-size:12px; color: var(--light-gray); margin-top:5px;">${formatDate(review.date)}</div>
                        </div>
                    `).join('');
            if (reviewsContainer.lastElementChild) {
                reviewsContainer.lastElementChild.style.borderBottom = 'none';
            }
        } else {
            reviewsContainer.innerHTML = `
                        <div class="empty-state">
                            <i class="fas fa-comment-alt-slash"></i>
                            <p>No reviews available for the selected filters</p>
                        </div>`;
        }
    }

    function populateNotifications() {
        const badge = document.getElementById('notificationBadge');
        const list = document.getElementById('notificationList');
        const notifications = currentData.notifications || [];

        const unreadCount = notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount > 0 ? unreadCount : '';

        if (notifications.length === 0) {
            list.innerHTML = `<div class="empty-state"><i class="fas fa-bell-slash"></i><p>No notifications to display</p></div>`;
        } else {
            list.innerHTML = notifications.map(item => `
                        <div class="notification-item ${item.type} ${item.read ? 'read' : ''}" data-id="${item.id}">
                            ${!item.read ? '<div class="notification-read"></div>' : ''}
                            <p>${item.message}</p>
                            <div class="notification-time">${formatDate(item.date)}</div>
                        </div>
                    `).join('');
        }
    }

    function markNotificationAsRead(id) {
        const notification = currentData.notifications?.find(n => n.id === id);
        if (notification && !notification.read) {
            notification.read = true;
            populateNotifications();
        }
    }

    function showNotificationToast(message, type = 'success') {
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) existingToast.remove();

        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.innerHTML = `<i class="fas ${icon}" style="margin-right: 10px;"></i> ${message}`;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = 1;
            toast.style.transform = 'translate(-50%, 0)';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = 0;
            toast.style.transform = 'translate(-50%, -20px)';
            setTimeout(() => document.body.removeChild(toast), 500);
        }, 3000);
    }

    function applyFilters() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const category = document.getElementById('categoryFilter').value;
            const startDateInput = document.getElementById('startDate');
            const endDateInput = document.getElementById('endDate');

            // Get dates only if inputs have values
            const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
            const endDate = endDateInput.value ? new Date(endDateInput.value) : null;

            // Validate date range if both dates are provided
            if (startDate && endDate && startDate > endDate) {
                showNotificationToast('Start date cannot be after end date', 'error');
                return;
            }

            // Get the base data for the selected category
            let filteredData = JSON.parse(JSON.stringify(mockData[category] || mockData.all));

            // Apply date filtering only if dates are provided
            if (startDate && endDate) {
                filteredData = filterDataByDateRange(filteredData, startDate, endDate);
            }

            currentData = filteredData;
            populateDashboard(currentData);
            populateNotifications();
            showNotificationToast('Filters applied successfully!');
        }, 300);
    }

    function setupEventListeners() {
        document.getElementById('applyFilters').addEventListener('click', applyFilters);

        const notificationBell = document.getElementById('notificationBell');
        const notificationPanel = document.getElementById('notificationPanel');
        const overlay = document.getElementById('overlay');
        const closeNotifications = document.getElementById('closeNotifications');

        const toggleNotifications = () => {
            notificationPanel.classList.toggle('active');
            overlay.classList.toggle('active');
            document.body.style.overflow = notificationPanel.classList.contains('active') ? 'hidden' : '';
        };

        notificationBell.addEventListener('click', toggleNotifications);
        closeNotifications.addEventListener('click', toggleNotifications);
        overlay.addEventListener('click', toggleNotifications);

        document.getElementById('notificationList').addEventListener('click', (e) => {
            const item = e.target.closest('.notification-item');
            if (item) {
                markNotificationAsRead(parseInt(item.dataset.id));
            }
        });

        document.querySelectorAll('.btn-learn-more').forEach(button => {
            button.addEventListener('click', (e) => {
                const extraContent = e.target.closest('.card').querySelector('.card-extra-content');
                const isVisible = extraContent.classList.toggle('visible');
                e.target.textContent = isVisible ? 'Show Less' : 'Learn More';
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && notificationPanel.classList.contains('active')) {
                toggleNotifications();
            }
        });
    }

    function initDashboard() {
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);

        // Format dates for input fields (YYYY-MM-DD)
        document.getElementById('endDate').valueAsDate = today;
        document.getElementById('startDate').valueAsDate = lastWeek;

        populateDashboard(currentData);
        populateNotifications();
        setupEventListeners();
    }

    initDashboard();
});