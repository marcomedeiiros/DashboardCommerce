document.addEventListener('DOMContentLoaded', () => {
    const mockData = {
        all: {
            sales: {
                labels: ['2025-05-01', '2025-05-02', '2025-05-03', '2025-05-04', '2025-05-05', '2025-05-06', '2025-05-07'],
                data: [1200, 1900, 1500, 2200, 1800, 2500, 2800]
            },
            activity: {
                labels: ['2025-05-01', '2025-05-02', '2025-05-03', '2025-05-04', '2025-05-05', '2025-05-06', '2025-05-07'],
                activeUsers: [150, 230, 180, 250, 200, 280, 320],
                newUsers: [30, 45, 35, 50, 40, 55, 60]
            },
            inventory: { labels: ['Celular', 'Fones de ouvido', 'Notebook', 'Monitor'], data: [5, 3, 12, 25] },
            customers: { labels: ['18-24', '25-34', '35-44', '45+'], data: [30, 45, 15, 10] },
            reviews: [
                { id: 1, author: 'Eduardo', rating: 5, text: 'Adorei o produto! Entrega rápida e superou as expectativas.', date: '2025-05-18' },
                { id: 2, author: 'Vulgo D', rating: 4, text: 'Ótima qualidade de som. A duração da bateria poderia ser melhor.', date: '2025-05-14' },
            ],
            orders: 184,
            revenue: 24580,
            notifications: [
                { id: 1, type: 'danger', message: 'O produto "Iphone 14 pro max" tem apenas 3 unidades disponíveis em estoque.', date: '2025-05-15T10:30:00', read: false },
                { id: 2, type: 'danger', message: 'O produto "Pc Gamer" tem apenas 5 unidades disponíveis em estoque.', date: '2025-05-14T14:15:00', read: false },
            ]
        },
        electronics: {
            sales: {
                labels: ['2025-05-01', '2025-05-02', '2025-05-03', '2025-05-04', '2025-05-05', '2025-05-06', '2025-05-07'],
                data: [800, 1200, 900, 1500, 1100, 1800, 2000]
            },
            activity: {
                labels: ['2025-05-01', '2025-05-02', '2025-05-03', '2025-05-04', '2025-05-05', '2025-05-06', '2025-05-07'],
                activeUsers: [100, 150, 120, 180, 140, 200, 220],
                newUsers: [20, 30, 25, 35, 30, 40, 45]
            },
            inventory: { labels: ['Celular', 'Fones de ouvido', 'Notebook'], data: [5, 3, 12] },
            customers: { labels: ['18-24', '25-34', '35-44', '45+'], data: [35, 50, 10, 5] },
            reviews: [
                { id: 2, author: 'John S.', rating: 4, text: 'Ótima qualidade de som. A duração da bateria poderia ser melhor.', date: '2025-05-14' },
            ],
            orders: 92,
            revenue: 13799,
            notifications: [
                { id: 1, type: 'danger', message: 'O produto "Headphones Pro" tem apenas 3 unidades restantes em estoque.', date: '2025-05-15T10:30:00', read: false },
            ]
        },
        clothing: {
            sales: {
                labels: ['2025-05-01', '2025-05-02', '2025-05-03', '2025-05-04', '2025-05-05', '2025-05-06', '2025-05-07'],
                data: [400, 700, 600, 700, 700, 700, 800]
            },
            activity: {
                labels: ['2025-05-01', '2025-05-02', '2025-05-03', '2025-05-04', '2025-05-05', '2025-05-06', '2025-05-07'],
                activeUsers: [50, 80, 60, 70, 60, 80, 100],
                newUsers: [10, 15, 10, 15, 10, 15, 15]
            },
            inventory: { labels: ['Camisetas', 'Jeans', 'Jaquetas'], data: [45, 32, 18] },
            customers: { labels: ['18-24', '25-34', '35-44', '45+'], data: [25, 40, 20, 15] },
            reviews: [
                { id: 1, author: 'Maria J.', rating: 5, text: 'Amei o produto! Entrega rápida e superou as expectativas.', date: '2025-05-15' },
            ],
            orders: 92,
            revenue: 10781,
            notifications: [
                { id: 2, type: 'danger', message: 'O produto "Smartphone X9" tem apenas 5 unidades restantes em estoque.', date: '2025-05-14T14:15:00', read: false },
            ]
        }
    };

    let currentData = JSON.parse(JSON.stringify(mockData.all));
    let debounceTimer;
    const chartInstances = {};

    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }

    function formatShortDate(dateString) {
        const options = { month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('pt-BR', options);
    }

    function filterDataByDateRange(data, startDate, endDate) {
        if (!startDate || !endDate) return data;

        const filteredData = JSON.parse(JSON.stringify(data));

        if (filteredData.sales && filteredData.sales.labels) {
            const salesIndices = [];
            filteredData.sales.labels.forEach((date, index) => {
                const currentDate = new Date(date);
                if (currentDate >= startDate && currentDate <= endDate) salesIndices.push(index);
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
                if (currentDate >= startDate && currentDate <= endDate) activityIndices.push(index);
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
            filteredData.orders = filteredData.sales.data.length;
            filteredData.revenue = filteredData.sales.data.reduce((sum, val) => sum + val, 0);
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
            if (chartInstances[id]) {
                chartInstances[id].destroy();
            }
            container.innerHTML = `<canvas id="${id}" role="img" aria-label="Gráfico de ${config.data.datasets[0].label}"></canvas>`;
            const ctx = document.getElementById(id).getContext('2d');
            chartInstances[id] = new Chart(ctx, config);
        }, 500);
    }

    function populateDashboard(data) {
        const salesLabels = data.sales?.labels?.map(formatShortDate) || [];
        const activityLabels = data.activity?.labels?.map(formatShortDate) || [];

        if (data.sales && data.sales.labels.length > 0) {
            renderOrUpdateChart('salesChart', {
                type: 'line',
                data: {
                    labels: salesLabels,
                    datasets: [{
                        label: 'Vendas (R$)',
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
          <p>Não há dados de vendas para os filtros selecionados</p>
        </div>`;
        }

        if (data.inventory && data.inventory.labels.length > 0) {
            renderOrUpdateChart('inventoryChart', {
                type: 'bar',
                data: {
                    labels: data.inventory.labels,
                    datasets: [{
                        label: 'Níveis de Estoque',
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
          <p>Não há dados de estoque para os filtros selecionados</p>
        </div>`;
        }

        if (data.activity && data.activity.labels.length > 0) {
            renderOrUpdateChart('activityChart', {
                type: 'line',
                data: {
                    labels: activityLabels,
                    datasets: [
                        {
                            label: 'Usuários Ativos',
                            data: data.activity.activeUsers,
                            borderColor: 'lightgray',
                            backgroundColor: 'rgba(66, 153, 225, 0.1)',
                            fill: true
                        },
                        {
                            label: 'Novos Usuários',
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
          <p>Não há dados de atividade para os filtros selecionados</p>
        </div>`;
        }

        if (data.customers && data.customers.labels.length > 0) {
            renderOrUpdateChart('customerChart', {
                type: 'doughnut',
                data: {
                    labels: data.customers.labels,
                    datasets: [{
                        label: 'Faixa Etária',
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
          <p>Não há dados demográficos para os filtros selecionados</p>
        </div>`;
        }

        document.getElementById('revenueValue').textContent = `R$ ${(data.revenue || 0).toLocaleString('pt-BR')}`;

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
          <p>Não há avaliações disponíveis para os filtros selecionados</p>
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
            list.innerHTML = `<div class="empty-state"><i class="fas fa-bell-slash"></i><p>Não há notificações para exibir</p></div>`;
        } else {
            list.innerHTML = notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}" data-id="${n.id}" role="listitem" tabindex="0" aria-label="Notificação: ${n.message}">
          <span class="icon ${n.type === 'danger' ? 'danger-icon' : 'info-icon'}"></span>
          <p>${n.message}</p>
          <small>${formatDate(n.date)}</small>
        </div>
      `).join('');
        }
    }

    async function fetchAndPopulateData() {
        try {
            const response = await fetch('https://642d9312bf8cbecdb4f9a3bb.mockapi.io/api/v1/dashboard');
            if (!response.ok) throw new Error('Erro na requisição');
            const apiData = await response.json();

            currentData = apiData;

            const startDateInput = document.getElementById('startDate').value;
            const endDateInput = document.getElementById('endDate').value;
            const startDate = startDateInput ? new Date(startDateInput) : null;
            const endDate = endDateInput ? new Date(endDateInput) : null;

            const filteredData = filterDataByDateRange(currentData, startDate, endDate);

            populateDashboard(filteredData);
            populateNotifications();

        } catch (error) {
            console.error('Erro ao carregar dados da API, usando dados mock:', error);

            populateDashboard(currentData);
            populateNotifications();
        }
    }

    document.getElementById('applyFilters').addEventListener('click', () => {
        const startDate = document.getElementById('startDate').value ? new Date(document.getElementById('startDate').value) : null;
        const endDate = document.getElementById('endDate').value ? new Date(document.getElementById('endDate').value) : null;
        const category = document.getElementById('categoryFilter').value;

        currentData = JSON.parse(JSON.stringify(mockData[category] || mockData.all));
        const filtered = filterDataByDateRange(currentData, startDate, endDate);
        populateDashboard(filtered);
        populateNotifications();
    });


    function onDateFilterChange() {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const startDateInput = document.getElementById('startDate').value;
            const endDateInput = document.getElementById('endDate').value;
            const startDate = startDateInput ? new Date(startDateInput) : null;
            const endDate = endDateInput ? new Date(endDateInput) : null;

            const filteredData = filterDataByDateRange(currentData, startDate, endDate);
            populateDashboard(filteredData);
            populateNotifications();
        }, 400);
    }


    document.getElementById('categoryFilter').addEventListener('change', (e) => {
        const selectedCategory = e.target.value;
        if (selectedCategory && mockData[selectedCategory]) {
            currentData = JSON.parse(JSON.stringify(mockData[selectedCategory]));
        } else {
            currentData = JSON.parse(JSON.stringify(mockData.all));
        }

        onDateFilterChange();
    });

    document.getElementById('startDate').addEventListener('change', onDateFilterChange);
    document.getElementById('endDate').addEventListener('change', onDateFilterChange);

    fetchAndPopulateData();
});

document.body.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-learn-more')) {
        const extraContent = e.target.closest('.card').querySelector('.card-extra-content');
        if (!extraContent) return;
        const isVisible = extraContent.classList.toggle('visible');
        e.target.textContent = isVisible ? 'Mostrar Menos' : 'Saiba Mais';
    }
});



function renderNotifications() {
    const list = document.getElementById("notificationList");
    list.innerHTML = "";
    mockData.notifications.forEach(n => {
        const item = document.createElement("div");
        item.className = "notification-item";
        item.textContent = `${n.date} - ${n.message}`;
        list.appendChild(item);
    });

    const badge = document.getElementById("notificationBadge");
    badge.textContent = mockData.notifications.length;
}

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

