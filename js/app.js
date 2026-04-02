const STATE = {
    user: null, theme: localStorage.getItem('theme') || 'light-theme',
    currentInsightPeriod: 'month',
    workerTags: [
        { id: 'hs', label: 'Highly Skilled', rate: 1200, color: '#2563eb' },
        { id: 's', label: 'Skilled', rate: 800, color: '#166534' },
        { id: 'us', label: 'Unskilled', rate: 124, color: '#c2410c' }
    ],
    tagPalette: [
        { bg: '#e0e7ff', text: '#4338ca', label: 'Indigo' },
        { bg: '#d1fae5', text: '#059669', label: 'Emerald' },
        { bg: '#fef3c7', text: '#b45309', label: 'Amber' },
        { bg: '#fce7f3', text: '#db2777', label: 'Rose' },
        { bg: '#cffafe', text: '#0891b2', label: 'Cyan' },
        { bg: '#f5f3ff', text: '#7c3aed', label: 'Violet' },
        { bg: '#f1f5f9', text: '#475569', label: 'Slate' }
    ],
    sites: [
        { id: 'site-1', name: 'Metro Link Phase 1', location: 'Downtown', media: [{ type: 'image', url: 'assets/site1.png' }], createdDate: '2026-03-25', endDate: '2026-12-31', status: 'active' },
        { id: 'site-2', name: 'Highway Bypass', location: 'East Sector', media: [{ type: 'image', url: 'assets/site2.png' }], createdDate: '2026-03-28', endDate: '2026-11-15', status: 'active' },
        { id: 'site-3', name: 'Sunset Residency', location: 'West Sector', media: [{ type: 'image', url: 'https://images.unsplash.com/photo-1503387762-592dea58ef23?auto=format&fit=crop&q=80&w=400' }], createdDate: '2026-03-30', endDate: '2026-04-01', status: 'completed' }
    ], 
    labourEntries: [
        { id: 1775100000000, siteId: 'site-1', counts: { hs: 12, s: 25, us: 45 } },
        { id: 1775186400000, siteId: 'site-1', counts: { hs: 10, s: 20, us: 40 } },
        { id: 1775272800000, siteId: 'site-1', counts: { hs: 15, s: 30, us: 50 } },
        { id: 1775100000000, siteId: 'site-2', counts: { hs: 8, s: 15, us: 30 } },
        { id: 1775186400000, siteId: 'site-2', counts: { hs: 9, s: 18, us: 35 } },
        { id: 1775100000000, siteId: 'site-3', counts: { hs: 5, s: 10, us: 20 } }
    ], 
    expenses: [
        { id: 1775100100000, siteId: 'site-1', category: 'Materials', item: 'Portland Cement (50 bags)', responsible: 'Supervisor Rajesh', amount: 45000 },
        { id: 1775186500000, siteId: 'site-1', category: 'Fuel', item: 'Diesel (200L)', responsible: 'Driver Kumar', amount: 12000 },
        { id: 1775100100000, siteId: 'site-2', category: 'Tools', item: 'Drill Machine (2 units)', responsible: 'Technician Mani', amount: 8500 },
        { id: 1775100100000, siteId: 'site-3', category: 'Materials', item: 'Steel Rods (500kg)', responsible: 'Project Lead Amit', amount: 25000 }
    ],
    supervisors: [
        { id: Date.now() - 1000000, name: 'Rajesh Kumar', age: 42, location: 'Downtown Hub', siteIds: ['site-1'] },
        { id: Date.now() - 500000, name: 'Anjali Sharma', age: 35, location: 'East Extension', siteIds: ['site-2', 'site-1'] }
    ]
};

window._getSiteColor = (siteId) => {
    const index = STATE.sites.findIndex(s => s.id === siteId);
    if (index === -1) return { bg: '#f1f5f9', text: '#64748b' }; 
    return STATE.tagPalette[index % STATE.tagPalette.length];
};

// Global Handlers
window._closeModal = () => {
    const modal = document.getElementById('insight-modal');
    if (modal) modal.classList.remove('active');
};

window._showConfirmModal = ({ title, message, onConfirm }) => {
    const modal = document.getElementById('insight-modal');
    const body = document.getElementById('modal-body');
    const modalTitle = document.getElementById('modal-title');
    
    modalTitle.textContent = title || 'Confirm Action';
    
    body.innerHTML = `
        <div style="text-align:center; padding: 1.5rem 0;">
            <div class="stat-icon-circle" style="background:#fef2f2; color:#ef4444; margin: 0 auto 1.5rem; width: 64px; height: 64px; font-size: 1.75rem; display:flex; align-items:center; justify-content:center; border-radius:50%;">
                <i class="fas fa-exclamation-circle"></i>
            </div>
            <h4 style="margin-bottom:0.75rem; font-size:1.15rem; font-weight:700;">${title}</h4>
            <p style="color:var(--text-muted); font-size:0.95rem; line-height:1.5; margin-bottom:2rem; max-width:300px; margin-left:auto; margin-right:auto;">
                ${message}
            </p>
            <div style="display:flex; gap: 1rem;">
                <button id="modal-confirm-btn" class="btn-primary" style="flex:1; background:#ef4444;">Proceed</button>
                <button type="button" class="btn-ghost" onclick="window._closeModal()" style="flex:1; border: 1px solid #e2e8f0; border-radius:12px;">Cancel</button>
            </div>
        </div>
    `;
    
    document.getElementById('modal-confirm-btn').addEventListener('click', () => {
        onConfirm();
        window._closeModal();
    });
    
    modal.classList.add('active');
};

window._showAddTag = () => {
    const modal = document.getElementById('insight-modal');
    const body = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    
    title.textContent = 'Add New Worker Category';
    
    body.innerHTML = `
        <form id="add-category-form">
            <div class="input-group">
                <label>Category Name</label>
                <input type="text" id="cat-label" placeholder="e.g. Foreman, Electrician" required>
            </div>
            <div class="input-group">
                <label>Daily Rate (₹)</label>
                <input type="number" id="cat-rate" placeholder="800" required>
            </div>
            <div style="display:flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn-primary" style="flex:1">Add Category</button>
                <button type="button" class="btn-ghost" onclick="window._closeModal()" style="flex:1; border: 1px solid #e2e8f0; border-radius:12px;">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('add-category-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const label = document.getElementById('cat-label').value.trim();
        const rate = document.getElementById('cat-rate').value;
        
        if (!label || !rate || isNaN(rate)) return;
        
        const color = STATE.tagPalette[STATE.workerTags.length % STATE.tagPalette.length];
        const id = label.toLowerCase().replace(/[^a-z0-9]/g, '-');
        STATE.workerTags.push({ id, label, rate: parseInt(rate), color });
        
        window._closeModal();
        renderLabourSetup();
    });
    
    modal.classList.add('active');
};

window._deleteTag = (id) => {
    const tag = STATE.workerTags.find(t => t.id === id);
    if (!tag) return;

    const modal = document.getElementById('insight-modal');
    const body = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    
    title.textContent = 'Confirm Deletion';
    
    body.innerHTML = `
        <div style="text-align:center; padding: 1rem 0;">
            <div class="stat-icon-circle" style="background:#fef2f2; color:#ef4444; margin: 0 auto 1.5rem; width: 60px; height: 60px; font-size: 1.5rem;">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h4 style="margin-bottom:1rem; font-size:1.1rem;">Delete "${tag.label}"?</h4>
            <p style="color:var(--text-muted); font-size:0.9rem; margin-bottom:2rem;">
                This will hide this category for new entries. Existing logs will not be removed.
            </p>
            <div style="display:flex; gap: 1rem;">
                <button id="confirm-delete-btn" class="btn-primary" style="flex:1; background:#ef4444;">Delete Category</button>
                <button type="button" class="btn-ghost" onclick="window._closeModal()" style="flex:1; border: 1px solid #e2e8f0; border-radius:12px;">Cancel</button>
            </div>
        </div>
    `;
    
    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
        STATE.workerTags = STATE.workerTags.filter(t => t.id !== id);
        window._closeModal();
        renderLabourSetup();
    });
    
    modal.classList.add('active');
};

window._showEditTag = (id) => {
    const tag = STATE.workerTags.find(t => t.id === id);
    if (!tag) return;

    const modal = document.getElementById('insight-modal');
    const body = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    
    title.textContent = 'Edit Worker Category';
    
    body.innerHTML = `
        <form id="edit-category-form">
            <div class="input-group">
                <label>Category Name</label>
                <input type="text" id="edit-cat-label" value="${tag.label}" required>
            </div>
            <div class="input-group">
                <label>Daily Rate (₹)</label>
                <input type="number" id="edit-cat-rate" value="${tag.rate}" required>
            </div>
            <div style="display:flex; gap: 1rem; margin-top: 2rem;">
                <button type="submit" class="btn-primary" style="flex:1">Save Changes</button>
                <button type="button" class="btn-ghost" onclick="window._closeModal()" style="flex:1; border: 1px solid #e2e8f0; border-radius:12px;">Cancel</button>
            </div>
        </form>
    `;
    
    document.getElementById('edit-category-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const label = document.getElementById('edit-cat-label').value.trim();
        const rate = document.getElementById('edit-cat-rate').value;
        
        if (!label || !rate || isNaN(rate)) return;
        
        tag.label = label;
        tag.rate = parseInt(rate);
        
        window._closeModal();
        renderLabourSetup();
    });
    
    modal.classList.add('active');
};

window._toggleSiteStatus = (siteId) => {
    const site = STATE.sites.find(s => s.id === siteId);
    if (site) {
        site.status = site.status === 'active' ? 'completed' : 'active';
        renderInsights(siteId);
    }
};

document.addEventListener('DOMContentLoaded', () => { 
    localStorage.clear(); 
    initTheme(); initNavigation(); initAuth(); initMobileMenu(); updateHeaderDate(); 
});

function initTheme() {
    document.body.className = STATE.theme;
    const toggle = document.getElementById('theme-toggle');
    const updateIcon = () => { toggle.querySelector('i').className = STATE.theme === 'dark-theme' ? 'fas fa-sun' : 'fas fa-moon'; };
    updateIcon();
    toggle.addEventListener('click', () => {
        STATE.theme = STATE.theme === 'dark-theme' ? 'light-theme' : 'dark-theme';
        document.body.className = STATE.theme;
        localStorage.setItem('theme', STATE.theme);
        updateIcon();
    });
}

function initNavigation() {
    const navItems = document.querySelectorAll('.sidebar nav li');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            switchView(item.dataset.view);
            
            // Close sidebar on mobile after selection
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    });
}

function initMobileMenu() {
    const toggle = document.getElementById('mobile-menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    
    toggle.addEventListener('click', () => {
        sidebar.classList.add('active');
        overlay.classList.add('active');
    });
    
    overlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
    });
}

function initAuth() {
    const portalCards = document.querySelectorAll('.portal-card');
    const welcomeView = document.getElementById('welcome-view');
    const authView = document.getElementById('auth-view');
    const loginForm = document.getElementById('login-form');
    let selectedRole = 'admin';

    portalCards.forEach(card => card.addEventListener('click', () => {
        selectedRole = card.dataset.role;
        document.getElementById('login-title').textContent = selectedRole === 'admin' ? 'Admin Management Portal' : 'Supervisor Portal';
        welcomeView.classList.remove('active');
        authView.classList.add('active');
    }));

    document.getElementById('back-to-welcome').addEventListener('click', () => {
        authView.classList.remove('active');
        welcomeView.classList.add('active');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const mainView = document.getElementById('main-view');
        
        STATE.user = { name: username, role: selectedRole, avatar: `https://ui-avatars.com/api/?name=${username.replace(' ', '+')}&background=6366f1&color=fff` };
        authView.classList.remove('active');
        mainView.classList.add('active');
        
        document.getElementById('user-name-display').textContent = username;
        document.getElementById('user-role-display').textContent = selectedRole === 'admin' ? 'HR Manager' : 'Site Supervisor';
        document.getElementById('user-avatar').src = STATE.user.avatar;
        
        filterSidebarByRole(selectedRole);
        switchView('dashboard');
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
        document.getElementById('main-view').classList.remove('active');
        welcomeView.classList.add('active');
        STATE.user = null;
        loginForm.reset();
    });
}

function filterSidebarByRole(role) {
    const navItems = document.querySelectorAll('.sidebar nav li');
    navItems.forEach(li => {
        const view = li.dataset.view;
        li.style.display = (role === 'supervisor' && (view === 'reports' || view === 'sites')) ? 'none' : 'flex';
    });
}

function switchView(view) {
    const area = document.getElementById('content-area');
    const title = document.getElementById('view-title');
    const subtitle = document.getElementById('view-subtitle');
    
    area.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:300px;"><i class="fas fa-circle-notch fa-spin fa-2x" style="color:var(--primary)"></i></div>';
    
    setTimeout(() => {
        try {
            switch(view) {
                case 'dashboard': title.textContent = 'Organization Overview'; subtitle.textContent = "Welcome back, Admin. Here's what's happening today."; renderDashboard(); break;
                case 'sites': title.textContent = 'Site Vault'; subtitle.textContent = "Manage construction sites and project locations."; renderSites(); break;
                case 'supervisors': title.textContent = 'Supervisor Management'; subtitle.textContent = "Manage site supervisors and their project assignments."; renderSupervisors(); break;
                case 'insights': title.textContent = 'Site Insights'; subtitle.textContent = "Detailed performance analytics for specific projects."; renderInsights(); break;
                case 'setup': title.textContent = 'Work Categories'; subtitle.textContent = "Manage labour roles and daily salary rates."; renderLabourSetup(); break;
                case 'labour': title.textContent = 'Daily Attendance'; subtitle.textContent = "Log daily labour counts for active sites."; renderLabour(); break;
                case 'expenses': title.textContent = 'Expense Tracker'; subtitle.textContent = "Monitor site-wise operational expenses."; renderExpenses(); break;
                case 'reports': title.textContent = 'Analytics & Reports'; subtitle.textContent = "Generate detailed summaries and PDF exports."; renderReports(); break;
            }
        } catch (err) {
            console.error(`Error switching to view ${view}:`, err);
            area.innerHTML = `<div class="glass-card" style="color:#ef4444; border: 1px solid #ef4444;"><h4>Error loading view</h4><p>${err.message}</p></div>`;
        }
    }, 400);
}

function renderDashboard() {
    try {
        const area = document.getElementById('content-area');
        if (!area) return;

        // Calculate stats safely
        const totalLabour = (STATE.labourEntries || []).reduce((acc, l) => {
            const entryCounts = Object.values(l.counts || {}).reduce((a, b) => a + (parseInt(b) || 0), 0);
            return acc + entryCounts;
        }, 0);

        const activeSites = (STATE.sites || []).filter(s => s.status === 'active').length;
        const completedSites = (STATE.sites || []).filter(s => s.status === 'completed').length;
        const totalInvestment = (STATE.expenses || []).reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);

        area.innerHTML = `
            <div class="stats-row animate-in">
                <div class="stat-card">
                    <div class="stat-val"><span>Total Labour Strength</span><h3>${totalLabour}</h3><p>Active Across Sites</p></div>
                    <div class="stat-icon-circle" style="background:#eff6ff; color:#2563eb;"><i class="fas fa-users"></i></div>
                </div>
                <div class="stat-card" style="cursor:pointer" onclick="const s = document.getElementById('portfolio-section'); if(s) s.scrollIntoView({behavior:'smooth'})">
                    <div class="stat-val"><span>Ongoing Sites</span><h3>${activeSites}</h3><p>Click to View Projects</p></div>
                    <div class="stat-icon-circle" style="background:#f0fdf4; color:#22c55e;"><i class="fas fa-hammer"></i></div>
                </div>
                <div class="stat-card" style="cursor:pointer" onclick="const s = document.getElementById('portfolio-section'); if(s) s.scrollIntoView({behavior:'smooth'})">
                    <div class="stat-val"><span>Completed Sites</span><h3>${completedSites}</h3><p>Finished Projects</p></div>
                    <div class="stat-icon-circle" style="background:#f1f5f9; color:#475569;"><i class="fas fa-check-double"></i></div>
                </div>
                <div class="stat-card">
                    <div class="stat-val"><span>Daily Investment</span><h3>₹ ${totalInvestment.toLocaleString()}</h3><p>Today's Expenditure</p></div>
                    <div class="stat-icon-circle" style="background:#fff7ed; color:#f97316;"><i class="fas fa-wallet"></i></div>
                </div>
            </div>

            <div id="portfolio-section" class="glass-card animate-in" style="margin-bottom: 2rem;">
                <div class="table-header" style="flex-wrap: wrap; gap: 1rem;">
                    <h4>Project Portfolio Management</h4>
                    <div style="display:flex; gap: 0.5rem; align-items:center;">
                        <div class="site-select-box" style="margin:0; border:none; padding:0;">
                            <select id="portfolio-filter" onchange="window._filterPortfolio(this.value)" style="font-size:0.85rem; padding: 0.4rem 2rem 0.4rem 1rem;">
                                <option value="all">All Projects</option>
                                <option value="active">Active Only</option>
                                <option value="completed">Completed Only</option>
                            </select>
                        </div>
                        <button class="btn-primary" onclick="switchView('sites')" style="font-size:0.8rem; padding: 0.5rem 1rem;">Go to Site Vault</button>
                    </div>
                </div>
                <div id="portfolio-table-container" style="margin-top: 1rem; overflow-x: auto;">
                    ${window._renderPortfolioTable('all')}
                </div>
            </div>

            <div class="glass-card animate-in">
                <div class="table-header"><h4>Recent Material & Labour Submissions</h4><button class="btn-primary" style="font-size:0.8rem; padding: 0.5rem 1rem;">View All Records</button></div>
                <table>
                    <thead><tr><th>SITE / PROJECT</th><th>ID</th><th>CATEGORY</th><th>SUBMISSION DATE</th><th>STATUS</th></tr></thead>
                    <tbody>
                        ${[...(STATE.labourEntries || []), ...(STATE.expenses || [])].length > 0 ? 
                           [...(STATE.labourEntries || []), ...(STATE.expenses || [])].sort((a,b) => (b.id || 0) - (a.id || 0)).slice(0, 5).map(item => {
                               const site = STATE.sites.find(s => s.id === item.siteId) || { name: 'General' };
                               const safeName = site.name.replace(/[^a-zA-Z\s]/g, '').replace(/\s+/g, '+');
                               return `
                                <tr>
                                    <td><div class="user-cell"><img src="https://ui-avatars.com/api/?name=${safeName}&background=random"><strong>${site.name}</strong></div></td>
                                    <td>${(item.id || '').toString().slice(-6)}</td>
                                    <td>${item.amount ? (item.category || 'Expense') : 'Labour Report'}</td>
                                    <td>${item.id ? new Date(item.id).toLocaleDateString() : 'N/A'}</td>
                                    <td><span class="status-chip status-active">Verified</span></td>
                                </tr>`;
                           }).join('') : `
                            <tr><td colspan="5" style="text-align:center; padding: 2rem; color:var(--text-muted);">No recent activity logged.</td></tr>
                        `}
                    </tbody>
                </table>
            </div>
        `;
    } catch (err) {
        console.error("Error rendering dashboard:", err);
        const area = document.getElementById('content-area');
        if (area) area.innerHTML = `<div class="glass-card" style="color:#ef4444; border: 1px solid #ef4444;"><h4>Oops! Something went wrong while loading the dashboard.</h4><p>${err.message}</p></div>`;
    }
}

window._filterPortfolio = (status) => {
    const container = document.getElementById('portfolio-table-container');
    if (container) {
        container.innerHTML = window._renderPortfolioTable(status);
    }
};

window._renderPortfolioTable = (filter = 'all') => {
    const filteredSites = (STATE.sites || []).filter(s => filter === 'all' || s.status === filter);
    
    if (filteredSites.length === 0) {
        return `<div style="text-align:center; padding: 2rem; color:var(--text-muted);">No ${filter === 'all' ? '' : filter} projects found.</div>`;
    }

    return `
        <table class="portfolio-table">
            <thead>
                <tr>
                    <th>Site Details</th>
                    <th>Location</th>
                    <th>Created On</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                ${filteredSites.map(site => `
                    <tr>
                        <td>
                            <div class="user-cell">
                                <div class="stat-icon-circle" style="background:var(--primary-light); color:var(--primary); width:32px; height:32px; font-size:0.9rem;"><i class="fas fa-building"></i></div>
                                <strong>${site.name || 'Unnamed Site'}</strong>
                            </div>
                        </td>
                        <td><small style="color:var(--text-muted)"><i class="fas fa-map-marker-alt" style="margin-right:4px;"></i>${site.location || 'Unknown'}</small></td>
                        <td>${site.createdDate || 'N/A'}</td>
                        <td>${site.status === 'active' ? `<span style="color:var(--primary); font-weight:600;"><i class="fas fa-spinner fa-spin" style="font-size:0.7rem; margin-right:4px;"></i>Ongoing</span>` : (site.endDate || 'N/A')}</td>
                        <td><span class="status-chip status-${site.status || 'active'}">${(site.status || 'active').toUpperCase()}</span></td>
                        <td>
                            <button class="btn-primary" onclick="window._viewSiteInsights('${site.id}')" style="font-size:0.75rem; padding: 4px 10px;">View Analytics</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
};

window._viewSiteInsights = (siteId) => {
    switchView('insights');
    setTimeout(() => {
        const select = document.getElementById('insight-site-select');
        if (select) {
            select.value = siteId;
            renderInsights(siteId);
        }
    }, 500); // Wait for switchView to render the insights view structure
};

function renderSupervisors() {
    const area = document.getElementById('content-area');
    if (!area) return;

    area.innerHTML = `
        <div class="glass-card animate-in">
            <div class="table-header" style="flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h4>Supervisor Directory</h4>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">Manage site supervisors, age demographics, and project assignments.</p>
                </div>
                <button class="btn-primary" onclick="window._showAddSupervisor()">
                    <i class="fas fa-plus"></i> Add Supervisor
                </button>
            </div>

            <div style="margin-top: 1.5rem; overflow-x: auto;">
                <table class="portfolio-table">
                    <thead>
                        <tr>
                            <th>Supervisor Name</th>
                            <th>Age</th>
                            <th>Location</th>
                            <th>Assigned Site</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${(STATE.supervisors || []).length === 0 ? '<tr><td colspan="5" style="text-align:center; padding:3rem; color:var(--text-muted);">No supervisors registered yet.</td></tr>' : 
                            STATE.supervisors.map(sup => {
                                const assignedSites = (sup.siteIds || []).map(id => STATE.sites.find(s => s.id === id)).filter(Boolean);
                                return `
                                    <tr>
                                        <td>
                                            <div class="user-cell">
                                                <img src="https://ui-avatars.com/api/?name=${sup.name.replace(' ', '+')}&background=f1f5f9&color=6366f1" class="avatar-img" style="width:32px; height:32px;">
                                                <strong>${sup.name}</strong>
                                            </div>
                                        </td>
                                        <td>${sup.age} <small>years</small></td>
                                        <td><small>${sup.location}</small></td>
                                        <td>
                                            <div style="display:flex; gap:4px; flex-wrap:wrap; max-width:200px;">
                                                ${assignedSites.length > 0 ? 
                                                    assignedSites.map(s => {
                                                        const palette = window._getSiteColor(s.id);
                                                        return `<span class="status-chip" style="background:${palette.bg}; color:${palette.text}; font-size:0.65rem; padding: 2px 8px; border: 1px solid ${palette.text}20; font-weight:600;">${s.name}</span>`;
                                                    }).join('') : 
                                                    '<span class="status-chip" style="background:#f1f5f9; color:#64748b; font-size:0.65rem; padding: 2px 8px;">Unassigned</span>'}
                                            </div>
                                        </td>
                                        <td>
                                            <div style="display:flex; gap:0.5rem;">
                                                <button class="btn-ghost" style="color:var(--primary);" onclick="window._showAddSupervisor('${sup.id}')"><i class="fas fa-pencil-alt"></i></button>
                                                <button class="btn-ghost" style="color:#ef4444;" onclick="window._deleteSupervisor('${sup.id}')"><i class="fas fa-trash-alt"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                `;
                            }).join('')
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `;
}

window._showAddSupervisor = (editId = null) => {
    const modal = document.getElementById('insight-modal');
    const body = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    
    const isEdit = editId !== null;
    const supervisor = isEdit ? STATE.supervisors.find(s => s.id == editId) : null;
    
    title.textContent = isEdit ? 'Edit Supervisor Profile' : 'Register New Supervisor';
    
    let selectedSiteIds = isEdit ? [...(supervisor.siteIds || [])] : [];

    const renderTags = () => {
        const container = document.getElementById('sup-tags-container');
        if (!container) return;
        container.innerHTML = selectedSiteIds.map(id => {
            const site = STATE.sites.find(s => s.id === id);
            const palette = window._getSiteColor(id);
            return `
                <div class="status-chip" style="display:flex; align-items:center; gap:6px; padding:6px 12px; font-size:0.8rem; background:${palette.bg}; color:${palette.text}; border: 1px solid ${palette.text}20; font-weight:600;">
                    ${site ? site.name : id}
                    <i class="fas fa-times" onclick="window._removeSupSiteTag('${id}')" style="cursor:pointer; font-size:0.7rem; opacity:0.8;"></i>
                </div>
            `;
        }).join('');
    };

    window._removeSupSiteTag = (id) => {
        selectedSiteIds = selectedSiteIds.filter(sid => sid !== id);
        renderTags();
    };

    const siteOptions = STATE.sites.map(s => `<option value="${s.id}">${s.name}</option>`).join('');

    body.innerHTML = `
        <form id="supervisor-form">
            <div class="input-group">
                <label>Full Name</label>
                <input type="text" id="sup-name" value="${isEdit ? supervisor.name : ''}" placeholder="e.g. John Doe" required>
            </div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div class="input-group">
                    <label>Age</label>
                    <input type="number" id="sup-age" value="${isEdit ? supervisor.age : ''}" placeholder="30" required>
                </div>
                <div class="input-group">
                    <label>Current Location</label>
                    <input type="text" id="sup-location" value="${isEdit ? supervisor.location : ''}" placeholder="e.g. Sector 5" required>
                </div>
            </div>
            <div class="input-group">
                <label>Assign Project(s)</label>
                <div class="site-select-box" style="margin-bottom: 0.75rem; border:1px solid var(--border-color); border-radius:12px;">
                    <select id="sup-site-select" style="padding: 0.8rem 1rem;">
                        <option value="">-- Add a Project --</option>
                        ${siteOptions}
                    </select>
                </div>
                <div id="sup-tags-container" style="display:flex; flex-wrap:wrap; gap:8px;"></div>
                <small style="display:block; margin-top:8px; color:var(--text-muted); font-size:0.75rem;">Selected projects will appear as tags above.</small>
            </div>
            <div style="display:flex; gap: 1rem; margin-top: 2.5rem;">
                <button type="submit" class="btn-primary" style="flex:1">${isEdit ? 'Save Profile' : 'Register Supervisor'}</button>
                <button type="button" class="btn-ghost" onclick="window._closeModal()" style="flex:1; border: 1px solid #e2e8f0; border-radius:12px;">Cancel</button>
            </div>
        </form>
    `;

    // Initialize tags
    setTimeout(renderTags, 0);

    const select = document.getElementById('sup-site-select');
    select.addEventListener('change', (e) => {
        const id = e.target.value;
        if (id && !selectedSiteIds.includes(id)) {
            selectedSiteIds.push(id);
            renderTags();
        }
        e.target.value = ""; // Reset select
    });
    
    document.getElementById('supervisor-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('sup-name').value.trim();
        const age = document.getElementById('sup-age').value;
        const location = document.getElementById('sup-location').value.trim();
        
        if (!name || !age) return;
        
        if (isEdit) {
            supervisor.name = name;
            supervisor.age = parseInt(age);
            supervisor.location = location;
            supervisor.siteIds = selectedSiteIds;
        } else {
            STATE.supervisors.push({
                id: Date.now(),
                name,
                age: parseInt(age),
                location,
                siteIds: selectedSiteIds
            });
        }
        
        window._closeModal();
        renderSupervisors();
    });
    
    modal.classList.add('active');
};

window._deleteSupervisor = (id) => {
    const supervisor = STATE.supervisors.find(s => s.id == id);
    if (!supervisor) return;

    window._showConfirmModal({
        title: 'Delete Supervisor?',
        message: `Are you sure you want to remove <b>${supervisor.name}</b>? This action cannot be undone.`,
        onConfirm: () => {
            STATE.supervisors = STATE.supervisors.filter(s => s.id != id);
            renderSupervisors();
        }
    });
};

function renderSites() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 2fr; gap: 2rem;">
            <div class="glass-card animate-in">
                <h4>Add New Site</h4>
                <form id="site-form" style="margin-top: 1.5rem;">
                    <div class="input-group"><label>Site Name</label><input type="text" id="site-name" placeholder="Skyline Residency" required></div>
                    <div class="input-group"><label>Location</label><input type="text" id="site-loc" placeholder="Sector 45" required></div>
                    <div class="input-group">
                        <label>Site Media (Photos & Videos)</label>
                        <div class="photo-upload" id="site-photo-trigger" style="border: 2px dashed #e2e8f0; padding:1.5rem; text-align:center; border-radius:12px; cursor:pointer;">
                            <i class="fas fa-photo-video fa-2x" style="color:var(--primary); margin-bottom:0.5rem; display:block;"></i>
                            <small>Upload Images & Videos</small>
                            <input type="file" id="site-photo-input" accept="image/*,video/*" multiple style="display:none">
                        </div>
                        <div id="media-previews" class="media-previews"></div>
                    </div>
                    <button type="submit" class="btn-primary" style="width:100%">Add Site</button>
                </form>
            </div>
            <div class="glass-card animate-in">
                <div class="table-header"><h4>Project Vault</h4></div>
                <div id="site-list" style="display:grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem;">
                    ${STATE.sites.map(s => {
                        const hasMedia = s.media && s.media.length > 0;
                        const firstMedia = hasMedia ? s.media[0] : { type: 'image', url: 'https://images.unsplash.com/photo-1541913057-903781e436d1?auto=format&fit=crop&q=80&w=300' };
                        return `
                        <div class="site-card glass-card" style="padding:1.2rem; border-radius:16px;">
                            <div class="media-gallery" id="gal-${s.id}">
                                <div class="main-display" style="position:relative">
                                    ${firstMedia.type === 'image' ? `<img src="${firstMedia.url}" class="featured-media" id="feat-${s.id}">` : `<video src="${firstMedia.url}" class="featured-media" id="feat-${s.id}" controls></video>`}
                                    ${firstMedia.type === 'video' ? `<div class="video-preview-badge"><i class="fas fa-play"></i> Video</div>` : ''}
                                </div>
                                ${hasMedia && s.media.length > 1 ? `
                                    <div class="media-thumbs">
                                        ${s.media.map((m, i) => `
                                            <img src="${m.type === 'video' ? 'https://cdn-icons-png.flaticon.com/512/1179/1179120.png' : m.url}" 
                                                 class="thumb-item ${i === 0 ? 'active' : ''}" 
                                                 onclick="window._switchSiteMedia('${s.id}', ${i})">
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                            <div style="margin-top:0.5rem">
                                <strong style="font-size:1.1rem; color:var(--text-dark)">${s.name}</strong>
                                <p style="font-size:0.85rem; color:var(--text-muted); margin-top:0.2rem;"><i class="fas fa-map-marker-alt" style="margin-right:0.4rem"></i>${s.location}</p>
                                <div style="display:flex; justify-content:space-between; align-items:center; margin-top:1rem; padding-top:1rem; border-top:1px solid #f1f5f9;">
                                    <small style="color:var(--text-muted)">${s.createdDate}</small>
                                    <span class="status-chip status-active" style="padding:2px 8px; font-size:0.7rem">Active</span>
                                </div>
                            </div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        </div>
    `;

    const input = document.getElementById('site-photo-input');
    const trigger = document.getElementById('site-photo-trigger');
    const previewArea = document.getElementById('media-previews');
    let tempMediaArr = [];

    trigger.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            const type = file.type.startsWith('video') ? 'video' : 'image';
            reader.onload = (re) => {
                tempMediaArr.push({ type, url: re.target.result });
                renderTempPreviews();
            };
            reader.readAsDataURL(file);
        });
    });

    function renderTempPreviews() {
        previewArea.innerHTML = tempMediaArr.map((m, idx) => `
            <div class="preview-item">
                ${m.type === 'image' ? `<img src="${m.url}">` : `<video src="${m.url}"></video>`}
                <button class="remove-media" onclick="window._removeMedia(${idx})"><i class="fas fa-times"></i></button>
            </div>
        `).join('');
    }

    window._removeMedia = (idx) => { tempMediaArr.splice(idx, 1); renderTempPreviews(); };
    window._switchSiteMedia = (siteId, index) => {
        const site = STATE.sites.find(s => s.id === siteId);
        if (!site) return;
        const media = site.media[index];
        const display = document.querySelector(`#gal-${siteId} .main-display`);
        const feat = document.getElementById(`feat-${siteId}`);
        
        // Update main content
        if (media.type === 'image') {
            display.innerHTML = `<img src="${media.url}" class="featured-media" id="feat-${siteId}">`;
        } else {
            display.innerHTML = `<video src="${media.url}" class="featured_media" id="feat-${siteId}" controls autoplay></video><div class="video-preview-badge"><i class="fas fa-play"></i> Video</div>`;
        }
        
        // Update active thumbnail
        const thumbs = document.querySelectorAll(`#gal-${siteId} .thumb-item`);
        thumbs.forEach((t, i) => t.classList.toggle('active', i === index));
    };

    document.getElementById('site-form').addEventListener('submit', (e) => {
        e.preventDefault();
        STATE.sites.push({
            id: `site-${Date.now()}`, 
            name: document.getElementById('site-name').value,
            location: document.getElementById('site-loc').value, 
            media: tempMediaArr, 
            createdDate: new Date().toISOString().split('T')[0],
            status: 'active'
        });
        tempMediaArr = [];
        renderSites();
    });
}

function renderLabourSetup() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="glass-card animate-in">
            <div class="table-header"><h4>Manage Worker Roles & Rates</h4><button class="btn-primary" onclick="window._showAddTag()"><i class="fas fa-plus"></i> Add New Category</button></div>
            <table>
                <thead><tr><th>COLOR</th><th>ROLE LABEL</th><th>DAILY RATE (₹)</th><th>ACTIONS</th></tr></thead>
                <tbody>
                    ${STATE.workerTags.map(t => `
                        <tr>
                            <td><div style="width:20px; height:20px; border-radius:4px; background:${t.color}"></div></td>
                            <td><strong>${t.label}</strong></td>
                            <td>₹ ${t.rate}</td>
                            <td>
                                <button class="btn-ghost" onclick="window._showEditTag('${t.id}')" style="color:var(--primary); margin-right:0.5rem;"><i class="fas fa-edit"></i></button>
                                <button class="btn-ghost" onclick="window._deleteTag('${t.id}')" style="color:#ef4444"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderLabour() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="glass-card animate-in" style="max-width: 500px; margin: 0 auto;">
            <h4>Log Attendance</h4>
            <form id="labour-form">
                <div class="input-group"><label>Project Site</label><select id="labour-site" required>${STATE.sites.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
                ${STATE.workerTags.map(t => `<div class="input-group"><label>${t.label} (₹ ${t.rate}/day)</label><input type="number" id="tag-${t.id}" value="0" min="0" required></div>`).join('')}
                <button type="submit" class="btn-primary" style="width:100%">Record Attendance</button>
            </form>
        </div>
    `;
    document.getElementById('labour-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const counts = {};
        STATE.workerTags.forEach(t => counts[t.id] = parseInt(document.getElementById(`tag-${t.id}`).value));
        STATE.labourEntries.push({ id: Date.now(), siteId: document.getElementById('labour-site').value, counts });
        alert('Attendance Recorded!');
        switchView('dashboard');
    });
}

function renderExpenses() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="glass-card animate-in" style="max-width: 500px; margin: 0 auto;">
            <h4>Add Expense</h4>
            <form id="expense-form">
                <div class="input-group"><label>Project Site</label><select id="exp-site" required>${STATE.sites.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}</select></div>
                <div class="input-group"><label>Category</label><select id="exp-cat"><option>Materials</option><option>Fuel</option><option>Tools</option></select></div>
                <div class="input-group"><label>Item Detail</label><input type="text" id="exp-item" placeholder="What was bought? (e.g. 50kg Cement)" required></div>
                <div class="input-group"><label>Responsible Person</label><input type="text" id="exp-resp" placeholder="Who handled the purchase?" required></div>
                <div class="input-group"><label>Amount (₹)</label><input type="number" id="exp-amount" required></div>
                <button type="submit" class="btn-primary" style="width:100%">Log Expense</button>
            </form>
        </div>
    `;
    document.getElementById('expense-form').addEventListener('submit', (e) => {
        e.preventDefault();
        STATE.expenses.push({ 
            id: Date.now(), siteId: document.getElementById('exp-site').value, category: document.getElementById('exp-cat').value, 
            item: document.getElementById('exp-item').value, responsible: document.getElementById('exp-resp').value,
            amount: parseFloat(document.getElementById('exp-amount').value) 
        });
        alert('Expense Logged!');
        switchView('dashboard');
    });
}

function renderReports(period = 'monthly', siteId = 'all') {
    const area = document.getElementById('content-area');
    if (!area) return;

    const now = Date.now();
    const dailyMs = 86400000, weeklyMs = dailyMs * 7, monthlyMs = dailyMs * 30;
    let periodMs = monthlyMs;
    if (period === 'daily') periodMs = dailyMs;
    if (period === 'weekly') periodMs = weeklyMs;
    const startTime = now - periodMs;

    const siteOptions = `<option value="all" ${siteId === 'all' ? 'selected' : ''}>All Sites</option>` + 
        (STATE.sites || []).map(s => `<option value="${s.id}" ${siteId === s.id ? 'selected' : ''}>${s.name}</option>`).join('');

    const filteredSites = siteId === 'all' ? (STATE.sites || []) : (STATE.sites || []).filter(s => s.id === siteId);

    const reportData = filteredSites.map(site => {
        const siteExpenses = (STATE.expenses || []).filter(e => e.siteId === site.id && e.id >= startTime);
        const totalExpenses = siteExpenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);
        const siteLabour = (STATE.labourEntries || []).filter(l => l.siteId === site.id && l.id >= startTime);
        const breakdown = {};
        STATE.workerTags.forEach(tag => { breakdown[tag.id] = siteLabour.reduce((acc, log) => acc + (parseInt(log.counts[tag.id]) || 0), 0); });
        const totalEmployees = Object.values(breakdown).reduce((a, b) => a + b, 0);

        return { ...site, totalExpenses, breakdown, totalEmployees, createdDate: new Date(site.id).toLocaleDateString() };
    });

    const grandTotalExp = reportData.reduce((acc, d) => acc + d.totalExpenses, 0);
    const grandTotalLab = reportData.reduce((acc, d) => acc + d.totalEmployees, 0);
    const grandBreakdown = {};
    STATE.workerTags.forEach(tag => {
        grandBreakdown[tag.id] = reportData.reduce((acc, d) => acc + (d.breakdown[tag.id] || 0), 0);
    });

    area.innerHTML = `
        <div class="glass-card animate-in" style="margin-bottom: 2rem;">
            <div class="table-header" style="flex-wrap: wrap; gap: 1rem;">
                <div>
                    <h4>Consolidated Site Performance Report</h4>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">Aggregated metrics across projects for the selected period.</p>
                </div>
                <div style="display:flex; gap: 0.5rem; align-items:center; flex-wrap:wrap;">
                    <div class="site-select-box" style="margin:0; border:none; padding:0;">
                        <select id="report-site-select" onchange="renderReports(document.getElementById('report-period-select').value, this.value)" style="font-size:0.85rem; padding: 0.4rem 2rem 0.4rem 1rem;">
                            ${siteOptions}
                        </select>
                    </div>
                    <div class="site-select-box" style="margin:0; border:none; padding:0;">
                        <select id="report-period-select" onchange="renderReports(this.value, document.getElementById('report-site-select').value)" style="font-size:0.85rem; padding: 0.4rem 2rem 0.4rem 1rem;">
                            <option value="daily" ${period === 'daily' ? 'selected' : ''}>Today</option>
                            <option value="weekly" ${period === 'weekly' ? 'selected' : ''}>Weekly</option>
                            <option value="monthly" ${period === 'monthly' ? 'selected' : ''}>Monthly Overview</option>
                        </select>
                    </div>
                    <button class="btn-primary" onclick="window._exportReportPDF('${period}', document.getElementById('report-site-select').value)" style="font-size:0.8rem; padding: 0.5rem 1rem; background:var(--primary); color:white;">
                        <i class="fas fa-file-pdf" style="margin-right:6px;"></i> Download PDF
                    </button>
                </div>
            </div>

            <div style="margin-top: 1.5rem; overflow-x: auto;">
                <table class="portfolio-table">
                    <thead><tr><th>Project Detail</th><th>Location</th><th>Status</th><th>Expenses (₹)</th><th>Labour Strength</th><th>View</th></tr></thead>
                    <tbody>
                        ${reportData.map(data => `
                            <tr>
                                <td><div class="user-cell"><div><strong>${data.name}</strong><small style="display:block; font-size:0.7rem;">Created: ${data.createdDate}</small></div></div></td>
                                <td><small>${data.location}</small></td>
                                <td><span class="status-chip status-${data.status || 'active'}">${(data.status || 'active').toUpperCase()}</span></td>
                                <td><strong>₹ ${data.totalExpenses.toLocaleString()}</strong></td>
                                <td>
                                    <div style="display:flex; flex-direction:column; gap:4px;">
                                        <strong>${data.totalEmployees} <small>Heads</small></strong>
                                        <div style="display:flex; gap:4px; flex-wrap:wrap;">
                                            ${STATE.workerTags.map(tag => data.breakdown[tag.id] > 0 ? `<span class="status-chip" style="background:${tag.color}15; color:${tag.color}; border:1px solid ${tag.color}30; font-size:0.6rem; padding: 1px 4px;">${tag.label[0]}:${data.breakdown[tag.id]}</span>` : '').join('')}
                                        </div>
                                    </div>
                                </td>
                                <td><button class="btn-ghost" onclick="window._viewSiteInsights('${data.id}')"><i class="fas fa-eye"></i></button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot style="background:var(--card-bg); border-top:2px solid var(--border-color);">
                        <tr>
                            <td colspan="3" style="text-align:right; font-weight:bold; padding:1rem;">PERIOD TOTALS:</td>
                            <td style="font-weight:bold; color:var(--primary);">₹ ${grandTotalExp.toLocaleString()}</td>
                            <td>
                                <div style="display:flex; flex-direction:column; gap:4px;">
                                    <strong style="color:var(--primary);">${grandTotalLab} <small>Heads</small></strong>
                                    <div style="display:flex; gap:4px; flex-wrap:wrap;">
                                        ${STATE.workerTags.map(tag => grandBreakdown[tag.id] > 0 ? `<span class="status-chip" style="background:${tag.color}25; color:${tag.color}; border:1px solid ${tag.color}50; font-size:0.65rem; font-weight:bold; padding: 2px 6px;">${tag.label}: ${grandBreakdown[tag.id]}</span>` : '').join('')}
                                    </div>
                                </div>
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>

        <div style="display:grid; grid-template-columns: 1fr; gap: 1.5rem; margin-top: 2rem;">
            <!-- Expense Detailed Analysis Card -->
            <div class="glass-card animate-in">
                <div class="table-header" style="flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
                    <div>
                        <h4>Expense Detailed Analysis</h4>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">Granular site-wise expense logs for project auditing.</p>
                    </div>
                    <div style="display:flex; gap: 0.5rem; align-items:center; flex-wrap:wrap;">
                        <div class="site-select-box" style="margin:0; border:none; padding:0;">
                            <select id="expense-site-select" onchange="window._updateExpenseReportTable(document.getElementById('expense-period-select').value, this.value)" style="font-size:0.85rem; padding: 0.4rem 2rem 0.4rem 1rem;">
                                ${siteOptions}
                            </select>
                        </div>
                        <div class="site-select-box" style="margin:0; border:none; padding:0;">
                            <select id="expense-period-select" onchange="window._updateExpenseReportTable(this.value, document.getElementById('expense-site-select').value)" style="font-size:0.85rem; padding: 0.4rem 2rem 0.4rem 1rem;">
                                <option value="daily">Daily View</option>
                                <option value="weekly">Weekly Audit</option>
                                <option value="monthly" selected>Monthly Summary</option>
                            </select>
                        </div>
                        <button class="btn-primary" onclick="window._exportExpensePDF(document.getElementById('expense-period-select').value, document.getElementById('expense-site-select').value)" style="font-size:0.8rem; padding: 0.5rem 1rem; background:var(--primary); color:white;">
                            <i class="fas fa-file-pdf" style="margin-right:6px;"></i> Download PDF
                        </button>
                    </div>
                </div>
                <div id="expense-report-table-content" style="max-height: 400px; overflow-y: auto;">
                    <!-- Table injects here -->
                </div>
            </div>

            <!-- Workforce Intensity Card -->
            <div class="glass-card animate-in">
                <div class="table-header" style="flex-wrap: wrap; gap: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 1rem; margin-bottom: 1rem;">
                    <div>
                        <h4>Workforce Intensity Report</h4>
                        <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">Detailed attendance logs with full skill-level breakdowns.</p>
                    </div>
                    <div style="display:flex; gap: 0.5rem; align-items:center; flex-wrap:wrap;">
                        <div class="site-select-box" style="margin:0; border:none; padding:0;">
                            <select id="labour-site-select" onchange="window._updateLabourReportTable(document.getElementById('labour-period-select').value, this.value)" style="font-size:0.85rem; padding: 0.4rem 2rem 0.4rem 1rem;">
                                ${siteOptions}
                            </select>
                        </div>
                        <div class="site-select-box" style="margin:0; border:none; padding:0;">
                            <select id="labour-period-select" onchange="window._updateLabourReportTable(this.value, document.getElementById('labour-site-select').value)" style="font-size:0.85rem; padding: 0.4rem 2rem 0.4rem 1rem;">
                                <option value="daily">Daily Counts</option>
                                <option value="weekly">Weekly Pulse</option>
                                <option value="monthly" selected>Monthly Intensity</option>
                            </select>
                        </div>
                        <button class="btn-primary" onclick="window._exportLabourPDF(document.getElementById('labour-period-select').value, document.getElementById('labour-site-select').value)" style="font-size:0.8rem; padding: 0.5rem 1rem; background:var(--primary); color:white;">
                            <i class="fas fa-file-pdf" style="margin-right:6px;"></i> Download PDF
                        </button>
                    </div>
                </div>
                <div id="labour-report-table-content" style="max-height: 400px; overflow-y: auto;">
                    <!-- Table injects here -->
                </div>
            </div>
        </div>
    `;

    // Initialize sub-tables
    setTimeout(() => {
        window._updateExpenseReportTable('monthly', siteId);
        window._updateLabourReportTable('monthly', siteId);
    }, 10);
}

window._exportReportPDF = (period, siteId = 'all') => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const now = Date.now();
    const dailyMs = 86400000, weeklyMs = dailyMs * 7, monthlyMs = dailyMs * 30;
    let periodMs = monthlyMs;
    if (period === 'daily') periodMs = dailyMs;
    if (period === 'weekly') periodMs = weeklyMs;
    const startTime = now - periodMs;

    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text("Pepeople Hub - Corporate Report", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Reporting Period: ${period.toUpperCase()} | Site: ${siteId.toUpperCase()}`, 14, 35);
    
    doc.line(14, 40, 196, 40);
    
    let yPos = 50;
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text("Site Performance Summary", 14, yPos);
    yPos += 10;
    
    doc.setFontSize(10);
    doc.setFillColor(248, 250, 252);
    doc.rect(14, yPos, 182, 8, 'F');
    doc.text("SITE NAME", 16, yPos + 6);
    doc.text("STATUS", 70, yPos + 6);
    doc.text("EXPENSE (INR)", 110, yPos + 6);
    doc.text("LABOUR COUNT", 155, yPos + 6);
    yPos += 8;
    
    let gExp = 0;
    let gLab = 0;
    const gBreakdown = {};
    STATE.workerTags.forEach(t => gBreakdown[t.id] = 0);

    const filteredSites = siteId === 'all' ? (STATE.sites || []) : (STATE.sites || []).filter(s => s.id === siteId);

    filteredSites.forEach(site => {
        const siteExpenses = (STATE.expenses || []).filter(e => e.siteId === site.id && e.id >= startTime);
        const totalExp = siteExpenses.reduce((acc, e) => acc + (parseFloat(e.amount) || 0), 0);
        const siteLabour = (STATE.labourEntries || []).filter(l => l.siteId === site.id && l.id >= startTime);
        
        const breakdown = {};
        STATE.workerTags.forEach(tag => {
            const count = siteLabour.reduce((acc, log) => acc + (parseInt(log.counts[tag.id]) || 0), 0);
            breakdown[tag.id] = count;
            gBreakdown[tag.id] += count;
        });
        
        const totalLab = Object.values(breakdown).reduce((a,b) => a+b, 0);
        gExp += totalExp;
        gLab += totalLab;
        
        doc.text(site.name.substring(0, 25), 16, yPos + 6);
        doc.text(site.status.toUpperCase(), 70, yPos + 6);
        doc.text(`Rs. ${totalExp.toLocaleString()}`, 110, yPos + 6);
        doc.text(`${totalLab}`, 155, yPos + 6);
        yPos += 8;
        if (yPos > 270) { doc.addPage(); yPos = 20; }
    });

    yPos += 10;
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235);
    doc.text("PERIOD TOTALS", 14, yPos);
    yPos += 8;
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    doc.text(`Total Expense: Rs. ${gExp.toLocaleString()}`, 14, yPos);
    yPos += 6;
    doc.text(`Total Workforce: ${gLab} (Skill Breakdown below)`, 14, yPos);
    yPos += 6;
    const breakdownStr = STATE.workerTags.map(t => `${t.label[0]}: ${gBreakdown[t.id]}`).join(" | ");
    doc.text(breakdownStr, 14, yPos);
    
    doc.save(`Performance_Report_${period}_${siteId}.pdf`);
};

window._exportExpensePDF = (period, siteId = 'all') => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const now = Date.now();
    const dailyMs = 86400000, weeklyMs = dailyMs * 7, monthlyMs = dailyMs * 30;
    let periodMs = monthlyMs;
    if (period === 'daily') periodMs = dailyMs;
    if (period === 'weekly') periodMs = weeklyMs;
    const startTime = now - periodMs;

    let filtered = (STATE.expenses || []).filter(e => e.id >= startTime);
    if (siteId !== 'all') filtered = filtered.filter(e => e.siteId === siteId);
    
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129); // Green tint for expenses
    doc.text("Detailed Expense Audit", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Reporting Period: ${period.toUpperCase()} | Site: ${siteId.toUpperCase()}`, 14, 30);
    doc.text(`Included Entries: ${filtered.length}`, 14, 35);
    
    doc.line(14, 40, 196, 40);
    
    let y = 50;
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, 182, 8, 'F');
    doc.text("DATE", 16, y + 6);
    doc.text("SITE", 60, y + 6);
    doc.text("CATEGORY/ITEM", 110, y + 6);
    doc.text("AMOUNT", 165, y + 6);
    y += 15;

    filtered.forEach(e => {
        const site = STATE.sites.find(s => s.id === e.siteId);
        const dateStr = new Date(e.id).toLocaleDateString();
        doc.text(dateStr, 16, y);
        doc.text(site?.name.substring(0, 20) || 'General', 60, y);
        doc.text((e.category || e.item || 'Expense').substring(0, 25), 110, y);
        doc.text(`Rs. ${parseFloat(e.amount).toLocaleString()}`, 165, y);
        y += 8;
        if (y > 270) { doc.addPage(); y = 20; }
    });

    const total = filtered.reduce((acc, e) => acc + parseFloat(e.amount), 0);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(16, 185, 129);
    doc.text(`TOTAL AUDITED EXPENSES: Rs. ${total.toLocaleString()}`, 14, y);
    
    doc.save(`Expense_Audit_${period}_${siteId}.pdf`);
};

window._exportLabourPDF = (period, siteId = 'all') => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const now = Date.now();
    const dailyMs = 86400000, weeklyMs = dailyMs * 7, monthlyMs = dailyMs * 30;
    let periodMs = monthlyMs;
    if (period === 'daily') periodMs = dailyMs;
    if (period === 'weekly') periodMs = weeklyMs;
    const startTime = now - periodMs;

    let filtered = (STATE.labourEntries || []).filter(l => l.id >= startTime);
    if (siteId !== 'all') filtered = filtered.filter(l => l.siteId === siteId);
    
    doc.setFontSize(22);
    doc.setTextColor(59, 130, 246); // Blue tint for labour
    doc.text("Workforce Intensity Log", 14, 22);
    
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text(`Reporting Period: ${period.toUpperCase()} | Site: ${siteId.toUpperCase()}`, 14, 30);
    
    doc.line(14, 40, 196, 40);
    
    let y = 50;
    doc.setFillColor(248, 250, 252);
    doc.rect(14, y, 182, 8, 'F');
    doc.text("DATE", 16, y + 6);
    doc.text("SITE", 50, y + 6);
    doc.text("DISTRIBUTION (H|S|U)", 100, y + 6);
    doc.text("TOTAL", 175, y + 6);
    y += 15;

    filtered.forEach(l => {
        const site = STATE.sites.find(s => s.id === l.siteId);
        const dateStr = new Date(l.id).toLocaleDateString();
        const counts = l.counts || {};
        const total = Object.values(counts).reduce((a, b) => a + parseInt(b), 0);
        const dist = STATE.workerTags.map(t => `${t.label[0]}:${counts[t.id] || 0}`).join(" | ");
        
        doc.text(dateStr, 16, y);
        doc.text(site?.name.substring(0, 18) || 'N/A', 50, y);
        doc.setFontSize(8);
        doc.text(dist, 100, y);
        doc.setFontSize(10);
        doc.text(total.toString(), 175, y);
        y += 8;
        if (y > 270) { doc.addPage(); y = 20; }
    });

    const grandTotal = filtered.reduce((acc, l) => acc + Object.values(l.counts || {}).reduce((a, b) => a + parseInt(b), 0), 0);
    y += 10;
    doc.setFontSize(12);
    doc.setTextColor(59, 130, 246);
    doc.text(`TOTAL WORKFORCE STRENGTH: ${grandTotal.toLocaleString()}`, 14, y);
    
    doc.save(`Labour_Intensity_${period}_${siteId}.pdf`);
};

window._updateExpenseReportTable = (period, siteId = 'all') => {
    const container = document.getElementById('expense-report-table-content');
    if (!container) return;

    const now = Date.now();
    const dailyMs = 86400000, weeklyMs = dailyMs * 7, monthlyMs = dailyMs * 30;
    let periodMs = monthlyMs;
    if (period === 'daily') periodMs = dailyMs;
    if (period === 'weekly') periodMs = weeklyMs;
    const startTime = now - periodMs;

    let filtered = (STATE.expenses || []).filter(e => e.id >= startTime);
    if (siteId !== 'all') filtered = filtered.filter(e => e.siteId === siteId);
    
    const total = filtered.reduce((acc, e) => acc + parseFloat(e.amount), 0);

    container.innerHTML = `
        <table class="portfolio-table">
            <thead>
                <tr style="background:var(--card-bg);">
                    <th>DATE</th>
                    <th>SITE</th>
                    <th>CATEGORY/ITEM</th>
                    <th>AMOUNT</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">No transactions found for this period.</td></tr>' : 
                    filtered.map(e => {
                        const site = STATE.sites.find(s => s.id === e.siteId);
                        return `
                            <tr>
                                <td>${new Date(e.id).toLocaleDateString()}</td>
                                <td><small>${site?.name || 'General'}</small></td>
                                <td>${(e.category || e.item || 'Expense')}</td>
                                <td><strong>₹ ${parseFloat(e.amount).toLocaleString()}</strong></td>
                            </tr>
                        `;
                    }).join('')
                }
            </tbody>
        </table>
        <div style="padding: 1.5rem 1rem; border-top: 2px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:var(--success); font-size:1rem;">TOTAL AUDITED EXPENSES: ₹ ${total.toLocaleString()}</strong>
            <small style="color:var(--text-muted);">${filtered.length} Entries</small>
        </div>
    `;
};

window._updateLabourReportTable = (period, siteId = 'all') => {
    const container = document.getElementById('labour-report-table-content');
    if (!container) return;

    const now = Date.now();
    const dailyMs = 86400000, weeklyMs = dailyMs * 7, monthlyMs = dailyMs * 30;
    let periodMs = monthlyMs;
    if (period === 'daily') periodMs = dailyMs;
    if (period === 'weekly') periodMs = weeklyMs;
    const startTime = now - periodMs;

    let filtered = (STATE.labourEntries || []).filter(l => l.id >= startTime);
    if (siteId !== 'all') filtered = filtered.filter(l => l.siteId === siteId);
    
    const totalHeadCount = filtered.reduce((acc, l) => acc + Object.values(l.counts || {}).reduce((a, b) => a + parseInt(b), 0), 0);

    container.innerHTML = `
        <table class="portfolio-table">
            <thead>
                <tr style="background:var(--card-bg);">
                    <th>DATE</th>
                    <th>SITE</th>
                    <th>DISTRIBUTION (H|S|U)</th>
                    <th>TOTAL</th>
                </tr>
            </thead>
            <tbody>
                ${filtered.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding:2rem; color:var(--text-muted);">No attendance logs found for this period.</td></tr>' : 
                    filtered.map(l => {
                        const site = STATE.sites.find(s => s.id === l.siteId);
                        const counts = l.counts || {};
                        const dayTotal = Object.values(counts).reduce((a, b) => a + parseInt(b), 0);
                        return `
                            <tr>
                                <td>${new Date(l.id).toLocaleDateString()}</td>
                                <td><small>${site?.name || 'N/A'}</small></td>
                                <td>
                                    <div style="display:flex; gap:4px; flex-wrap:wrap;">
                                        ${STATE.workerTags.map(t => counts[t.id] > 0 ? `<span class="status-chip" style="background:${t.color}15; color:${t.color}; border:1px solid ${t.color}30; font-size:0.6rem; padding: 1px 4px;">${t.label[0]}:${counts[t.id]}</span>` : '').join('')}
                                    </div>
                                </td>
                                <td><strong>${dayTotal} <small>Heads</small></strong></td>
                            </tr>
                        `;
                    }).join('')
                }
            </tbody>
        </table>
        <div style="padding: 1.5rem 1rem; border-top: 2px solid var(--border-color); display:flex; justify-content:space-between; align-items:center;">
            <strong style="color:var(--primary); font-size:1rem;">TOTAL WORKFORCE STRENGTH: ${totalHeadCount.toLocaleString()} Heads</strong>
            <small style="color:var(--text-muted);">${filtered.length} Logs</small>
        </div>
    `;
};

function renderInsights(siteId = STATE.sites[0]?.id) {
    const area = document.getElementById('content-area');
    if (!siteId) { area.innerHTML = '<div class="glass-card">Please add a site first to see insights.</div>'; return; }
    
    const site = STATE.sites.find(s => s.id === siteId);
    const siteExpenses = STATE.expenses.filter(e => e.siteId === siteId);
    const siteLabour = STATE.labourEntries.filter(l => l.siteId === siteId);
    
    const totalExpAmount = siteExpenses.reduce((acc, e) => acc + e.amount, 0);
    const totalLabourCost = siteLabour.reduce((acc, l) => {
        let entryCost = 0;
        Object.entries(l.counts || {}).forEach(([tagId, count]) => {
            const tag = STATE.workerTags.find(t => t.id === tagId);
            if (tag) entryCost += count * tag.rate;
        });
        return acc + entryCost;
    }, 0);
    const totalSpend = totalExpAmount + totalLabourCost;
    const latestEntry = siteLabour[siteLabour.length - 1];
    const workerCount = latestEntry ? Object.values(latestEntry.counts || {}).reduce((a,b) => a+b, 0) : 0;

    // Aggregate totals by category for the summary row
    const aggregateCounts = {};
    STATE.workerTags.forEach(t => aggregateCounts[t.id] = 0);
    siteLabour.forEach(l => {
        Object.entries(l.counts || {}).forEach(([tid, count]) => {
            if (aggregateCounts[tid] !== undefined) aggregateCounts[tid] += count;
        });
    });

    const totalWorkerBreakdown = STATE.workerTags.map(t => {
        const count = aggregateCounts[t.id] || 0;
        return count > 0 ? `<div style="margin-bottom:4px"><span class="pos-tag" style="background:${t.color}15; color:${t.color}; border:1px solid ${t.color}30">${t.label}: ${count}</span></div>` : '';
    }).filter(t => t !== '').join('');

    area.innerHTML = `
        <div class="insights-header animate-in">
            <div class="site-select-box">
                <label>Viewing Site:</label>
                <select id="insight-site-select">${STATE.sites.map(s => `<option value="${s.id}" ${s.id === siteId ? 'selected' : ''}>${s.name}</option>`).join('')}</select>
            </div>
            <div style="display:flex; align-items:center; gap:1rem;">
                <span class="status-chip status-${site.status}">${site.status.toUpperCase()}</span>
                <button class="btn-primary" onclick="window._toggleSiteStatus('${site.id}')" style="font-size:0.8rem; padding:0.4rem 0.8rem;">Mark ${site.status === 'active' ? 'Completed' : 'Active'}</button>
            </div>
        </div>

        <div class="insight-card-grid animate-in">
            <div class="stat-card" style="cursor:pointer" onclick="window._showExpenseDetails('${siteId}')">
                <div class="stat-val"><span>Total Investment</span><h3>₹ ${totalSpend.toLocaleString()}</h3><p style="font-size:0.7rem; color:var(--text-muted)">Project Lifetime (Click to see detail)</p></div>
                <div class="stat-icon-circle" style="background:#eff6ff; color:#2563eb;"><i class="fas fa-coins"></i></div>
            </div>
            <div class="stat-card" style="cursor:pointer" onclick="window._showLabourDetails('${siteId}')">
                <div class="stat-val"><span>Labour Charges</span><h3>₹ ${totalLabourCost.toLocaleString()}</h3><p style="font-size:0.7rem; color:var(--text-muted)">Salary Paid (Click to see who)</p></div>
                <div class="stat-icon-circle" style="background:#f0fdf4; color:#22c55e;"><i class="fas fa-hand-holding-usd"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-val"><span>Current Strength</span><h3>${workerCount} Workers</h3><p style="font-size:0.7rem; color:var(--text-muted)">Latest Shift</p></div>
                <div class="stat-icon-circle" style="background:#fff7ed; color:#f97316;"><i class="fas fa-hard-hat"></i></div>
            </div>
        </div>

        <div class="chart-container animate-in"><canvas id="siteTrendChart"></canvas></div>

        <div class="glass-card animate-in">
            <div class="table-header"><h4>Detailed Breakdown</h4></div>
            <table>
                <thead><tr><th>PERIOD</th><th>LABOUR COUNT</th><th>SALARY COST</th><th>EXPENSES</th><th>TOTAL</th></tr></thead>
                <tbody>
                    <tr>
                        <td><strong>Total (Lifetime)</strong></td>
                        <td><div style="font-weight:700; margin-bottom:8px">${siteLabour.reduce((acc, l) => acc + Object.values(l.counts || {}).reduce((a,b) => a+b, 0), 0)} Workers</div>${totalWorkerBreakdown}</td>
                        <td>₹ ${totalLabourCost.toLocaleString()}</td>
                        <td>₹ ${totalExpAmount.toLocaleString()}</td>
                        <td><strong>₹ ${totalSpend.toLocaleString()}</strong></td>
                    </tr>
                    ${renderPeriodRows(siteId)}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('insight-site-select').addEventListener('change', (e) => renderInsights(e.target.value));
    initTrendChart(siteId);
}

function renderPeriodRows(siteId) {
    const siteLabour = STATE.labourEntries.filter(l => l.siteId === siteId);
    
    return `
        <tr style="background:#f8fafc"><td colspan="5" style="font-size:0.75rem; font-weight:700; color:var(--text-muted)">BREAKDOWN BY ENTRY</td></tr>
        ${siteLabour.map(l => {
            let cost = 0;
            const tagRows = STATE.workerTags.map(t => {
                const count = l.counts[t.id] || 0;
                cost += count * t.rate;
                return count > 0 ? `<div style="margin-bottom:4px"><span class="pos-tag" style="background:${t.color}15; color:${t.color}; border:1px solid ${t.color}30">${t.label}: ${count}</span></div>` : '';
            }).filter(t => t !== '').join('');

            return `<tr>
                <td>${new Date(l.id).toLocaleDateString()}</td>
                <td><div style="font-weight:700; margin-bottom:8px">${Object.values(l.counts || {}).reduce((a,b) => a+b, 0)} Workers</div>${tagRows}</td>
                <td>₹ ${cost.toLocaleString()}</td>
                <td>-</td>
                <td>₹ ${cost.toLocaleString()}</td>
            </tr>`;
        }).join('')}
    `;
}

function initTrendChart(siteId) {
    const ctx = document.getElementById('siteTrendChart').getContext('2d');
    const labels = ['Jan', 'Feb', 'Mar', 'Apr']; // Mocked for now, dynamically map dates in production
    const datasets = [
        { label: 'Spend Trend', data: [12000, 19000, 15000, 22000], borderColor: '#2563eb', fill: true, backgroundColor: 'rgba(37, 99, 235, 0.05)', tension: 0.4 }
    ];

    const isDark = document.body.classList.contains('dark-theme');
    const color = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(0, 0, 0, 0.05)';

    new Chart(ctx, { 
        type: 'line', 
        data: { labels, datasets }, 
        options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { legend: { display: false } },
            scales: {
                x: { ticks: { color }, grid: { display: false } },
                y: { ticks: { color }, grid: { color: gridColor } }
            }
        } 
    });
}

window._showExpenseDetails = (siteId) => {
    const site = STATE.sites.find(s => s.id === siteId);
    const siteExpenses = STATE.expenses.filter(e => e.siteId === siteId);
    const modal = document.getElementById('insight-modal');
    const body = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    
    title.textContent = `Project Expense Summary - ${site.name}`;
    
    body.innerHTML = `
        <table>
            <thead><tr><th>DATE</th><th>ITEM</th><th>CATEGORY</th><th>RESPONSIBLE</th><th>AMOUNT</th></tr></thead>
            <tbody>
                ${siteExpenses.map(e => `
                    <tr>
                        <td>${new Date(e.id).toLocaleDateString()}</td>
                        <td><strong>${e.item}</strong></td>
                        <td><span class="pos-tag tag-${e.category.toLowerCase()}">${e.category}</span></td>
                        <td>${e.responsible}</td>
                        <td><strong>₹ ${e.amount.toLocaleString()}</strong></td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
    modal.classList.add('active');
};


window._showLabourDetails = (siteId) => {
    const site = STATE.sites.find(s => s.id === siteId);
    const siteLabour = STATE.labourEntries.filter(l => l.siteId === siteId);
    const modal = document.getElementById('insight-modal');
    const body = document.getElementById('modal-body');
    const title = document.getElementById('modal-title');
    
    title.textContent = `Labour Salary Breakdown - ${site.name}`;
    
    body.innerHTML = `
        <table>
            <thead><tr><th>DATE</th><th>POSITION</th><th>SALARY PER DAY</th><th>WORKERS</th><th>TOTAL SALARY</th></tr></thead>
            <tbody>
                ${siteLabour.map(l => {
                    const dateStr = new Date(l.id).toLocaleDateString();
                    return STATE.workerTags.map(t => {
                        const count = l.counts[t.id] || 0;
                        if (count === 0) return '';
                        return `<tr><td>${dateStr}</td><td><span class="pos-tag" style="background:${t.color}15; color:${t.color}; border:1px solid ${t.color}30">${t.label}</span></td><td>₹ ${t.rate}</td><td>${count}</td><td>₹ ${(count * t.rate).toLocaleString()}</td></tr>`;
                    }).join('');
                }).join('')}
            </tbody>
        </table>
    `;
    modal.classList.add('active');
};

function updateHeaderDate() {
    const options = { weekday: 'long', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const dateContainer = document.querySelector('.header-right');
    let clockSpan = document.getElementById('live-clock');
    
    if (!clockSpan) {
        clockSpan = document.createElement('span');
        clockSpan.id = 'live-clock';
        clockSpan.style.fontSize = '0.85rem'; clockSpan.style.color = 'var(--text-muted)';
        dateContainer.prepend(clockSpan);
    }
    
    const updateTime = () => {
        clockSpan.textContent = new Date().toLocaleString('en-US', options);
    };
    
    updateTime();
    setInterval(updateTime, 1000);
}

