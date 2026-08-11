/**
 * SENSUS SAÚDE — LÓGICA DA APLICAÇÃO (FRONTEND ENGINE)
 * Estruturado em JS Puro (ES6+) orientado a estados e manipulação DOM.
 */

// ==========================================
// ESTADO DA APLICAÇÃO & DADOS DEMONSTRATIVOS
// ==========================================

const APP_STATE = {
    currentUser: null,
    activePage: 'page-dashboard',
    
    // Dados demonstrativos preparados para futura integração com APIs oficiais (ex: DataSUS/TABNET)
    dashboardData: {
        cases: 12486,
        casesVariation: -2.4,
        vaccinationRate: 84.7,
        activeAlerts: 7,
        monitoredCities: 853
    },

    diseases: [
        { id: 'd1', name: 'Dengue', cases: 8420, inc: '412.5', var: '+14.2%', trend: 'high' },
        { id: 'd2', name: 'Influenza (Gripe)', cases: 2150, inc: '105.3', var: '-5.1%', trend: 'down' },
        { id: 'd3', name: 'COVID-19', cases: 1210, inc: '59.2', var: '+0.8%', trend: 'stable' },
        { id: 'd4', name: 'Chikungunya', cases: 706, inc: '34.6', var: '-12.0%', trend: 'down' }
    ],

    vaccines: [
        { name: 'BCG', target: 'Formas graves de tuberculose', coverage: 91.2, status: 'regular' },
        { name: 'Hepatite B', target: 'Infecção hepática', coverage: 88.5, status: 'regular' },
        { name: 'Poliomielite', target: 'Paralisia infantil', coverage: 79.4, status: 'atencao' },
        { name: 'Pentavalente', target: 'Difteria, tétano, coqueluche, hep B, Hib', coverage: 82.0, status: 'regular' },
        { name: 'Tríplice Viral', target: 'Sarampo, caxumba e rubéola', coverage: 76.8, status: 'atencao' },
        { name: 'Influenza', target: 'Vírus da Gripe (Campanha)', coverage: 85.0, status: 'regular' }
    ],

    alerts: [
        { id: 'a1', level: 'alta', title: 'Surtos de Dengue Notificados', desc: 'Aumento atípico de casos em municípios da região central.', region: 'Região Central / MG', date: 'Hoje, 14:20' },
        { id: 'a2', level: 'atencao', title: 'Cobertura de Poliomielite Abaixo da Meta', desc: 'Índice de vacinação infantil atingiu 79.4% (Meta: 95%).', region: 'Estadual', date: 'Ontem, 09:15' },
        { id: 'a3', level: 'informativo', title: 'Atualização do Calendário de Vacinação', desc: 'Disponibilização da nova dose bivalente nos postos locais.', region: 'Nacional', date: '10 Ago' }
    ],

    familyMembers: []
};

// ==========================================
// INICIALIZAÇÃO DA APLICAÇÃO
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
    initLucideIcons();
    checkAuthSession();
    setupEventListeners();
    setCurrentDateDisplay();
    loadFamilyData();
});

function initLucideIcons() {
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// ==========================================
// AUTENTICAÇÃO E SESSÃO (LOCALSTORAGE)
// ==========================================

function checkAuthSession() {
    const savedUser = localStorage.getItem('sensus_user_email');
    if (savedUser) {
        APP_STATE.currentUser = savedUser;
        showAppScreen();
    } else {
        showLoginScreen();
    }
}

function handleLogin(event) {
    event.preventDefault();
    const emailInput = document.getElementById('login-email');
    const errorMsg = document.getElementById('email-error');
    const email = emailInput.value.trim();

    if (validateEmail(email)) {
        errorMsg.style.display = 'none';
        localStorage.setItem('sensus_user_email', email);
        APP_STATE.currentUser = email;
        showAppScreen();
    } else {
        errorMsg.style.display = 'block';
    }
}

function handleLogout() {
    localStorage.removeItem('sensus_user_email');
    APP_STATE.currentUser = null;
    showLoginScreen();
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showLoginScreen() {
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('app-screen').classList.add('hidden');
}

function showAppScreen() {
    document.getElementById('login-screen').classList.add('hidden');
    document.getElementById('app-screen').classList.remove('hidden');
    
    // Atualizar e-mail na tela de configurações
    const emailDisplay = document.getElementById('settings-user-email');
    if(emailDisplay) emailDisplay.textContent = APP_STATE.currentUser;

    // Renderizar dados iniciais
    renderDashboardMetrics();
    renderChart();
    renderRecentAlertsMini();
    renderDiseasesTable();
    renderVaccinesGrid();
    renderFullAlerts();
    renderFamilyList();
}

// ==========================================
// NAVEGAÇÃO E REGRAS DE INTERFACE
// ==========================================

function setupEventListeners() {
    // Form de Login
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);

    // Navegação Sidebar
    const navButtons = document.querySelectorAll('.nav-item');
    navButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetPage = btn.getAttribute('data-target');
            switchPage(targetPage);
            
            // Fechar menu mobile se estiver aberto
            const sidebar = document.getElementById('sidebar');
            if (sidebar.classList.contains('open')) {
                sidebar.classList.remove('open');
            }
        });
    });

    // Triggers de links no texto
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link-trigger')) {
            const target = e.target.getAttribute('data-target');
            switchPage(target);
        }
    });

    // Menu Mobile Toggle
    const mobileToggle = document.getElementById('mobile-menu-toggle');
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            document.getElementById('sidebar').classList.toggle('open');
        });
    }

    // Modal Familiares
    const openModalBtn = document.getElementById('open-add-family-modal');
    const closeModalBtn = document.getElementById('close-family-modal');
    const cancelModalBtn = document.getElementById('cancel-family-modal');
    const familyForm = document.getElementById('family-form');

    if (openModalBtn) openModalBtn.addEventListener('click', () => toggleModal(true));
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => toggleModal(false));
    if (cancelModalBtn) cancelModalBtn.addEventListener('click', () => toggleModal(false));
    if (familyForm) familyForm.addEventListener('submit', handleAddFamilyMember);

    // Filtros
    setupFilterGroup('diseases-filter', filterDiseases);
    setupFilterGroup('alerts-filter', filterAlerts);
}

function switchPage(pageId) {
    APP_STATE.activePage = pageId;

    // Esconder todas as páginas
    document.querySelectorAll('.view-page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });

    // Mostrar página selecionada
    const targetNode = document.getElementById(pageId);
    if (targetNode) {
        targetNode.classList.remove('hidden');
        targetNode.classList.add('active');
    }

    // Atualizar item ativo na sidebar
    document.querySelectorAll('.nav-item').forEach(btn => {
        if (btn.getAttribute('data-target') === pageId) {
            btn.classList.add('active');
            btn.setAttribute('aria-current', 'page');
        } else {
            btn.classList.remove('active');
            btn.removeAttribute('aria-current');
        }
    });

    // Atualizar Titulo da TopBar
    const titleMap = {
        'page-dashboard': 'Visão geral',
        'page-diseases': 'Doenças',
        'page-vaccination': 'Vacinação',
        'page-alerts': 'Central de Alertas',
        'page-family': 'Minha família',
        'page-settings': 'Configurações'
    };
    document.getElementById('page-title').textContent = titleMap[pageId] || 'Sensus';
}

function setCurrentDateDisplay() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('pt-BR', options);
    // Capitalizar primeira letra do dia
    const formatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    document.getElementById('current-date').textContent = formatted;
}

// ==========================================
// RENDERIZAÇÃO: DASHBOARD & GRÁFICO (CANVAS)
// ==========================================

function renderDashboardMetrics() {
    const data = APP_STATE.dashboardData;
    document.getElementById('dash-cases').textContent = data.cases.toLocaleString('pt-BR');
    document.getElementById('dash-vaccine').textContent = data.vaccinationRate + '%';
    document.getElementById('dash-alerts').textContent = String(data.activeAlerts).padStart(2, '0');
    document.getElementById('dash-cities').textContent = data.monitoredCities;
    document.getElementById('sidebar-alert-count').textContent = String(data.activeAlerts).padStart(2, '0');
}

function renderChart() {
    const canvas = document.getElementById('casesChart');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpar Canvas
    ctx.clearRect(0, 0, width, height);

    // Conjunto de Dados Ilustrativos (30 dias)
    const points = [
        320, 310, 300, 280, 290, 300, 310, 340, 350, 360, 
        380, 370, 350, 340, 330, 310, 300, 290, 280, 270, 
        260, 250, 240, 230, 220, 210, 205, 200, 195, 190
    ];

    const padding = 40;
    const chartWidth = width - (padding * 2);
    const chartHeight = height - (padding * 2);

    const maxVal = Math.max(...points) + 50;
    const minVal = Math.min(...points) - 50;

    // Desenhar Grid Discreto
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
        const y = padding + (chartHeight / 4) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }

    // Calcular Coordenadas
    const coords = points.map((val, index) => {
        const x = padding + (chartWidth / (points.length - 1)) * index;
        const y = height - padding - ((val - minVal) / (maxVal - minVal)) * chartHeight;
        return { x, y };
    });

    // Preenchimento de Área Suave (Gradiente)
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(37, 99, 235, 0.12)');
    gradient.addColorStop(1, 'rgba(37, 99, 235, 0.0)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(coords[0].x, height - padding);
    coords.forEach(pt => ctx.lineTo(pt.x, pt.y));
    ctx.lineTo(coords[coords.length - 1].x, height - padding);
    ctx.closePath();
    ctx.fill();

    // Linha Principal
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    coords.forEach((pt, idx) => {
        if (idx === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
    });
    ctx.stroke();
}

function renderRecentAlertsMini() {
    const container = document.getElementById('dashboard-recent-alerts');
    if (!container) return;

    container.innerHTML = APP_STATE.alerts.slice(0, 3).map(alert => `
        <div class="alert-item-mini ${alert.level}">
            <div class="alert-item-header">
                <span class="alert-item-title">${escapeHTML(alert.title)}</span>
                <span class="alert-item-time">${escapeHTML(alert.date)}</span>
            </div>
            <p class="alert-item-desc">${escapeHTML(alert.desc)}</p>
        </div>
    `).join('');
}

// ==========================================
// RENDERIZAÇÃO: PÁGINAS DE DOENÇAS E VACINAS
// ==========================================

function renderDiseasesTable(filteredData = null) {
    const tbody = document.getElementById('diseases-table-body');
    if (!tbody) return;

    const data = filteredData || APP_STATE.diseases;

    tbody.innerHTML = data.map(item => {
        let badgeClass = 'badge-info';
        let trendLabel = 'Estável';
        if (item.trend === 'high') { badgeClass = 'badge-alert'; trendLabel = 'Em alta'; }
        if (item.trend === 'down') { badgeClass = 'badge-success'; trendLabel = 'Em queda'; }

        return `
            <tr>
                <td class="font-bold">${escapeHTML(item.name)}</td>
                <td>${item.cases.toLocaleString('pt-BR')}</td>
                <td>${item.inc}</td>
                <td>${item.var}</td>
                <td><span class="badge ${badgeClass}">${trendLabel}</span></td>
            </tr>
        `;
    }).join('');
}

function renderVaccinesGrid() {
    const container = document.getElementById('vaccines-grid-container');
    if (!container) return;

    container.innerHTML = APP_STATE.vaccines.map(vac => `
        <article class="vaccine-card">
            <div>
                <div class="vaccine-card-header">
                    <h4 class="vaccine-name">${escapeHTML(vac.name)}</h4>
                    <span class="badge ${vac.status === 'regular' ? 'badge-success' : 'badge-warning'}">
                        ${vac.status === 'regular' ? 'Adequado' : 'Atenção'}
                    </span>
                </div>
                <p class="vaccine-target">${escapeHTML(vac.target)}</p>
            </div>
            <div class="vaccine-stats">
                <div class="vaccine-cov-label">
                    <span>Cobertura atual</span>
                    <span class="font-bold">${vac.coverage}%</span>
                </div>
                <div class="progress-bar-bg" style="margin-top: 0.375rem;">
                    <div class="progress-bar-fill" style="width: ${vac.coverage}%;"></div>
                </div>
            </div>
        </article>
    `).join('');
}

// ==========================================
// RENDERIZAÇÃO: ALERTAS
// ==========================================

function renderFullAlerts(filteredData = null) {
    const container = document.getElementById('alerts-full-container');
    if (!container) return;

    const data = filteredData || APP_STATE.alerts;

    container.innerHTML = data.map(alert => `
        <article class="alert-card-full ${alert.level}">
            <div class="alert-icon-box">
                <i data-lucide="alert-circle"></i>
            </div>
            <div class="alert-content">
                <h4 class="font-bold">${escapeHTML(alert.title)}</h4>
                <p class="text-secondary" style="margin-top: 0.25rem;">${escapeHTML(alert.desc)}</p>
                <div class="alert-meta">
                    <span>Região: ${escapeHTML(alert.region)}</span>
                    <span>&bull;</span>
                    <span>${escapeHTML(alert.date)}</span>
                </div>
            </div>
        </article>
    `).join('');

    initLucideIcons();
}

// ==========================================
// PÁGINA E GESTÃO: MINHA FAMÍLIA (LOCALSTORAGE)
// ==========================================

function loadFamilyData() {
    const saved = localStorage.getItem('sensus_family_data');
    if (saved) {
        try {
            APP_STATE.familyMembers = JSON.parse(saved);
        } catch (e) {
            APP_STATE.familyMembers = [];
        }
    }
}

function saveFamilyData() {
    localStorage.setItem('sensus_family_data', JSON.stringify(APP_STATE.familyMembers));
}

function handleAddFamilyMember(e) {
    e.preventDefault();
    const name = document.getElementById('fam-name').value.trim();
    const birth = document.getElementById('fam-birth').value;
    const city = document.getElementById('fam-city').value.trim();
    const notes = document.getElementById('fam-notes').value.trim();

    if (!name || !birth || !city) return;

    const newMember = {
        id: Date.now().toString(),
        name,
        birth,
        city,
        notes
    };

    APP_STATE.familyMembers.push(newMember);
    saveFamilyData();
    renderFamilyList();
    toggleModal(false);
    
    // Resetar Formulário
    document.getElementById('family-form').reset();
}

function renderFamilyList() {
    const container = document.getElementById('family-members-container');
    if (!container) return;

    if (APP_STATE.familyMembers.length === 0) {
        container.innerHTML = `
            <div class="card" style="grid-column: 1 / -1; text-align: center; padding: 2.5rem;">
                <p class="text-secondary">Nenhum familiar cadastrado até o momento.</p>
                <p class="text-secondary" style="font-size: 0.8125rem;">Clique no botão acima para adicionar acompanhamentos.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = APP_STATE.familyMembers.map(member => {
        const initials = member.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
        return `
            <article class="family-card">
                <div class="family-card-header">
                    <div class="avatar">${initials}</div>
                    <div class="family-info">
                        <h4>${escapeHTML(member.name)}</h4>
                        <p>${escapeHTML(member.city)} &bull; Nasc: ${formatDateBR(member.birth)}</p>
                    </div>
                </div>
                ${member.notes ? `<p class="text-secondary" style="font-size: 0.8125rem;">${escapeHTML(member.notes)}</p>` : ''}
                <div class="family-vac-status">
                    <span class="badge badge-success">Calendário em dia</span>
                </div>
            </article>
        `;
    }).join('');
}

function toggleModal(show) {
    const modal = document.getElementById('family-modal');
    if (!modal) return;
    if (show) {
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
    } else {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
    }
}

// ==========================================
// FILTROS E UTILITÁRIOS
// ==========================================

function setupFilterGroup(groupId, filterCallback) {
    const group = document.getElementById(groupId);
    if (!group) return;

    const pills = group.querySelectorAll('.pill');
    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            const filterValue = pill.getAttribute('data-filter');
            filterCallback(filterValue);
        });
    });
}

function filterDiseases(criteria) {
    if (criteria === 'all') {
        renderDiseasesTable(APP_STATE.diseases);
    } else {
        const filtered = APP_STATE.diseases.filter(d => d.trend === criteria);
        renderDiseasesTable(filtered);
    }
}

function filterAlerts(criteria) {
    if (criteria === 'all') {
        renderFullAlerts(APP_STATE.alerts);
    } else {
        const filtered = APP_STATE.alerts.filter(a => a.level === criteria);
        renderFullAlerts(filtered);
    }
}

function formatDateBR(dateString) {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length !== 3) return dateString;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}
