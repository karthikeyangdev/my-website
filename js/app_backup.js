// Data Models & State
const STATE = {
    user: null,
    currentView: 'dashboard',
    theme: localStorage.getItem('theme') || 'light-theme',
    sites: [
        { id: 'site-1', name: 'Metro Link Phase 1', location: 'Downtown', photo: null, createdDate: '2026-03-25' },
        { id: 'site-2', name: 'Highway Bypass', location: 'East Sector', photo: null, createdDate: '2026-03-28' }
    ],
    labourEntries: [],
    expenses: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initNavigation();
    initAuth();
    updateHeaderDate();
});

function initTheme() {
    document.body.className = STATE.theme;
    const toggle = document.getElementById('theme-toggle');
    
    const updateIcon = () => {
        toggle.querySelector('i').className = STATE.theme === 'dark-theme' ? 'fas fa-sun' : 'fas fa-moon';
    };

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
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            switchView(item.dataset.view);
        });
    });
}

function initAuth() {
    const portalCards = document.querySelectorAll('.portal-card');
    const welcomeView = document.getElementById('welcome-view');
    const authView = document.getElementById('auth-view');
    const loginForm = document.getElementById('login-form');
    let selectedRole = 'admin';

    portalCards.forEach(card => {
        card.addEventListener('click', () => {
            selectedRole = card.dataset.role;
            document.getElementById('login-title').textContent = selectedRole === 'admin' ? 'Admin Management Portal' : 'Supervisor Portal';
            welcomeView.classList.remove('active');
            authView.classList.add('active');
        });
    });

    document.getElementById('back-to-welcome').addEventListener('click', () => {
        authView.classList.remove('active');
        welcomeView.classList.add('active');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        
        STATE.user = { 
            name: username, 
            role: selectedRole,
            avatar: `https://ui-avatars.com/api/?name=${username.replace(' ', '+')}&background=6366f1&color=fff`
        };

        authView.classList.remove('active');
        document.getElementById('main-view').classList.add('active');
        
        // Update User UI
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
        if (role === 'supervisor' && (view === 'reports' || view === 'sites')) {
            li.style.display = 'none';
        } else {
            li.style.display = 'flex';
        }
    });
}

function switchView(view) {
    STATE.currentView = view;
    const contentArea = document.getElementById('content-area');
    const title = document.getElementById('view-title');
    const subtitle = document.getElementById('view-subtitle');
    
    contentArea.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:300px;"><i class="fas fa-circle-notch fa-spin fa-2x" style="color:var(--primary)"></i></div>';
    
    setTimeout(() => {
        switch(view) {
            case 'dashboard':
                title.textContent = 'Organization Overview';
                subtitle.textContent = "Welcome back, Admin. Here's what's happening today.";
                renderDashboard();
                break;
            case 'sites':
                title.textContent = 'Site Vault';
                subtitle.textContent = "Manage construction sites and project locations.";
                renderSites();
                break;
            case 'labour':
                title.textContent = 'Daily Attendance';
                subtitle.textContent = "Log daily labour counts for active sites.";
                renderLabour();
                break;
            case 'expenses':
                title.textContent = 'Expense Tracker';
                subtitle.textContent = "Monitor site-wise operational expenses.";
                renderExpenses();
                break;
            case 'reports':
                title.textContent = 'Analytics & Reports';
                subtitle.textContent = "Generate detailed summaries and PDF exports.";
                renderReports();
                break;
        }
    }, 400);
}

// Rendering Logic
function renderDashboard() {
    const area = document.getElementById('content-area');
    const totalWorkers = STATE.labourEntries.reduce((acc, e) => acc + e.hs + e.s + e.us, 0) || 1248;
    const siteCount = STATE.sites.length;
    const totalExp = STATE.expenses.reduce((acc, e) => acc + e.amount, 0) || 45200;

    area.innerHTML = `
        <div class="stats-row animate-in">
            <div class="stat-card">
                <div class="stat-val">
                    <span>Total Employees</span>
                    <h3>${totalWorkers.toLocaleString()}</h3>
                    <div class="trend up">+12 this month</div>
                </div>
                <div class="stat-icon-circle" style="background:#eff6ff; color:#2563eb;"><i class="fas fa-users"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-val">
                    <span>Active Sites</span>
                    <h3>${siteCount}</h3>
                    <div class="trend up">Peak Ops</div>
                </div>
                <div class="stat-icon-circle" style="background:#f0fdf4; color:#22c55e;"><i class="fas fa-city"></i></div>
            </div>
             <div class="stat-card">
                <div class="stat-val">
                    <span>Daily Expenses</span>
                    <h3>₹ ${totalExp.toLocaleString()}</h3>
                    <div class="trend" style="background:#fef2f2; color:#ef4444;">Budget Limit</div>
                </div>
                <div class="stat-icon-circle" style="background:#fff7ed; color:#f97316;"><i class="fas fa-wallet"></i></div>
            </div>
            <div class="stat-card">
                <div class="stat-val">
                    <span>Open Roles</span>
                    <h3>24</h3>
                    <div class="trend" style="background:#f0f9ff; color:#0c4a6e;">Hiring Mode</div>
                </div>
                <div class="stat-icon-circle" style="background:#f0fdfa; color:#14b8a6;"><i class="fas fa-briefcase"></i></div>
            </div>
        </div>

        <div class="glass-card animate-in">
            <div class="table-header">
                <h4>Recent Submissions</h4>
                <button class="btn-primary" style="font-size:0.8rem; padding: 0.5rem 1rem;">View All</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>EMPLOYEE / SITE</th>
                        <th>ID / TYPE</th>
                        <th>DEPARTMENT / CATEGORY</th>
                        <th>SUBMISSION DATE</th>
                        <th>STATUS</th>
                    </tr>
                </thead>
                <tbody>
                    ${[...STATE.labourEntries, ...STATE.expenses].sort((a,b) => b.id - a.id).slice(0, 5).map(item => `
                        <tr>
                            <td>
                                <div class="user-cell">
                                    <img src="https://ui-avatars.com/api/?name=${item.siteId || 'Site'}&background=random">
                                    <strong>${STATE.sites.find(s => s.id === item.siteId)?.name || 'General'}</strong>
                                </div>
                            </td>
                            <td>${item.id.toString().slice(-6)}</td>
                            <td>${item.amount ? item.category : 'Labour Report'}</td>
                            <td>${new Date(item.id).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                            <td><span class="status-chip status-active">Verified</span></td>
                        </tr>
                    `).join('') || `
                        <tr>
                            <td>
                                <div class="user-cell">
                                    <img src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=32&h=32">
                                    <strong>Sarah Jenkins</strong>
                                </div>
                            </td>
                            <td>PEP-2134</td>
                            <td>Engineering</td>
                            <td>Oct 12, 2023</td>
                            <td><span class="status-chip status-active">Active</span></td>
                        </tr>
                        <tr>
                            <td>
                                <div class="user-cell">
                                    <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=32&h=32">
                                    <strong>Michael Ross</strong>
                                </div>
                            </td>
                            <td>PEP-2135</td>
                            <td>Finance</td>
                            <td>Oct 14, 2023</td>
                            <td><span class="status-chip status-active">Active</span></td>
                        </tr>
                    `}
                </tbody>
            </table>
        </div>
    `;
}

function renderSites() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div style="display:grid; grid-template-columns: 1fr 2fr; gap: 2rem;">
            <div class="glass-card animate-in">
                <h4>Add New Site</h4>
                <form id="site-form" style="margin-top: 1.5rem;">
                    <div class="input-group">
                        <label>Site Name</label>
                        <input type="text" id="site-name" placeholder="e.g. Skyline Residency" required>
                    </div>
                    <div class="input-group">
                        <label>Location / Address</label>
                        <input type="text" id="site-loc" placeholder="e.g. Sector 45, North Block" required>
                    </div>
                    <div class="input-group">
                        <label>Site Poster / Image</label>
                        <div class="photo-upload" id="site-photo-trigger" style="border: 2px dashed #e2e8f0; padding:1.5rem; text-align:center; border-radius:12px; cursor:pointer;">
                            <i class="fas fa-cloud-upload-alt fa-2x" style="color:var(--primary); margin-bottom:0.5rem; display:block;"></i>
                            <small>Click to upload site photo</small>
                            <input type="file" id="site-photo-input" accept="image/*" style="display:none">
                            <img id="site-photo-preview" style="width:100%; height:120px; object-fit:cover; border-radius:8px; margin-top:1rem; display:none;">
                        </div>
                    </div>
                    <button type="submit" class="btn-primary" style="width:100%">Add Project Site</button>
                </form>
            </div>

            <div class="glass-card animate-in">
                <div class="table-header">
                    <h4>Active Project Vault</h4>
                </div>
                <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1rem;">
                    ${STATE.sites.map(s => `
                        <div class="site-card" style="border: 1px solid #f1f5f9; padding: 1rem; border-radius: 12px; transition: transform 0.2s;">
                            <img src="${s.photo || 'https://images.unsplash.com/photo-1541913057-903781e436d1?auto=format&fit=crop&q=80&w=300'}" style="width:100%; height:100px; object-fit:cover; border-radius: 8px; margin-bottom: 0.8rem;">
                            <strong>${s.name}</strong>
                            <p style="font-size:0.8rem; color:var(--text-muted); margin: 2px 0;">${s.location}</p>
                            <small style="color:var(--primary)">Initialised: ${s.createdDate}</small>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    const input = document.getElementById('site-photo-input');
    const trigger = document.getElementById('site-photo-trigger');
    const preview = document.getElementById('site-photo-preview');

    trigger.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (re) => {
                preview.src = re.target.result;
                preview.style.display = 'block';
                trigger.querySelector('i').style.display = 'none';
                trigger.querySelector('small').style.display = 'none';
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('site-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const photo = preview.src === '#' ? null : preview.src;
        const newSite = {
            id: `site-${Date.now()}`,
            name: document.getElementById('site-name').value,
            location: document.getElementById('site-loc').value,
            photo: photo,
            createdDate: new Date().toISOString().split('T')[0]
        };
        STATE.sites.push(newSite);
        renderSites();
    });
}

function renderLabour() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="glass-card animate-in" style="max-width: 600px; margin: 0 auto;">
            <h4>Daily Site Attendance</h4>
            <form id="labour-form">
                <div class="input-group">
                    <label>Select Project Site</label>
                    <select id="labour-site" required>
                        ${STATE.sites.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div style="display:grid; grid-template-columns: 1fr 1fr 1fr; gap: 1rem;">
                    <div class="input-group">
                        <label>H. Skilled</label>
                        <input type="number" id="labour-hs" value="0">
                    </div>
                    <div class="input-group">
                        <label>Skilled</label>
                        <input type="number" id="labour-s" value="0">
                    </div>
                    <div class="input-group">
                        <label>Unskilled</label>
                        <input type="number" id="labour-us" value="0">
                    </div>
                </div>
                <button type="submit" class="btn-primary" style="width:100%">Post Attendance Data</button>
            </form>
        </div>
    `;

    document.getElementById('labour-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const entry = {
            id: Date.now(),
            siteId: document.getElementById('labour-site').value,
            hs: parseInt(document.getElementById('labour-hs').value),
            s: parseInt(document.getElementById('labour-s').value),
            us: parseInt(document.getElementById('labour-us').value)
        };
        STATE.labourEntries.push(entry);
        alert('Attendance Recorded!');
        switchView('dashboard');
    });
}

function renderExpenses() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="glass-card animate-in" style="max-width: 600px; margin: 0 auto;">
            <h4>New Operational Expense</h4>
            <form id="expense-form">
                <div class="input-group">
                    <label>Project Site</label>
                    <select id="exp-site" required>
                        ${STATE.sites.map(s => `<option value="${s.id}">${s.name}</option>`).join('')}
                    </select>
                </div>
                <div class="input-group">
                    <label>Category</label>
                    <select id="exp-cat">
                        <option>Materials</option>
                        <option>Fuel</option>
                        <option>Tools</option>
                        <option>Transport</option>
                    </select>
                </div>
                <div class="input-group">
                    <label>Amount (₹)</label>
                    <input type="number" id="exp-amount" placeholder="0.00" required>
                </div>
                <button type="submit" class="btn-primary" style="width:100%">Log Expense</button>
            </form>
        </div>
    `;

    document.getElementById('expense-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const entry = {
            id: Date.now(),
            siteId: document.getElementById('exp-site').value,
            category: document.getElementById('exp-cat').value,
            amount: parseFloat(document.getElementById('exp-amount').value)
        };
        STATE.expenses.push(entry);
        alert('Expense Logged!');
        switchView('dashboard');
    });
}

function renderReports() {
    const area = document.getElementById('content-area');
    area.innerHTML = `
        <div class="glass-card animate-in">
            <h4>Generated PDF Center</h4>
            <p>Download system reports for site performance and expenses.</p>
            <div style="margin-top: 2rem; display:flex; gap:1rem;">
                <button class="btn-primary" id="report-labour"><i class="fas fa-file-pdf"></i> Site Labour Report</button>
                <button class="btn-primary" id="report-exp" style="background:#64748b;"><i class="fas fa-file-pdf"></i> Expense Summary</button>
            </div>
        </div>
    `;
    
    document.getElementById('report-labour').addEventListener('click', () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        doc.text("Pepeople Hub - Site Labour Report", 10, 10);
        doc.save("Labour_Report.pdf");
    });
}

function updateHeaderDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date')?.remove(); // Cleanup old span
    const dateSpan = document.createElement('span');
    dateSpan.style.fontSize = '0.85rem';
    dateSpan.style.color = 'var(--text-muted)';
    dateSpan.textContent = new Date().toLocaleDateString('en-US', options);
    document.querySelector('.header-right').insertBefore(dateSpan, document.getElementById('theme-toggle'));
}
