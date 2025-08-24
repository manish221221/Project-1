// AI Router Dashboard Application
class AIRouterApp {
    constructor() {
        this.currentView = 'dashboard';
        this.theme = localStorage.getItem('theme') || 'light';
        this.mockData = this.initializeMockData();
        this.charts = {};
        
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupEventListeners();
        this.renderDashboard();
        this.renderConnections();
        this.renderPools();
        this.renderUsage();
        this.setupCharts();
        this.startActivityUpdates();
    }

    initializeMockData() {
        return {
            user: {
                name: 'John Doe',
                email: 'john@example.com'
            },
            connections: [
                {
                    id: 'conn-1',
                    provider: 'OpenAI',
                    label: 'My OpenAI API',
                    status: 'active',
                    lastTested: '2025-08-24T06:30:00Z',
                    usage: { tokens: 45230, cost: 12.45 }
                },
                {
                    id: 'conn-2',
                    provider: 'OpenRouter',
                    label: 'Backup Router',
                    status: 'active',
                    lastTested: '2025-08-24T05:15:00Z',
                    usage: { tokens: 23400, cost: 8.90 }
                },
                {
                    id: 'conn-3',
                    provider: 'Anthropic',
                    label: 'Claude API',
                    status: 'error',
                    lastTested: '2025-08-23T14:22:00Z',
                    usage: { tokens: 0, cost: 0 }
                }
            ],
            pools: [
                {
                    id: 'pool-1',
                    name: 'Study Group',
                    description: 'Shared AI resources for our CS study group',
                    members: 5,
                    role: 'admin',
                    usage: {
                        tokens: 125200,
                        tokensLimit: 200000,
                        cost: 32.15,
                        costLimit: 50.00
                    }
                },
                {
                    id: 'pool-2',
                    name: 'Work Team',
                    description: 'AI tools for project development',
                    members: 8,
                    role: 'member',
                    usage: {
                        tokens: 89500,
                        tokensLimit: 150000,
                        cost: 67.80,
                        costLimit: 100.00
                    }
                }
            ],
            usageData: [
                { date: '2025-08-18', provider: 'OpenAI', model: 'gpt-4', tokens: 2500, cost: 0.05, latency: 1200 },
                { date: '2025-08-19', provider: 'OpenRouter', model: 'claude-3-opus', tokens: 3200, cost: 0.08, latency: 890 },
                { date: '2025-08-20', provider: 'OpenAI', model: 'gpt-3.5-turbo', tokens: 1800, cost: 0.002, latency: 650 },
                { date: '2025-08-21', provider: 'OpenAI', model: 'gpt-4', tokens: 4100, cost: 0.082, latency: 1450 },
                { date: '2025-08-22', provider: 'OpenRouter', model: 'gemini-pro', tokens: 2900, cost: 0.035, latency: 980 },
                { date: '2025-08-23', provider: 'OpenAI', model: 'gpt-4', tokens: 3600, cost: 0.072, latency: 1100 },
                { date: '2025-08-24', provider: 'OpenRouter', model: 'claude-3-opus', tokens: 2100, cost: 0.052, latency: 750 }
            ],
            chatMessages: [
                { role: 'assistant', content: 'Hello! I\'m your AI assistant. How can I help you today?', timestamp: Date.now() - 3600000 }
            ],
            activity: [
                { type: 'chat', message: 'Chat completion via OpenAI GPT-4', time: '5 minutes ago' },
                { type: 'connection', message: 'Connection test successful for OpenRouter', time: '12 minutes ago' },
                { type: 'usage', message: 'Daily usage limit reached for Study Group pool', time: '2 hours ago' },
                { type: 'pool', message: 'New member joined Work Team pool', time: '4 hours ago' },
                { type: 'error', message: 'Connection failed for Anthropic API', time: '6 hours ago' }
            ]
        };
    }

    setupEventListeners() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.bindEventListeners();
            });
        } else {
            this.bindEventListeners();
        }
    }

    bindEventListeners() {
        // Navigation - Fixed to properly handle clicks
        const sidebarLinks = document.querySelectorAll('.sidebar__link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const view = link.getAttribute('data-view');
                if (view) {
                    this.switchView(view);
                }
            });
        });

        // Theme toggle - Fixed
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.toggleTheme();
            });
        }

        // Modals - Fixed
        this.setupModalListeners();

        // Chat - Fixed
        this.setupChatListeners();

        // Settings
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        // Usage filters
        const usagePeriod = document.getElementById('usage-period');
        if (usagePeriod) {
            usagePeriod.addEventListener('change', (e) => {
                this.updateUsagePeriod(e.target.value);
            });
        }
    }

    setupModalListeners() {
        // Add Connection Modal - Fixed
        const addConnBtn = document.getElementById('add-connection-btn');
        const addConnModal = document.getElementById('add-connection-modal');
        const cancelConnBtn = document.getElementById('cancel-connection-btn');
        const saveConnBtn = document.getElementById('save-connection-btn');

        if (addConnBtn && addConnModal) {
            addConnBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                addConnModal.classList.remove('hidden');
            });
        }

        if (cancelConnBtn && addConnModal) {
            cancelConnBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                addConnModal.classList.add('hidden');
            });
        }

        if (saveConnBtn) {
            saveConnBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.addConnection();
            });
        }

        // Create Pool Modal - Fixed
        const createPoolBtn = document.getElementById('create-pool-btn');
        const createPoolModal = document.getElementById('create-pool-modal');
        const cancelPoolBtn = document.getElementById('cancel-pool-btn');
        const savePoolBtn = document.getElementById('save-pool-btn');

        if (createPoolBtn && createPoolModal) {
            createPoolBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                createPoolModal.classList.remove('hidden');
            });
        }

        if (cancelPoolBtn && createPoolModal) {
            cancelPoolBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                createPoolModal.classList.add('hidden');
            });
        }

        if (savePoolBtn) {
            savePoolBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.createPool();
            });
        }

        // Close modals on overlay click
        document.querySelectorAll('.modal__overlay').forEach(overlay => {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    overlay.closest('.modal').classList.add('hidden');
                }
            });
        });

        // Close buttons
        document.querySelectorAll('.modal__close').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.closest('.modal').classList.add('hidden');
            });
        });
    }

    setupChatListeners() {
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-btn');

        const sendMessage = () => {
            if (chatInput) {
                const message = chatInput.value.trim();
                if (message) {
                    this.sendChatMessage(message);
                    chatInput.value = '';
                }
            }
        };

        if (sendBtn) {
            sendBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                sendMessage();
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
    }

    switchView(viewName) {
        console.log('Switching to view:', viewName);
        
        // Update navigation - Fixed to properly handle active states
        const sidebarLinks = document.querySelectorAll('.sidebar__link');
        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-view') === viewName) {
                link.classList.add('active');
            }
        });

        // Update views - Fixed to properly show/hide views
        const views = document.querySelectorAll('.view');
        views.forEach(view => {
            view.classList.remove('active');
        });
        
        const targetView = document.getElementById(`${viewName}-view`);
        if (targetView) {
            targetView.classList.add('active');
        }

        this.currentView = viewName;

        // Initialize chat messages if switching to chat view
        if (viewName === 'chat') {
            this.initializeChatMessages();
        }
    }

    toggleTheme() {
        console.log('Toggling theme from:', this.theme);
        this.theme = this.theme === 'light' ? 'dark' : 'light';
        this.applyTheme();
        localStorage.setItem('theme', this.theme);
        console.log('Theme changed to:', this.theme);
    }

    applyTheme() {
        document.documentElement.setAttribute('data-color-scheme', this.theme);
        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.textContent = this.theme === 'light' ? '🌙' : '☀️';
        }
    }

    initializeChatMessages() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages && chatMessages.children.length === 0) {
            this.addChatMessage('assistant', 'Hello! I\'m your AI assistant. How can I help you today?');
            setTimeout(() => {
                this.addChatMessage('user', 'Can you help me understand how the smart routing works?');
                setTimeout(() => {
                    this.addChatMessage('assistant', 'Absolutely! Our smart routing system automatically selects the best available AI provider based on factors like cost, performance, availability, and your usage limits. It can failover between providers seamlessly and ensures you get the most efficient routing for each request.', 'gpt-4');
                }, 1000);
            }, 500);
        }
    }

    renderDashboard() {
        // Update stats
        const activeConnectionsEl = document.getElementById('active-connections');
        const poolMembershipsEl = document.getElementById('pool-memberships');
        const monthlyCostEl = document.getElementById('monthly-cost');
        const tokensUsedEl = document.getElementById('tokens-used');

        if (activeConnectionsEl) {
            activeConnectionsEl.textContent = this.mockData.connections.filter(c => c.status === 'active').length;
        }
        if (poolMembershipsEl) {
            poolMembershipsEl.textContent = this.mockData.pools.length;
        }
        
        const totalCost = this.mockData.connections.reduce((sum, conn) => sum + conn.usage.cost, 0) +
            this.mockData.pools.reduce((sum, pool) => sum + pool.usage.cost, 0);
        if (monthlyCostEl) {
            monthlyCostEl.textContent = `$${totalCost.toFixed(2)}`;
        }
        
        const totalTokens = this.mockData.connections.reduce((sum, conn) => sum + conn.usage.tokens, 0) +
            this.mockData.pools.reduce((sum, pool) => sum + pool.usage.tokens, 0);
        if (tokensUsedEl) {
            tokensUsedEl.textContent = `${(totalTokens / 1000).toFixed(1)}K`;
        }

        // Render activity
        this.renderActivity();
    }

    renderActivity() {
        const activityList = document.getElementById('activity-list');
        if (!activityList) return;

        const icons = {
            chat: '💬',
            connection: '🔗',
            usage: '📊',
            pool: '👥',
            error: '⚠️'
        };

        activityList.innerHTML = this.mockData.activity.map(item => `
            <div class="activity-item">
                <div class="activity-item__content">
                    <div class="activity-item__icon">${icons[item.type]}</div>
                    <div class="activity-item__text">${item.message}</div>
                </div>
                <div class="activity-item__time">${item.time}</div>
            </div>
        `).join('');
    }

    renderConnections() {
        const connectionsGrid = document.getElementById('connections-grid');
        if (!connectionsGrid) return;

        connectionsGrid.innerHTML = this.mockData.connections.map(conn => `
            <div class="connection-card">
                <div class="connection-card__header">
                    <h3 class="connection-card__title">${conn.label}</h3>
                    <div class="connection-status">
                        <div class="connection-status__indicator ${conn.status === 'active' ? '' : 'connection-status__indicator--error'}"></div>
                        <span>${conn.status}</span>
                    </div>
                </div>
                <div class="connection-card__provider">${conn.provider}</div>
                <div class="connection-card__stats">
                    <div class="usage-metric">
                        <span class="usage-metric__label">Tokens Used</span>
                        <span class="usage-metric__value">${(conn.usage.tokens / 1000).toFixed(1)}K</span>
                    </div>
                    <div class="usage-metric">
                        <span class="usage-metric__label">Cost</span>
                        <span class="usage-metric__value">$${conn.usage.cost.toFixed(2)}</span>
                    </div>
                    <div class="usage-metric">
                        <span class="usage-metric__label">Last Tested</span>
                        <span class="usage-metric__value">${this.formatDate(conn.lastTested)}</span>
                    </div>
                </div>
                <div class="connection-card__actions">
                    <button class="btn btn--sm btn--outline" onclick="app.testConnection('${conn.id}')">Test</button>
                    <button class="btn btn--sm btn--secondary" onclick="app.editConnection('${conn.id}')">Edit</button>
                    <button class="btn btn--sm btn--outline text-error" onclick="app.deleteConnection('${conn.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    renderPools() {
        const poolsGrid = document.getElementById('pools-grid');
        if (!poolsGrid) return;

        poolsGrid.innerHTML = this.mockData.pools.map(pool => {
            const tokenUsagePercent = (pool.usage.tokens / pool.usage.tokensLimit) * 100;
            const costUsagePercent = (pool.usage.cost / pool.usage.costLimit) * 100;
            
            return `
                <div class="pool-card">
                    <div class="pool-card__header">
                        <h3 class="pool-card__title">${pool.name}</h3>
                        <span class="status status--info">${pool.role}</span>
                    </div>
                    <div class="pool-card__description">${pool.description}</div>
                    <div class="pool-card__stats">
                        <div class="pool-stat">
                            <div class="pool-stat__value">${pool.members}</div>
                            <div class="pool-stat__label">Members</div>
                        </div>
                        <div class="pool-stat">
                            <div class="pool-stat__value">${(pool.usage.tokens / 1000).toFixed(1)}K</div>
                            <div class="pool-stat__label">Tokens Used</div>
                        </div>
                    </div>
                    <div class="pool-usage">
                        <div class="usage-metric">
                            <span class="usage-metric__label">Token Usage</span>
                            <span class="usage-metric__value">${tokenUsagePercent.toFixed(1)}%</span>
                        </div>
                        <div class="pool-progress">
                            <div class="pool-progress__bar ${tokenUsagePercent > 80 ? 'pool-progress__bar--warning' : ''}" 
                                 style="width: ${tokenUsagePercent}%"></div>
                        </div>
                        <div class="usage-metric">
                            <span class="usage-metric__label">Cost Usage</span>
                            <span class="usage-metric__value">${costUsagePercent.toFixed(1)}%</span>
                        </div>
                        <div class="pool-progress">
                            <div class="pool-progress__bar ${costUsagePercent > 80 ? 'pool-progress__bar--warning' : ''}" 
                                 style="width: ${costUsagePercent}%"></div>
                        </div>
                    </div>
                    <div class="pool-card__actions">
                        <button class="btn btn--sm btn--primary" onclick="app.viewPool('${pool.id}')">View</button>
                        ${pool.role === 'admin' ? `<button class="btn btn--sm btn--secondary" onclick="app.managePool('${pool.id}')">Manage</button>` : ''}
                        <button class="btn btn--sm btn--outline" onclick="app.leavePool('${pool.id}')">Leave</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    renderUsage() {
        const usageSummary = document.getElementById('usage-summary');
        if (!usageSummary) return;

        const personalUsage = this.mockData.connections.reduce((acc, conn) => {
            acc.tokens += conn.usage.tokens;
            acc.cost += conn.usage.cost;
            return acc;
        }, { tokens: 0, cost: 0, calls: 234 });

        usageSummary.innerHTML = `
            <div class="usage-card">
                <div class="usage-card__header">
                    <h3 class="usage-card__title">Personal Usage</h3>
                </div>
                <div class="usage-card__metrics">
                    <div class="usage-metric">
                        <span class="usage-metric__label">API Calls</span>
                        <span class="usage-metric__value">${personalUsage.calls}</span>
                    </div>
                    <div class="usage-metric">
                        <span class="usage-metric__label">Tokens</span>
                        <span class="usage-metric__value">${(personalUsage.tokens / 1000).toFixed(1)}K</span>
                    </div>
                    <div class="usage-metric">
                        <span class="usage-metric__label">Cost</span>
                        <span class="usage-metric__value">$${personalUsage.cost.toFixed(2)}</span>
                    </div>
                </div>
            </div>
            ${this.mockData.pools.map(pool => `
                <div class="usage-card">
                    <div class="usage-card__header">
                        <h3 class="usage-card__title">${pool.name}</h3>
                        <span class="status status--info">${pool.role}</span>
                    </div>
                    <div class="usage-card__metrics">
                        <div class="usage-metric">
                            <span class="usage-metric__label">My Contribution</span>
                            <span class="usage-metric__value">25%</span>
                        </div>
                        <div class="usage-metric">
                            <span class="usage-metric__label">Pool Tokens</span>
                            <span class="usage-metric__value">${(pool.usage.tokens / 1000).toFixed(1)}K</span>
                        </div>
                        <div class="usage-metric">
                            <span class="usage-metric__label">Pool Cost</span>
                            <span class="usage-metric__value">$${pool.usage.cost.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            `).join('')}
        `;

        this.renderUsageTable();
    }

    renderUsageTable() {
        const usageTable = document.getElementById('usage-table');
        if (!usageTable) return;

        const tbody = usageTable.querySelector('tbody');
        if (tbody) {
            tbody.innerHTML = this.mockData.usageData.map(item => `
                <tr>
                    <td>${this.formatDate(item.date)}</td>
                    <td>${item.provider}</td>
                    <td>${item.model}</td>
                    <td>${item.tokens.toLocaleString()}</td>
                    <td>$${item.cost.toFixed(3)}</td>
                    <td>${item.latency}ms</td>
                </tr>
            `).join('');
        }
    }

    setupCharts() {
        // Add a small delay to ensure canvas elements are available
        setTimeout(() => {
            this.setupUsageChart();
            this.setupProviderChart();
        }, 100);
    }

    setupUsageChart() {
        const ctx = document.getElementById('usage-chart');
        if (!ctx) return;

        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date.toISOString().split('T')[0];
        });

        const usageByDay = last7Days.map(date => {
            const dayUsage = this.mockData.usageData.filter(item => item.date === date);
            return dayUsage.reduce((sum, item) => sum + item.tokens, 0);
        });

        this.charts.usage = new Chart(ctx, {
            type: 'line',
            data: {
                labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
                datasets: [{
                    label: 'Tokens Used',
                    data: usageByDay,
                    borderColor: '#1FB8CD',
                    backgroundColor: 'rgba(31, 184, 205, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return (value / 1000).toFixed(1) + 'K';
                            }
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    }
                }
            }
        });
    }

    setupProviderChart() {
        const ctx = document.getElementById('provider-chart');
        if (!ctx) return;

        const providerUsage = this.mockData.usageData.reduce((acc, item) => {
            acc[item.provider] = (acc[item.provider] || 0) + item.tokens;
            return acc;
        }, {});

        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F'];
        
        this.charts.provider = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(providerUsage),
                datasets: [{
                    data: Object.values(providerUsage),
                    backgroundColor: colors.slice(0, Object.keys(providerUsage).length),
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    sendChatMessage(message) {
        const chatMessages = document.getElementById('chat-messages');
        const modelSelect = document.getElementById('model-select');
        const selectedModel = modelSelect ? modelSelect.value : 'auto';

        // Add user message
        this.addChatMessage('user', message);

        // Simulate API call
        this.showLoading();
        setTimeout(() => {
            this.hideLoading();
            const responses = [
                'I understand your question. Let me help you with that.',
                'That\'s an interesting point. Here\'s what I think...',
                'Based on the information you provided, I can suggest...',
                'I can help you with that. Let me break it down:',
                'Great question! Here\'s my analysis...'
            ];
            const response = responses[Math.floor(Math.random() * responses.length)];
            this.addChatMessage('assistant', response, selectedModel);
            
            // Update activity
            this.mockData.activity.unshift({
                type: 'chat',
                message: `Chat completion via ${selectedModel === 'auto' ? 'Auto-routed' : selectedModel}`,
                time: 'Just now'
            });
            this.renderActivity();
        }, 1500);
    }

    addChatMessage(role, content, model = null) {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;

        const messageEl = document.createElement('div');
        messageEl.className = `chat-message chat-message--${role}`;
        
        const avatar = role === 'user' ? '👤' : '🤖';
        const modelInfo = model && model !== 'auto' ? `<small class="text-secondary"> via ${model}</small>` : '';
        
        messageEl.innerHTML = `
            <div class="chat-message__avatar">${avatar}</div>
            <div class="chat-message__content">
                ${content}${modelInfo}
            </div>
        `;
        
        chatMessages.appendChild(messageEl);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    addConnection() {
        const provider = document.getElementById('connection-provider').value;
        const label = document.getElementById('connection-label').value;
        const key = document.getElementById('connection-key').value;
        const pool = document.getElementById('connection-pool').value;

        if (!label || !key) {
            alert('Please fill in all required fields');
            return;
        }

        const newConnection = {
            id: `conn-${Date.now()}`,
            provider: provider.charAt(0).toUpperCase() + provider.slice(1),
            label,
            status: 'active',
            lastTested: new Date().toISOString(),
            usage: { tokens: 0, cost: 0 }
        };

        this.mockData.connections.push(newConnection);
        this.renderConnections();
        this.renderDashboard();

        // Close modal and reset form
        document.getElementById('add-connection-modal').classList.add('hidden');
        document.getElementById('connection-label').value = '';
        document.getElementById('connection-key').value = '';

        // Update activity
        this.mockData.activity.unshift({
            type: 'connection',
            message: `New connection added: ${label}`,
            time: 'Just now'
        });
        this.renderActivity();
    }

    createPool() {
        const name = document.getElementById('pool-name').value;
        const description = document.getElementById('pool-description').value;
        const tokenLimit = parseInt(document.getElementById('pool-token-limit').value);
        const costLimit = parseFloat(document.getElementById('pool-cost-limit').value);

        if (!name) {
            alert('Please enter a pool name');
            return;
        }

        const newPool = {
            id: `pool-${Date.now()}`,
            name,
            description,
            members: 1,
            role: 'admin',
            usage: {
                tokens: 0,
                tokensLimit: tokenLimit,
                cost: 0,
                costLimit: costLimit
            }
        };

        this.mockData.pools.push(newPool);
        this.renderPools();
        this.renderDashboard();

        // Close modal and reset form
        document.getElementById('create-pool-modal').classList.add('hidden');
        document.getElementById('pool-name').value = '';
        document.getElementById('pool-description').value = '';
        document.getElementById('pool-token-limit').value = '50000';
        document.getElementById('pool-cost-limit').value = '25';

        // Update activity
        this.mockData.activity.unshift({
            type: 'pool',
            message: `New pool created: ${name}`,
            time: 'Just now'
        });
        this.renderActivity();
    }

    testConnection(id) {
        const connection = this.mockData.connections.find(c => c.id === id);
        if (!connection) return;

        this.showLoading();
        setTimeout(() => {
            this.hideLoading();
            connection.lastTested = new Date().toISOString();
            connection.status = Math.random() > 0.8 ? 'error' : 'active';
            this.renderConnections();
            
            const statusMsg = connection.status === 'active' ? 'successful' : 'failed';
            this.mockData.activity.unshift({
                type: 'connection',
                message: `Connection test ${statusMsg} for ${connection.label}`,
                time: 'Just now'
            });
            this.renderActivity();
        }, 1000);
    }

    editConnection(id) {
        alert(`Edit connection functionality would be implemented here for connection ${id}`);
    }

    deleteConnection(id) {
        if (confirm('Are you sure you want to delete this connection?')) {
            const index = this.mockData.connections.findIndex(c => c.id === id);
            if (index !== -1) {
                const connection = this.mockData.connections[index];
                this.mockData.connections.splice(index, 1);
                this.renderConnections();
                this.renderDashboard();
                
                this.mockData.activity.unshift({
                    type: 'connection',
                    message: `Connection deleted: ${connection.label}`,
                    time: 'Just now'
                });
                this.renderActivity();
            }
        }
    }

    viewPool(id) {
        alert(`Pool details view would be implemented here for pool ${id}`);
    }

    managePool(id) {
        alert(`Pool management interface would be implemented here for pool ${id}`);
    }

    leavePool(id) {
        if (confirm('Are you sure you want to leave this pool?')) {
            const index = this.mockData.pools.findIndex(p => p.id === id);
            if (index !== -1) {
                const pool = this.mockData.pools[index];
                this.mockData.pools.splice(index, 1);
                this.renderPools();
                this.renderDashboard();
                
                this.mockData.activity.unshift({
                    type: 'pool',
                    message: `Left pool: ${pool.name}`,
                    time: 'Just now'
                });
                this.renderActivity();
            }
        }
    }

    saveSettings() {
        const routingStrategy = document.getElementById('routing-strategy')?.value;
        const retryAttempts = document.getElementById('retry-attempts')?.value;
        const dailyTokenLimit = document.getElementById('daily-token-limit')?.value;
        const monthlyCostLimit = document.getElementById('monthly-cost-limit')?.value;
        const usageAlerts = document.getElementById('usage-alerts')?.checked;
        const errorNotifications = document.getElementById('error-notifications')?.checked;

        // In a real app, this would save to backend
        console.log('Settings saved:', {
            routingStrategy,
            retryAttempts,
            dailyTokenLimit,
            monthlyCostLimit,
            usageAlerts,
            errorNotifications
        });

        alert('Settings saved successfully!');
    }

    updateUsagePeriod(period) {
        console.log('Updating usage period to:', period);
        // In a real app, this would fetch new data for the selected period
        this.renderUsage();
    }

    startActivityUpdates() {
        // Simulate periodic activity updates
        setInterval(() => {
            if (Math.random() > 0.7) { // 30% chance every 10 seconds
                const activities = [
                    { type: 'chat', message: 'Background chat completion processed', time: 'Just now' },
                    { type: 'usage', message: 'Usage threshold warning triggered', time: 'Just now' },
                    { type: 'connection', message: 'Automatic connection health check completed', time: 'Just now' }
                ];
                const newActivity = activities[Math.floor(Math.random() * activities.length)];
                this.mockData.activity.unshift(newActivity);
                this.mockData.activity = this.mockData.activity.slice(0, 10); // Keep only last 10
                
                if (this.currentView === 'dashboard') {
                    this.renderActivity();
                }
            }
        }, 10000);
    }

    showLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.remove('hidden');
        }
    }

    hideLoading() {
        const loading = document.getElementById('loading');
        if (loading) {
            loading.classList.add('hidden');
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
            if (diffHours === 0) {
                const diffMinutes = Math.floor(diffTime / (1000 * 60));
                return diffMinutes <= 0 ? 'Just now' : `${diffMinutes}m ago`;
            }
            return `${diffHours}h ago`;
        } else if (diffDays === 1) {
            return 'Yesterday';
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    }
}

// Initialize the application when DOM is ready
let app;
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        app = new AIRouterApp();
    });
} else {
    app = new AIRouterApp();
}