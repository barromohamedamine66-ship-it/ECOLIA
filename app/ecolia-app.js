/**
 * ÉCOLIA SaaS - Contrôleur Principal d'Application & Moteur Pédagogique/Financier
 * Signature : « L'école, simplement. »
 */

class EcoliaApp {
  constructor() {
    this.currentUser = this.loadActiveUser();
    this.currentTab = this.currentUser.role === 'PARENT' ? 'parent-space' : (this.currentUser.role === 'TEACHER' ? 'teacher-space' : 'dashboard');
    this.activeChildId = "stu-2026-001"; // Mohamed Traoré by default for Parent Traoré
    this.chartAveragesInstance = null;
    this.chartFinanceInstance = null;

    this.init();
  }

  loadActiveUser() {
    const savedId = localStorage.getItem('ECOLIA_ACTIVE_USER_ID');
    if (savedId && ecoliaDB.data.users) {
      const u = ecoliaDB.data.users.find(item => item.id === savedId);
      if (u) return u;
    }
    return ecoliaDB.data.users[0]; // Director by default
  }

  init() {
    this.bindEvents();
    this.initTheme();
    this.applyUserRole();
    this.populateSelects();
    this.renderActiveTab();
    this.updateHeaderStats();
  }

  // ====================================================================
  // 1. ÉVÉNEMENTS & ROUTEUR
  // ====================================================================
  bindEvents() {
    // Navigation Links
    document.querySelectorAll('#nav-links .nav-item').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-tab');
        this.switchTab(tab);
      });
    });

    // Mobile Sidebar Toggle
    const mobileToggle = document.getElementById('mobile-sidebar-toggle');
    const toggleSidebarBtn = document.getElementById('toggle-sidebar-btn');
    const sidebar = document.getElementById('sidebar');

    const toggleSidebar = () => {
      sidebar.classList.toggle('-translate-x-full');
      sidebar.classList.toggle('translate-x-0');
    };

    if (mobileToggle) mobileToggle.addEventListener('click', toggleSidebar);
    if (toggleSidebarBtn) toggleSidebarBtn.addEventListener('click', toggleSidebar);

    // Theme Toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // Global Search
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleGlobalSearch(e.target.value));
    }

    // Quick Action Button
    const quickBtn = document.getElementById('quick-action-btn');
    if (quickBtn) {
      quickBtn.addEventListener('click', () => {
        if (this.currentUser.role === 'ACCOUNTANT') this.openPaymentModal();
        else if (this.currentUser.role === 'TEACHER') this.openAddGradeModal();
        else if (this.currentUser.role === 'PARENT') this.openNewAnnouncementModal();
        else this.openStudentModal();
      });
    }
  }

  initTheme() {
    const saved = localStorage.getItem('ECOLIA_THEME') || 'light';
    if (saved === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }

  toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem('ECOLIA_THEME', isDark ? 'dark' : 'light');
    if (this.currentTab === 'dashboard') this.renderDashboardCharts();
    this.showToast(isDark ? "Mode sombre activé" : "Mode clair activé", "info");
  }

  // ====================================================================
  // 2. CONTRÔLE D'ACCÈS RBAC (DIRECTION, ENSEIGNANT, PARENT, COMPTABILITÉ)
  // ====================================================================
  applyUserRole() {
    const user = this.currentUser;

    // Update Sidebar Profile Card
    document.getElementById('sidebar-role-name').textContent = user.name;
    document.getElementById('sidebar-role-badge').textContent = user.roleLabel;
    document.getElementById('sidebar-role-avatar').src = user.avatar;
    document.getElementById('topbar-role-badge').textContent = user.roleLabel.split(' ')[0];

    // Filter Navigation Sections & Links
    document.querySelectorAll('#nav-links [data-roles]').forEach(el => {
      const allowed = (el.getAttribute('data-roles') || '').split(',');
      if (allowed.includes(user.role)) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });

    // Populate Login Modal Quick Switch List
    const loginGrid = document.getElementById('login-users-grid');
    if (loginGrid) {
      const roleIcons = {
        DIRECTOR: '👑',
        TEACHER: '👨‍🏫',
        ACCOUNTANT: '💳',
        PARENT: '👨‍👩‍👧',
        SECRETARY: '📁'
      };

      loginGrid.innerHTML = ecoliaDB.data.users.map(u => `
        <div onclick="app.switchUser('${u.id}')" class="p-3.5 rounded-2xl border ${u.id === user.id ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 ring-2 ring-emerald-500/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 hover:border-emerald-400'} cursor-pointer transition-all flex items-start gap-3 group">
          <div class="text-2xl">${roleIcons[u.role] || '👤'}</div>
          <div class="overflow-hidden">
            <span class="text-xs font-bold text-slate-800 dark:text-white block truncate">${u.name}</span>
            <span class="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block">${u.roleLabel}</span>
            <span class="text-[10px] text-slate-400 font-mono block mt-1">${u.email}</span>
          </div>
        </div>
      `).join('');
    }
  }

  openLoginModal() {
    document.getElementById('modal-login').classList.remove('hidden');
  }

  switchUser(userId) {
    const u = ecoliaDB.data.users.find(item => item.id === userId);
    if (!u) return;

    this.currentUser = u;
    localStorage.setItem('ECOLIA_ACTIVE_USER_ID', u.id);
    this.closeModals();
    this.applyUserRole();

    // Route dynamically based on role
    if (u.role === 'PARENT') {
      this.switchTab('parent-space');
    } else if (u.role === 'TEACHER') {
      this.switchTab('teacher-space');
    } else {
      this.switchTab('dashboard');
    }

    this.showToast(`Bienvenue, ${u.name} (${u.roleLabel})`, "success");
  }

  // ====================================================================
  // 3. NAVIGATION PAR ONGLETS
  // ====================================================================
  switchTab(tabId) {
    this.currentTab = tabId;

    document.querySelectorAll('#nav-links .nav-item').forEach(link => {
      if (link.getAttribute('data-tab') === tabId) {
        link.classList.add('active');
        link.classList.remove('text-slate-600', 'dark:text-slate-400');
      } else {
        link.classList.remove('active');
        link.classList.add('text-slate-600', 'dark:text-slate-400');
      }
    });

    document.querySelectorAll('.page-tab').forEach(sec => sec.classList.add('hidden'));
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.classList.remove('hidden');

    const titles = {
      dashboard: "Tableau de bord Direction",
      'teacher-space': "Espace Enseignant",
      'parent-space': "Espace Famille & Enfants",
      students: "Gestion des Élèves & Inscriptions",
      parents: "Parents & Tuteurs",
      classes: "Classes & Niveaux",
      teachers: "Corps Enseignant",
      grades: "Notes & Évaluations",
      'report-cards': "Bulletins Scolaires Officiels",
      attendance: "Feuille d'Appel & Absences",
      schedules: "Emploi du Temps Hebdomadaire",
      finance: "Comptabilité & Reçus (FCFA)",
      unpaid: "Suivi des Impayés",
      announcements: "Annonces & Circulaires",
      settings: "Paramètres de l'Établissement"
    };

    document.getElementById('current-page-title').textContent = titles[tabId] || "ÉCOLIA";
    this.renderActiveTab();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderActiveTab() {
    this.updateHeaderStats();
    if (this.currentTab === 'dashboard') this.renderDashboard();
    else if (this.currentTab === 'parent-space') this.renderParentSpace();
    else if (this.currentTab === 'teacher-space') this.renderTeacherSpace();
    else if (this.currentTab === 'students') this.renderStudentsList();
    else if (this.currentTab === 'parents') this.renderParentsList();
    else if (this.currentTab === 'classes') this.renderClassesList();
    else if (this.currentTab === 'teachers') this.renderTeachersList();
    else if (this.currentTab === 'grades') this.renderGradesModule();
    else if (this.currentTab === 'report-cards') this.renderReportCardsGrid();
    else if (this.currentTab === 'attendance') this.renderAttendanceTable();
    else if (this.currentTab === 'schedules') this.renderSchedulesTimetable();
    else if (this.currentTab === 'finance') this.renderFinanceTable();
    else if (this.currentTab === 'unpaid') this.renderUnpaidTable();
    else if (this.currentTab === 'announcements') this.renderAnnouncementsList();
    else if (this.currentTab === 'settings') this.renderSettings();
  }

  updateHeaderStats() {
    const data = ecoliaDB.data;
    const badge = document.getElementById('badge-total-students');
    if (badge) badge.textContent = data.students.length;
  }

  populateSelects() {
    const data = ecoliaDB.data;

    // Classes Selects
    const classSelects = ['filter-students-class', 'student-form-class', 'grades-filter-class', 'attendance-class-select'];
    classSelects.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const cur = el.value;
      let html = id.includes('filter') ? '<option value="ALL">Toutes les classes</option>' : '';
      data.classes.forEach(c => {
        html += `<option value="${c.id}">${c.name} (${c.level})</option>`;
      });
      el.innerHTML = html;
      if (cur) el.value = cur;
    });

    // Subjects Selects
    const subjectSelects = ['grades-filter-subject', 'grade-form-subject'];
    subjectSelects.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      let html = id.includes('filter') ? '<option value="ALL">Toutes les matières (Vue Globale)</option>' : '';
      data.subjects.forEach(s => {
        html += `<option value="${s.id}">${s.name} (x${s.coef})</option>`;
      });
      el.innerHTML = html;
    });

    // Student Selects (in payments and grade modals)
    const studentSelects = ['payment-form-student', 'grade-form-student'];
    studentSelects.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      let html = '';
      data.students.forEach(s => {
        html += `<option value="${s.id}">${s.last_name} ${s.first_name} [${s.matricule}] - ${s.class_name}</option>`;
      });
      el.innerHTML = html;
    });

    // Default dates
    const today = new Date().toISOString().split('T')[0];
    const attDate = document.getElementById('attendance-date');
    if (attDate && !attDate.value) attDate.value = today;
    const payDate = document.getElementById('payment-form-date');
    if (payDate && !payDate.value) payDate.value = today;
  }

  // ====================================================================
  // 4. MODULE DASHBOARD DIRECTION
  // ====================================================================
  renderDashboard() {
    const data = ecoliaDB.data;

    // Render Preview Students
    const stuPreview = document.getElementById('dashboard-students-preview');
    if (stuPreview) {
      stuPreview.innerHTML = data.students.slice(0, 3).map(s => `
        <div class="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
          <div class="flex items-center gap-3">
            <img src="${s.photo_url}" alt="${s.first_name}" class="w-9 h-9 rounded-full object-cover">
            <div>
              <h4 class="text-xs font-bold text-slate-800 dark:text-white">${s.last_name} ${s.first_name}</h4>
              <span class="text-[10px] text-slate-400 font-mono">${s.matricule} • <strong class="text-emerald-600">${s.class_name}</strong></span>
            </div>
          </div>
          <button onclick="app.viewOfficialBulletin('${s.id}')" class="px-2.5 py-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-xs rounded-lg">
            Bulletin <i class="fa-solid fa-arrow-right text-[9px] ml-1"></i>
          </button>
        </div>
      `).join('');
    }

    // Render Preview Announcements
    const ancPreview = document.getElementById('dashboard-announcements-preview');
    if (ancPreview) {
      ancPreview.innerHTML = data.announcements.slice(0, 2).map(a => `
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
          <div class="flex items-center justify-between mb-1">
            <span class="text-xs font-bold text-slate-800 dark:text-white">${a.title}</span>
            <span class="text-[10px] text-slate-400">${a.date.split(' ')[0]}</span>
          </div>
          <p class="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">${a.content}</p>
        </div>
      `).join('');
    }

    this.renderDashboardCharts();
  }

  renderDashboardCharts() {
    const data = ecoliaDB.data;
    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#f1f5f9';

    // 1. Averages by Class Chart
    const ctxAverages = document.getElementById('chart-ecolia-averages');
    if (ctxAverages) {
      if (this.chartAveragesInstance) this.chartAveragesInstance.destroy();

      const labels = ["CM2 A", "6e A", "6e B", "5e A", "4e A", "3e A", "Tle D"];
      const averages = [14.8, 13.2, 12.9, 13.5, 12.1, 14.2, 13.8];

      this.chartAveragesInstance = new Chart(ctxAverages, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Moyenne Trimestre (/20)',
            data: averages,
            backgroundColor: 'rgba(5, 150, 105, 0.85)',
            hoverBackgroundColor: 'rgba(5, 150, 105, 1)',
            borderRadius: 8,
            barThickness: 28
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: ctx => `Moyenne : ${ctx.raw} / 20` } }
          },
          scales: {
            y: { min: 0, max: 20, grid: { color: gridColor }, ticks: { color: textColor, font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { color: textColor, font: { size: 11, weight: 'bold' } } }
          }
        }
      });
    }

    // 2. Finance Doughnut Chart (18.45M vs 2.45M FCFA)
    const ctxFinance = document.getElementById('chart-ecolia-finance');
    if (ctxFinance) {
      if (this.chartFinanceInstance) this.chartFinanceInstance.destroy();

      this.chartFinanceInstance = new Chart(ctxFinance, {
        type: 'doughnut',
        data: {
          labels: ['Encaissé (FCFA)', 'Impayé (FCFA)'],
          datasets: [{
            data: [18450000, 2450000],
            backgroundColor: ['#059669', '#f43f5e'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom', labels: { color: textColor, font: { size: 10, weight: 'bold' } } }
          },
          cutout: '72%'
        }
      });
    }
  }

  // ====================================================================
  // 5. ESPACE FAMILLE & PARENT (M. TRAORÉ IBRAHIM)
  // ====================================================================
  renderParentSpace() {
    const data = ecoliaDB.data;
    const parent = this.currentUser; // M. TRAORÉ Ibrahim
    const children = data.students.filter(s => (parent.childrenIds || ["stu-2026-001", "stu-2026-002", "stu-2026-003"]).includes(s.id));

    // Render Children Selection Cards
    const cardsContainer = document.getElementById('parent-children-cards');
    if (cardsContainer) {
      cardsContainer.innerHTML = children.map(c => `
        <div onclick="app.setActiveChild('${c.id}')" class="p-4 rounded-2xl border-2 ${this.activeChildId === c.id ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/40 shadow-md' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-300'} cursor-pointer transition-all flex items-center gap-3.5">
          <img src="${c.photo_url}" alt="${c.first_name}" class="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20">
          <div>
            <h4 class="font-bold text-xs text-slate-800 dark:text-white">${c.first_name} ${c.last_name}</h4>
            <span class="text-[11px] font-bold text-emerald-600 block">${c.class_name}</span>
            <span class="text-[10px] text-slate-400 font-mono">${c.matricule}</span>
          </div>
        </div>
      `).join('');
    }

    // Render Active Child Details
    const activeStudent = data.students.find(s => s.id === this.activeChildId) || children[0];
    const childView = document.getElementById('parent-active-child-view');

    if (activeStudent && childView) {
      const avg = this.calculateStudentAverage(activeStudent.id);
      const studentGrades = data.grades.filter(g => g.student_id === activeStudent.id);

      childView.innerHTML = `
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div class="flex items-center gap-4">
            <img src="${activeStudent.photo_url}" alt="${activeStudent.first_name}" class="w-16 h-16 rounded-2xl object-cover ring-4 ring-emerald-500/20">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-lg font-black text-slate-800 dark:text-white">${activeStudent.first_name} ${activeStudent.last_name}</h3>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">${activeStudent.class_name}</span>
              </div>
              <p class="text-xs text-slate-400 font-mono mt-0.5">Matricule : ${activeStudent.matricule} • Né(e) le ${activeStudent.birth_date} à ${activeStudent.birth_place}</p>
            </div>
          </div>
          <button onclick="app.viewOfficialBulletin('${activeStudent.id}')" class="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2">
            <i class="fa-solid fa-file-pdf"></i> Télécharger Bulletin Trimestriel
          </button>
        </div>

        <!-- Academic & Financial Stats -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Moyenne Générale</span>
            <div class="text-2xl font-black text-emerald-600">${avg} / 20</div>
            <span class="text-[10px] text-slate-500 mt-1 block">Sur la base de ${studentGrades.length} évaluations</span>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Assiduité & Présence</span>
            <div class="text-2xl font-black text-slate-800 dark:text-white">96 %</div>
            <span class="text-[10px] text-emerald-600 font-bold mt-1 block">0 absence non justifiée</span>
          </div>

          <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
            <span class="text-[10px] uppercase font-bold text-slate-400 block mb-1">Scolarité Annuelle</span>
            <div class="text-lg font-black ${activeStudent.balance_tuition === 0 ? 'text-emerald-600' : 'text-amber-600'}">
              ${activeStudent.paid_tuition.toLocaleString('fr-FR')} / ${activeStudent.annual_tuition.toLocaleString('fr-FR')} FCFA
            </div>
            <span class="text-[10px] ${activeStudent.balance_tuition === 0 ? 'text-emerald-600 font-bold' : 'text-amber-600'} mt-1 block">
              ${activeStudent.balance_tuition === 0 ? '✓ Soldé (100% à jour)' : 'Reste dû : ' + activeStudent.balance_tuition.toLocaleString('fr-FR') + ' FCFA'}
            </span>
          </div>
        </div>

        <!-- Latest Grades List -->
        <div>
          <h4 class="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">Dernières Notes Reçues</h4>
          <div class="space-y-2">
            ${studentGrades.length ? studentGrades.map(g => {
              const evalObj = data.evaluations.find(e => e.id === g.eval_id) || { title: 'Évaluation', subject_id: 'MATH' };
              const subj = data.subjects.find(s => s.id === evalObj.subject_id) || { name: 'Matière' };
              return `
                <div class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                  <div>
                    <span class="font-bold text-xs text-slate-800 dark:text-white block">${subj.name} — ${evalObj.title}</span>
                    <span class="text-[11px] text-slate-400 italic">"${g.comment || 'Travail régulier'}"</span>
                  </div>
                  <div class="text-right">
                    <span class="font-extrabold text-sm ${g.score >= 14 ? 'text-emerald-600' : (g.score >= 10 ? 'text-indigo-600' : 'text-rose-500')}">
                      ${g.score} / 20
                    </span>
                    <span class="text-[10px] text-slate-400 block">Coef ${subj.coef}</span>
                  </div>
                </div>
              `;
            }).join('') : '<p class="text-xs text-slate-400 italic">Aucune note saisie pour le moment.</p>'}
          </div>
        </div>
      `;
    }
  }

  setActiveChild(childId) {
    this.activeChildId = childId;
    this.renderParentSpace();
  }

  // ====================================================================
  // 6. MODULE ÉLÈVES & INSCRIPTIONS (MATRICULE ECO-2026-XXXXX)
  // ====================================================================
  renderStudentsList() {
    const data = ecoliaDB.data;
    const classFilter = document.getElementById('filter-students-class')?.value || 'ALL';
    const tuitionFilter = document.getElementById('filter-students-tuition')?.value || 'ALL';
    const query = document.getElementById('filter-students-query')?.value.toLowerCase().trim() || '';

    const filtered = data.students.filter(s => {
      const matchClass = classFilter === 'ALL' || s.class_id === classFilter;
      const matchTuition = tuitionFilter === 'ALL' || s.payment_status === tuitionFilter;
      const full = `${s.first_name} ${s.last_name} ${s.matricule}`.toLowerCase();
      const matchQuery = !query || full.includes(query);
      return matchClass && matchTuition && matchQuery;
    });

    const tbody = document.getElementById('students-table-body');
    if (!tbody) return;

    if (!filtered.length) {
      tbody.innerHTML = `<tr><td colspan="7" class="p-8 text-center text-slate-400">Aucun élève trouvé.</td></tr>`;
      return;
    }

    tbody.innerHTML = filtered.map(s => {
      const avg = this.calculateStudentAverage(s.id);
      let statusBadge = `<span class="status-pill bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"><i class="fa-solid fa-check"></i> Soldé</span>`;
      if (s.payment_status === 'PARTIEL') {
        statusBadge = `<span class="status-pill bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"><i class="fa-solid fa-clock"></i> Partiel</span>`;
      } else if (s.payment_status === 'IMPAYE') {
        statusBadge = `<span class="status-pill bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300"><i class="fa-solid fa-triangle-exclamation"></i> Impayé</span>`;
      }

      return `
        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3 px-4">
            <div class="flex items-center gap-3">
              <img src="${s.photo_url}" alt="${s.first_name}" class="w-8 h-8 rounded-full object-cover">
              <div>
                <span class="font-bold text-slate-800 dark:text-white block">${s.last_name} ${s.first_name}</span>
                <span class="text-[10px] text-slate-400 font-mono">${s.matricule}</span>
              </div>
            </div>
          </td>
          <td class="py-3 px-4 font-semibold text-emerald-700 dark:text-emerald-400">${s.class_name}</td>
          <td class="py-3 px-4">
            <div class="text-xs font-bold text-slate-700 dark:text-slate-300">${s.parent_name}</div>
            <div class="text-[10px] text-slate-400">${s.parent_phone}</div>
          </td>
          <td class="py-3 px-4 text-center font-bold text-xs ${avg >= 14 ? 'text-emerald-600' : (avg >= 10 ? 'text-indigo-600' : 'text-rose-500')}">
            ${avg > 0 ? avg + ' / 20' : 'N/A'}
          </td>
          <td class="py-3 px-4 text-right font-mono font-bold text-xs">
            ${s.paid_tuition.toLocaleString('fr-FR')} <span class="text-[10px] text-slate-400">/ ${s.annual_tuition.toLocaleString('fr-FR')}</span>
          </td>
          <td class="py-3 px-4 text-center">${statusBadge}</td>
          <td class="py-3 px-4 text-right">
            <div class="flex items-center justify-end gap-1">
              <button onclick="app.viewOfficialBulletin('${s.id}')" title="Bulletin Officiel A4" class="p-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-lg hover:bg-emerald-100">
                <i class="fa-solid fa-file-pdf"></i>
              </button>
              <button onclick="app.openStudentModal('${s.id}')" title="Modifier" class="p-1.5 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-lg hover:bg-slate-200">
                <i class="fa-solid fa-pen"></i>
              </button>
            </div>
          </td>
        </tr>
      `;
    }).join('');
  }

  openStudentModal(studentId = null) {
    this.populateSelects();
    const modal = document.getElementById('modal-student');
    const form = document.getElementById('student-form');
    const title = document.getElementById('modal-student-title');

    if (studentId) {
      const s = ecoliaDB.data.students.find(item => item.id === studentId);
      if (!s) return;
      title.textContent = `Modifier le dossier de ${s.first_name} ${s.last_name}`;
      document.getElementById('student-form-id').value = s.id;
      document.getElementById('student-form-lastname').value = s.last_name;
      document.getElementById('student-form-firstname').value = s.first_name;
      document.getElementById('student-form-gender').value = s.gender;
      document.getElementById('student-form-dob').value = s.birth_date;
      document.getElementById('student-form-pob').value = s.birth_place;
      document.getElementById('student-form-class').value = s.class_id;
      document.getElementById('student-form-tuition-status').value = s.payment_status;
      document.getElementById('student-form-parent-name').value = s.parent_name;
      document.getElementById('student-form-parent-phone').value = s.parent_phone;
    } else {
      title.textContent = "Inscription d'un Nouvel Élève (Matricule automatique ECO-2026)";
      form.reset();
      document.getElementById('student-form-id').value = '';
    }

    modal.classList.remove('hidden');
  }

  handleSaveStudent(e) {
    e.preventDefault();
    const id = document.getElementById('student-form-id').value;
    const data = ecoliaDB.data;

    const classId = document.getElementById('student-form-class').value;
    const cls = data.classes.find(c => c.id === classId) || { name: '3e A', feeAnnual: 250000 };
    const tuitionStatus = document.getElementById('student-form-tuition-status').value;

    const studentObj = {
      first_name: document.getElementById('student-form-firstname').value.trim(),
      last_name: document.getElementById('student-form-lastname').value.trim(),
      gender: document.getElementById('student-form-gender').value,
      birth_date: document.getElementById('student-form-dob').value,
      birth_place: document.getElementById('student-form-pob').value.trim(),
      nationality: "Ivoirienne",
      class_id: classId,
      class_name: cls.name,
      parent_name: document.getElementById('student-form-parent-name').value.trim(),
      parent_phone: document.getElementById('student-form-parent-phone').value.trim(),
      parent_email: "contact@parent.ci",
      address: "Abidjan",
      annual_tuition: cls.feeAnnual || 250000,
      paid_tuition: tuitionStatus === 'SOLDE' ? (cls.feeAnnual || 250000) : (tuitionStatus === 'PARTIEL' ? 100000 : 0),
      balance_tuition: tuitionStatus === 'SOLDE' ? 0 : (tuitionStatus === 'PARTIEL' ? ((cls.feeAnnual || 250000) - 100000) : (cls.feeAnnual || 250000)),
      payment_status: tuitionStatus
    };

    if (id) {
      const idx = data.students.findIndex(s => s.id === id);
      if (idx !== -1) {
        data.students[idx] = { ...data.students[idx], ...studentObj };
        this.showToast("Dossier élève mis à jour", "success");
      }
    } else {
      const matricule = `ECO-2026-${String(data.students.length + 1).padStart(5, '0')}`;
      const defaultAvatars = [
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      ];
      data.students.push({
        id: `stu-2026-${String(data.students.length + 1).padStart(3, '0')}`,
        matricule,
        ...studentObj,
        photo_url: defaultAvatars[Math.floor(Math.random() * defaultAvatars.length)],
        conduct: "Nouvel inscrit.",
        medical_notes: "R.A.S."
      });
      this.showToast(`Élève inscrit avec succès avec le matricule ${matricule}`, "success");
    }

    ecoliaDB.saveDatabase();
    this.closeModals();
    this.populateSelects();
    this.renderActiveTab();
  }

  exportStudentsCSV() {
    const data = ecoliaDB.data;
    let csv = "Matricule,Nom,Prenom,Sexe,DateNaissance,LieuNaissance,Classe,Parent,Telephone,StatutScolarite,Paye_FCFA,Total_FCFA\n";
    data.students.forEach(s => {
      csv += `"${s.matricule}","${s.last_name}","${s.first_name}","${s.gender}","${s.birth_date}","${s.birth_place}","${s.class_name}","${s.parent_name}","${s.parent_phone}","${s.payment_status}","${s.paid_tuition}","${s.annual_tuition}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ECOLIA_Repertoire_Eleves_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast("Export CSV généré avec succès", "success");
  }

  // ====================================================================
  // 7. MODULE PARENTS & CLASSES
  // ====================================================================
  renderParentsList() {
    const container = document.getElementById('parents-list-grid');
    if (!container) return;

    container.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div class="flex items-center gap-3">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" class="w-12 h-12 rounded-2xl object-cover">
          <div>
            <h3 class="font-extrabold text-sm text-slate-800 dark:text-white">M. TRAORÉ Ibrahim</h3>
            <span class="text-xs text-emerald-600 font-bold">Père • 3 enfants inscrits</span>
          </div>
        </div>
        <div class="text-xs text-slate-500 space-y-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl">
          <div><i class="fa-solid fa-phone mr-1.5 text-slate-400"></i> +225 07 48 55 12 00</div>
          <div><i class="fa-solid fa-location-dot mr-1.5 text-slate-400"></i> Riviera Palmeraie, Abidjan</div>
        </div>
        <div class="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">Enfants rattachés :</span>
          <div class="flex flex-wrap gap-1.5">
            <span class="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-bold">Mohamed (3e A)</span>
            <span class="px-2 py-0.5 rounded-lg bg-teal-50 text-teal-700 text-xs font-bold">Aïcha (6e B)</span>
            <span class="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold">Mariam (CM2 A)</span>
          </div>
        </div>
      </div>
    `;
  }

  renderClassesList() {
    const container = document.getElementById('classes-list-grid');
    if (!container) return;

    container.innerHTML = ecoliaDB.data.classes.map(c => `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold text-xs">${c.level}</span>
          <span class="text-xs text-slate-400"><i class="fa-solid fa-door-open mr-1"></i>${c.room.split('-')[0]}</span>
        </div>
        <h3 class="text-lg font-black text-slate-800 dark:text-white">${c.name}</h3>
        <p class="text-xs text-slate-500"><i class="fa-solid fa-user-tie text-emerald-600 mr-1.5"></i>Prof. Principal : <strong>${c.headTeacher}</strong></p>
        <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs flex justify-between">
          <span class="text-slate-400">Scolarité annuelle :</span>
          <strong class="text-emerald-700 font-mono">${c.feeAnnual.toLocaleString('fr-FR')} FCFA</strong>
        </div>
      </div>
    `).join('');
  }

  renderTeachersList() {
    this.renderClassesList();
  }

  // ====================================================================
  // 8. MODULE PÉDAGOGIE : NOTES & CALCUL DES MOYENNES
  // ====================================================================
  calculateStudentAverage(studentId, period = 'T1') {
    const data = ecoliaDB.data;
    const grades = data.grades.filter(g => g.student_id === studentId);
    if (!grades.length) return 0;

    let totalPoints = 0;
    let totalCoef = 0;

    grades.forEach(g => {
      const evalObj = data.evaluations.find(e => e.id === g.eval_id) || { subject_id: 'MATH' };
      const subj = data.subjects.find(s => s.id === evalObj.subject_id) || { coef: 2 };
      totalPoints += (g.score * subj.coef);
      totalCoef += subj.coef;
    });

    return totalCoef > 0 ? (totalPoints / totalCoef).toFixed(2) : 0;
  }

  renderGradesModule() {
    const data = ecoliaDB.data;
    const classId = document.getElementById('grades-filter-class')?.value || 'cls-3a';
    const period = document.getElementById('grades-filter-period')?.value || 'T1';
    const studentsInClass = data.students.filter(s => s.class_id === classId);

    const thead = document.getElementById('grades-table-head');
    if (thead) {
      thead.innerHTML = `
        <tr>
          <th class="py-3 px-4">Élève</th>
          <th class="py-3 px-3 text-center">Mathématiques (x4)</th>
          <th class="py-3 px-3 text-center">Français (x4)</th>
          <th class="py-3 px-3 text-center">Physique-Chimie (x3)</th>
          <th class="py-3 px-4 text-center bg-emerald-50 dark:bg-emerald-950/40">Moyenne Gen.</th>
          <th class="py-3 px-4 text-right">Bulletin</th>
        </tr>
      `;
    }

    const tbody = document.getElementById('grades-table-body');
    if (tbody) {
      tbody.innerHTML = studentsInClass.map(s => {
        const avg = this.calculateStudentAverage(s.id, period);
        const mathGrade = data.grades.find(g => g.student_id === s.id && g.eval_id === 'eval-3a-math-1')?.score || '-';
        const frGrade = data.grades.find(g => g.student_id === s.id && g.eval_id === 'eval-3a-fr-1')?.score || '-';
        const spGrade = data.grades.find(g => g.student_id === s.id && g.eval_id === 'eval-3a-sp-1')?.score || '-';

        return `
          <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
            <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">
              <div class="flex items-center gap-2.5">
                <img src="${s.photo_url}" class="w-7 h-7 rounded-full object-cover">
                <span>${s.last_name} ${s.first_name}</span>
              </div>
            </td>
            <td class="py-3 px-3 text-center font-bold ${mathGrade >= 14 ? 'text-emerald-600' : (mathGrade >= 10 ? 'text-indigo-600' : 'text-rose-500')}">${mathGrade}</td>
            <td class="py-3 px-3 text-center font-bold ${frGrade >= 14 ? 'text-emerald-600' : (frGrade >= 10 ? 'text-indigo-600' : 'text-rose-500')}">${frGrade}</td>
            <td class="py-3 px-3 text-center font-bold ${spGrade >= 14 ? 'text-emerald-600' : (spGrade >= 10 ? 'text-indigo-600' : 'text-rose-500')}">${spGrade}</td>
            <td class="py-3 px-4 text-center font-black text-sm bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300">
              ${avg > 0 ? avg + ' / 20' : 'N/A'}
            </td>
            <td class="py-3 px-4 text-right">
              <button onclick="app.viewOfficialBulletin('${s.id}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm">
                <i class="fa-solid fa-file-pdf"></i> Bulletin
              </button>
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  openAddGradeModal() {
    this.populateSelects();
    document.getElementById('modal-grade').classList.remove('hidden');
  }

  handleSaveGrade(e) {
    e.preventDefault();
    const data = ecoliaDB.data;
    const studentId = document.getElementById('grade-form-student').value;
    const score = parseFloat(document.getElementById('grade-form-score').value);
    const comment = document.getElementById('grade-form-comment').value.trim();

    data.grades.push({
      id: `grd-${Date.now()}`,
      eval_id: 'eval-3a-math-1',
      student_id: studentId,
      score,
      comment
    });

    ecoliaDB.saveDatabase();
    this.closeModals();
    this.renderGradesModule();
    this.showToast("Note enregistrée avec succès", "success");
  }

  // ====================================================================
  // 9. BULLETIN SCOLAIRE OFFICIEL CERTIFIÉ A4 (PDF / IMPRESSION)
  // ====================================================================
  renderReportCardsGrid() {
    const container = document.getElementById('report-cards-students-grid');
    if (!container) return;

    container.innerHTML = ecoliaDB.data.students.map(s => {
      const avg = this.calculateStudentAverage(s.id);
      return `
        <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:border-emerald-500 transition-all flex flex-col justify-between">
          <div class="flex items-center gap-3 mb-3">
            <img src="${s.photo_url}" alt="${s.first_name}" class="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500/20">
            <div>
              <h4 class="font-extrabold text-sm text-slate-800 dark:text-white">${s.last_name} ${s.first_name}</h4>
              <span class="text-xs font-bold text-emerald-600 block">${s.class_name}</span>
              <span class="text-[10px] text-slate-400 font-mono">${s.matricule}</span>
            </div>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs flex justify-between items-center mb-4">
            <span class="text-slate-400">Moyenne 1er Trimestre :</span>
            <strong class="text-base font-black text-emerald-700">${avg} / 20</strong>
          </div>
          <button onclick="app.viewOfficialBulletin('${s.id}')" class="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2">
            <i class="fa-solid fa-file-pdf"></i> Visualiser le Bulletin Officiel A4
          </button>
        </div>
      `;
    }).join('');
  }

  viewOfficialBulletin(studentId) {
    const data = ecoliaDB.data;
    const student = data.students.find(s => s.id === studentId);
    if (!student) return;

    const avg = parseFloat(this.calculateStudentAverage(studentId));
    let mention = "TABLEAU D'HONNEUR";
    let decision = "Travail très satisfaisant. Félicitations pour ce bon trimestre.";
    if (avg >= 16) {
      mention = "FÉLICITATIONS DU CONSEIL DE CLASSE";
      decision = "Trimestre brillant et exemplaire. Bravo pour l'excellence de vos résultats.";
    } else if (avg >= 14) {
      mention = "TABLEAU D'HONNEUR & ENCOURAGEMENTS";
      decision = "Très bon travail d'ensemble. Poursuivez dans cette dynamique positive.";
    } else if (avg >= 10) {
      mention = "ENCOURAGEMENTS DU CONSEIL";
      decision = "Résultats convenables. Des efforts réguliers permettront de progresser encore.";
    } else {
      mention = "AVERTISSEMENT TRAVAIL";
      decision = "Résultats insuffisants. Un redoublement d'efforts est impératif au 2ème trimestre.";
    }

    const content = document.getElementById('bulletin-printable-content');
    content.innerHTML = `
      <div class="ecolia-bulletin-sheet font-sans">
        <!-- Official Ivorian Header -->
        <div class="ecolia-bulletin-header flex justify-between items-start">
          <div class="space-y-0.5">
            <div class="text-[9px] uppercase font-extrabold tracking-widest text-emerald-800">RÉPUBLIQUE DE CÔTE D'IVOIRE</div>
            <div class="text-[9px] text-slate-500 font-semibold uppercase">Ministère de l'Éducation Nationale et de l'Alphabétisation</div>
            <div class="text-[9px] text-slate-400">DRENA ABIDJAN 1 • CODE ÉTABLISSEMENT : 04421</div>
            <h1 class="text-xl font-black text-slate-900 mt-2 ecolia-school-title">${data.school.name}</h1>
            <p class="text-[11px] text-slate-500">${data.school.address} • Tél: ${data.school.phone}</p>
            <p class="text-[10px] text-slate-400 italic">Devise : "${data.school.motto}"</p>
          </div>
          <div class="text-right border-l-2 border-emerald-600 pl-4">
            <span class="inline-block px-3 py-1 bg-emerald-800 text-white text-xs font-bold uppercase rounded-md mb-1">BULLETIN DE NOTES</span>
            <div class="text-xs font-bold text-slate-800">1er TRIMESTRE 2026-2027</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Imprimé le ${new Date().toLocaleDateString('fr-FR')}</div>
          </div>
        </div>

        <!-- Student Identification Info -->
        <div class="grid grid-cols-2 gap-4 bg-slate-50 border border-slate-200 rounded-xl p-3.5 mb-4 text-xs">
          <div>
            <div><span class="text-slate-400 font-bold uppercase text-[10px]">ÉLÈVE :</span> <strong class="text-slate-900 text-sm font-extrabold">${student.last_name.toUpperCase()} ${student.first_name}</strong></div>
            <div><span class="text-slate-400 font-bold uppercase text-[10px]">MATRICULE ÉCOLIA :</span> <span class="font-mono font-bold">${student.matricule}</span> • <span class="text-slate-400 font-bold uppercase text-[10px]">SEXE :</span> ${student.gender}</div>
            <div><span class="text-slate-400 font-bold uppercase text-[10px]">DATE & LIEU DE NAISSANCE :</span> ${student.birth_date} à ${student.birth_place}</div>
            <div><span class="text-slate-400 font-bold uppercase text-[10px]">PARENT / TUTEUR :</span> ${student.parent_name} (${student.parent_phone})</div>
          </div>
          <div class="text-right">
            <div><span class="text-slate-400 font-bold uppercase text-[10px]">CLASSE :</span> <strong class="text-emerald-800 font-extrabold text-sm">${student.class_name}</strong></div>
            <div><span class="text-slate-400 font-bold uppercase text-[10px]">EFFECTIF DE CLASSE :</span> 42 élèves</div>
            <div><span class="text-slate-400 font-bold uppercase text-[10px]">PROFESSEUR PRINCIPAL :</span> M. KOFFI Yao Simplice</div>
            <div><span class="text-slate-400 font-bold uppercase text-[10px]">ASSIDUITÉ :</span> <strong class="text-emerald-700">0 absence non justifiée</strong></div>
          </div>
        </div>

        <!-- Subjects Grades Matrix Table -->
        <table class="ecolia-bulletin-table">
          <thead>
            <tr>
              <th style="width: 28%;">Matières Enseignées</th>
              <th style="width: 8%; text-align: center;">Coef</th>
              <th style="width: 14%; text-align: center;">Moyenne /20</th>
              <th style="width: 14%; text-align: center;">Moy. Classe</th>
              <th>Appréciations des Professeurs</th>
            </tr>
          </thead>
          <tbody>
            ${data.subjects.map(subj => {
              const baseGrade = subj.id === 'MATH' ? (student.id === 'stu-2026-001' ? 14 : (student.id === 'stu-2026-004' ? 16.5 : 12)) : (subj.id === 'FR' ? 15 : 14.5);
              return `
                <tr>
                  <td><strong>${subj.name}</strong></td>
                  <td class="text-center font-bold text-slate-500">${subj.coef}</td>
                  <td class="text-center font-black text-sm ${baseGrade >= 14 ? 'text-emerald-800' : 'text-slate-800'}">${baseGrade}</td>
                  <td class="text-center text-slate-500 text-xs">12.8</td>
                  <td class="text-xs text-slate-700 italic">"Très bonne participation et travail rigoureux."</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>

        <!-- Synthesis Box -->
        <div class="grid grid-cols-3 gap-3 mb-4">
          <div class="border border-emerald-300 bg-emerald-50/60 p-3 rounded-xl text-center">
            <span class="text-[10px] font-bold uppercase text-emerald-800 block">MOYENNE GÉNÉRALE DU TRIMESTRE</span>
            <span class="text-2xl font-black text-emerald-900">${avg} / 20</span>
          </div>
          <div class="border border-slate-200 bg-slate-50 p-3 rounded-xl text-center">
            <span class="text-[10px] font-bold uppercase text-slate-400 block">RANG DANS LA CLASSE</span>
            <span class="text-2xl font-black text-slate-800">${avg >= 16 ? '1er' : (avg >= 14 ? '3ème' : '8ème')} <span class="text-xs font-normal text-slate-400">/ 42</span></span>
          </div>
          <div class="border border-emerald-300 bg-emerald-50/60 p-3 rounded-xl text-center">
            <span class="text-[10px] font-bold uppercase text-emerald-800 block">MENTION DU CONSEIL</span>
            <span class="text-xs font-black text-emerald-900 block mt-1">${mention}</span>
          </div>
        </div>

        <!-- Official Signatures -->
        <div class="border border-slate-200 rounded-xl p-4 bg-slate-50/40">
          <div class="text-[10px] font-bold uppercase text-slate-400 mb-1">Avis du Conseil de Classe & Décision de la Direction :</div>
          <p class="text-xs text-slate-800 font-medium italic mb-4">"${decision}"</p>
          <div class="grid grid-cols-2 gap-8 pt-3 border-t border-slate-200 text-xs">
            <div>
              <span class="font-bold text-slate-700 block">Le Professeur Principal :</span>
              <span class="text-slate-400 italic">M. KOFFI Yao Simplice</span>
            </div>
            <div class="text-right">
              <span class="font-bold text-slate-700 block">Le Directeur des Études :</span>
              <span class="text-slate-400 italic">${data.school.principalName}</span>
              <div class="mt-2 text-[10px] text-emerald-700 font-bold border border-emerald-600 inline-block px-2 py-0.5 rounded">DOCUMENT OFFICIEL ÉCOLIA</div>
            </div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('modal-bulletin').classList.remove('hidden');
  }

  // ====================================================================
  // 10. ASSIDUITÉ, ABSENCES & APPEL
  // ====================================================================
  renderAttendanceTable() {
    const data = ecoliaDB.data;
    const classId = document.getElementById('attendance-class-select')?.value || 'cls-3a';
    const students = data.students.filter(s => s.class_id === classId);
    const tbody = document.getElementById('attendance-table-body');
    if (!tbody) return;

    tbody.innerHTML = students.map(s => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
        <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">${s.last_name} ${s.first_name}</td>
        <td class="py-3 px-4 text-center">
          <span class="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">Présent</span>
        </td>
        <td class="py-3 px-4 text-slate-400 text-xs italic">Aucune remarque</td>
        <td class="py-3 px-4 text-center font-bold text-xs">0 demi-journée</td>
      </tr>
    `).join('');
  }

  markAllAttendancePresent() {
    this.showToast("Tous les élèves marqués comme Présents", "success");
  }

  // ====================================================================
  // 11. EMPLOI DU TEMPS HEBDOMADAIRE (3e A)
  // ====================================================================
  renderSchedulesTimetable() {
    const data = ecoliaDB.data;
    const grid = document.getElementById('schedules-timetable-grid');
    if (!grid) return;

    const days = [
      { num: 1, name: "Lundi" },
      { num: 2, name: "Mardi" },
      { num: 3, name: "Mercredi" },
      { num: 4, name: "Jeudi" },
      { num: 5, name: "Vendredi" }
    ];
    const slots = ["07:30 - 09:30", "09:45 - 11:45", "13:30 - 15:30"];

    let html = `
      <div class="col-span-1 bg-slate-100 dark:bg-slate-800 p-2.5 rounded-xl font-bold text-center text-xs text-slate-500 uppercase">Horaire</div>
      ${days.map(d => `<div class="col-span-1 bg-emerald-50 dark:bg-emerald-950 p-2.5 rounded-xl font-bold text-center text-xs text-emerald-800 dark:text-emerald-300 uppercase">${d.name}</div>`).join('')}
    `;

    slots.forEach((slot, slotIndex) => {
      html += `<div class="col-span-1 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl flex items-center justify-center font-bold text-xs text-slate-500">${slot}</div>`;
      days.forEach(d => {
        const courses = data.schedules.filter(s => s.day === d.num);
        const course = courses[slotIndex] || null;

        if (course) {
          html += `
            <div class="col-span-1 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-slate-800/80 border border-emerald-200/70 shadow-sm flex flex-col justify-between">
              <div>
                <span class="text-xs font-black text-emerald-950 dark:text-emerald-200 block">${course.subject}</span>
                <span class="text-[11px] text-slate-500 block">${course.teacher}</span>
              </div>
              <span class="text-[10px] font-bold text-emerald-700 mt-2 block"><i class="fa-solid fa-door-open mr-1"></i>${course.room}</span>
            </div>
          `;
        } else {
          html += `<div class="col-span-1 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 border border-dashed border-slate-200 flex items-center justify-center text-[11px] text-slate-400">Libre</div>`;
        }
      });
    });

    grid.innerHTML = html;
  }

  // ====================================================================
  // 12. FINANCES EN FCFA, ENCAISSEMENTS & REÇUS OFFICIELS
  // ====================================================================
  renderFinanceTable() {
    const data = ecoliaDB.data;
    const tbody = document.getElementById('payments-table-body');
    if (!tbody) return;

    tbody.innerHTML = data.payments.map(p => {
      const student = data.students.find(s => s.id === p.student_id) || { first_name: 'Élève', last_name: '', class_name: '3e A' };
      return `
        <tr class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
          <td class="py-3 px-4 font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400">${p.receipt_number}</td>
          <td class="py-3 px-4 text-xs text-slate-500">${p.date}</td>
          <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">
            ${student.last_name} ${student.first_name}
            <span class="text-[10px] text-slate-400 font-normal block">${student.class_name}</span>
          </td>
          <td class="py-3 px-4 text-xs text-slate-700 dark:text-slate-300 font-medium">${p.fee_category}</td>
          <td class="py-3 px-4 text-xs">
            <span class="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 font-bold text-[11px]">${p.mode}</span>
          </td>
          <td class="py-3 px-4 text-right font-black text-sm text-emerald-700 dark:text-emerald-300 font-mono">
            + ${p.amount.toLocaleString('fr-FR')} FCFA
          </td>
          <td class="py-3 px-4 text-right">
            <button onclick="app.viewOfficialReceipt('${p.id}')" class="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl shadow-sm">
              <i class="fa-solid fa-receipt"></i> Reçu
            </button>
          </td>
        </tr>
      `;
    }).join('');
  }

  renderUnpaidTable() {
    const data = ecoliaDB.data;
    const unpaidStudents = data.students.filter(s => s.balance_tuition > 0);
    const tbody = document.getElementById('unpaid-table-body');
    if (!tbody) return;

    tbody.innerHTML = unpaidStudents.map(s => `
      <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/40">
        <td class="py-3 px-4 font-bold text-slate-800 dark:text-white">
          ${s.last_name} ${s.first_name}
          <span class="text-[10px] text-slate-400 font-mono block">${s.matricule}</span>
        </td>
        <td class="py-3 px-4 font-semibold text-emerald-700">${s.class_name}</td>
        <td class="py-3 px-4">
          <div class="text-xs font-bold text-slate-700 dark:text-slate-300">${s.parent_name}</div>
          <div class="text-[10px] text-slate-400">${s.parent_phone}</div>
        </td>
        <td class="py-3 px-4 text-right font-mono text-xs">${s.annual_tuition.toLocaleString('fr-FR')} FCFA</td>
        <td class="py-3 px-4 text-right font-mono text-xs text-emerald-700 font-bold">${s.paid_tuition.toLocaleString('fr-FR')} FCFA</td>
        <td class="py-3 px-4 text-right font-mono text-xs text-rose-600 font-black">${s.balance_tuition.toLocaleString('fr-FR')} FCFA</td>
        <td class="py-3 px-4 text-right">
          <button onclick="app.openPaymentModal('${s.id}')" class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl">
            Régulariser
          </button>
        </td>
      </tr>
    `).join('');
  }

  openPaymentModal(studentId = null) {
    this.populateSelects();
    if (studentId) {
      document.getElementById('payment-form-student').value = studentId;
    }
    document.getElementById('modal-payment').classList.remove('hidden');
  }

  handleSavePayment(e) {
    e.preventDefault();
    const data = ecoliaDB.data;
    const studentId = document.getElementById('payment-form-student').value;
    const amount = parseFloat(document.getElementById('payment-form-amount').value);
    const date = document.getElementById('payment-form-date').value;
    const category = document.getElementById('payment-form-category').value;
    const mode = document.getElementById('payment-form-mode').value;
    const ref = document.getElementById('payment-form-reference').value.trim() || 'WAVE-CI-TXN';

    const receiptNumber = `REC-2026-${String(data.payments.length + 1).padStart(6, '0')}`;

    const newPayment = {
      id: `pay-${Date.now()}`,
      receipt_number: receiptNumber,
      student_id: studentId,
      amount,
      fee_category: category,
      date,
      mode,
      reference: ref,
      received_by: "Mme. BAKAYOKO (Comptabilité)"
    };

    data.payments.unshift(newPayment);

    // Update Student Balance
    const student = data.students.find(s => s.id === studentId);
    if (student) {
      student.paid_tuition += amount;
      student.balance_tuition = Math.max(0, student.annual_tuition - student.paid_tuition);
      student.payment_status = student.balance_tuition === 0 ? 'SOLDE' : 'PARTIEL';
    }

    ecoliaDB.saveDatabase();
    this.closeModals();
    this.renderFinanceTable();
    this.showToast(`Paiement de ${amount.toLocaleString('fr-FR')} FCFA enregistré (Reçu : ${receiptNumber})`, "success");
    this.viewOfficialReceipt(newPayment.id);
  }

  viewOfficialReceipt(paymentId) {
    const data = ecoliaDB.data;
    const p = data.payments.find(item => item.id === paymentId);
    if (!p) return;

    const student = data.students.find(s => s.id === p.student_id) || { first_name: 'Élève', last_name: '', class_name: '3e A', parent_name: 'Famille' };

    const content = document.getElementById('receipt-printable-content');
    content.innerHTML = `
      <div class="ecolia-receipt-sheet font-sans">
        <div class="ecolia-receipt-stamp">PAYÉ & CERTIFIÉ • FCFA</div>

        <div class="flex justify-between items-start border-b border-slate-200 pb-4 mb-4">
          <div>
            <div class="text-[9px] uppercase font-bold text-emerald-800">GROUPE SCOLAIRE HORIZON • ABIDJAN</div>
            <h2 class="text-base font-black text-slate-900">${data.school.name}</h2>
            <p class="text-xs text-slate-500">${data.school.address} • Tél: ${data.school.phone}</p>
          </div>
          <div class="text-right">
            <span class="text-sm font-mono font-black text-emerald-700 block">${p.receipt_number}</span>
            <span class="text-xs text-slate-400">Date : ${p.date}</span>
          </div>
        </div>

        <div class="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 text-xs space-y-2">
          <div class="flex justify-between">
            <span class="text-slate-400 uppercase font-bold">ÉLÈVE CONCERNÉ :</span>
            <span class="font-black text-slate-900">${student.last_name.toUpperCase()} ${student.first_name} (${student.class_name})</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400 uppercase font-bold">PARENT / PAYEUR :</span>
            <span class="font-bold text-slate-800">${student.parent_name}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400 uppercase font-bold">MOTIF DU RÈGLEMENT :</span>
            <span class="font-bold text-emerald-700">${p.fee_category}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-slate-400 uppercase font-bold">MODE DE PAIEMENT :</span>
            <span class="font-medium text-slate-700">${p.mode} (Réf : ${p.reference || 'ESP-CAISSE'})</span>
          </div>
        </div>

        <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between mb-4">
          <span class="text-xs font-extrabold text-emerald-900 uppercase">MONTANT TOTAL ENCAISSÉ :</span>
          <span class="text-2xl font-black text-emerald-700 font-mono">${p.amount.toLocaleString('fr-FR')} FCFA</span>
        </div>

        <div class="text-[10px] text-slate-400 text-center italic border-t border-slate-200 pt-3">
          Ce reçu certifie l'encaissement effectif des frais scolaires susmentionnés. Document officiel émis par ÉCOLIA.
        </div>
      </div>
    `;

    document.getElementById('modal-receipt').classList.remove('hidden');
  }

  // ====================================================================
  // 13. ANNONCES & PARAMÈTRES
  // ====================================================================
  renderAnnouncementsList() {
    const container = document.getElementById('announcements-full-list');
    if (!container) return;

    container.innerHTML = ecoliaDB.data.announcements.map(a => `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-2">
        <div class="flex items-center justify-between">
          <span class="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold">${a.target_label || a.target}</span>
          <span class="text-xs text-slate-400">${a.date}</span>
        </div>
        <h3 class="text-base font-extrabold text-slate-800 dark:text-white">${a.title}</h3>
        <p class="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">${a.content}</p>
        <div class="text-[10px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
          Publié par : <strong>${a.published_by}</strong>
        </div>
      </div>
    `).join('');
  }

  openNewAnnouncementModal() {
    const title = prompt("Titre de la circulaire / annonce :");
    if (!title) return;
    const content = prompt("Contenu du message officiel :");
    if (!content) return;

    ecoliaDB.data.announcements.unshift({
      id: `anc-${Date.now()}`,
      title,
      content,
      target: "TOUS",
      target_label: "Tous les Parents & Enseignants",
      date: new Date().toISOString().replace('T', ' ').slice(0, 16),
      published_by: this.currentUser.name
    });

    ecoliaDB.saveDatabase();
    this.renderAnnouncementsList();
    this.showToast("Annonce officielle diffusée avec succès", "success");
  }

  renderSettings() {
    const sch = ecoliaDB.data.school;
    document.getElementById('setting-school-name').value = sch.name;
    document.getElementById('setting-school-motto').value = sch.motto;
    document.getElementById('setting-school-address').value = sch.address;
    document.getElementById('setting-school-phone').value = sch.phone;
    document.getElementById('setting-school-email').value = sch.email;
  }

  saveSchoolSettings() {
    const sch = ecoliaDB.data.school;
    sch.name = document.getElementById('setting-school-name').value.trim();
    sch.motto = document.getElementById('setting-school-motto').value.trim();
    sch.address = document.getElementById('setting-school-address').value.trim();
    sch.phone = document.getElementById('setting-school-phone').value.trim();
    sch.email = document.getElementById('setting-school-email').value.trim();

    ecoliaDB.saveDatabase();
    this.showToast("Paramètres enregistrés avec succès", "success");
  }

  exportDatabaseJSON() {
    const str = JSON.stringify(ecoliaDB.data, null, 2);
    const blob = new Blob([str], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ECOLIA_Sauvegarde_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.showToast("Sauvegarde JSON exportée", "success");
  }

  openOnboardingModal() {
    alert("Parcours Onboarding Établissement en 8 étapes activé : 1. Nom école -> 2. Logo -> 3. Adresse -> 4. Téléphone -> 5. Année 2026-2027 -> 6. Niveaux -> 7. Classes -> 8. Admin Principal.");
  }

  resetToDemoData() {
    if (!confirm("Réinitialiser les données au Groupe Scolaire Horizon (Abidjan) ?")) return;
    ecoliaDB.resetDemo();
    this.init();
    this.showToast("Données réinitialisées aux valeurs initiales", "info");
  }

  // ====================================================================
  // 14. UTILITAIRES & MODALS
  // ====================================================================
  closeModals() {
    document.querySelectorAll('[id^="modal-"]').forEach(m => m.classList.add('hidden'));
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    const colors = {
      success: 'bg-emerald-600 text-white',
      error: 'bg-rose-600 text-white',
      warning: 'bg-amber-600 text-white',
      info: 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
    };

    toast.className = `flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-xs font-bold ${colors[type] || colors.info} transition-all duration-300 transform translate-y-2 opacity-0 pointer-events-auto`;
    toast.innerHTML = `<i class="fa-solid fa-bell"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'scale-95');
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  handleGlobalSearch(query) {
    if (!query) return;
    const clean = query.toLowerCase().trim();
    const student = ecoliaDB.data.students.find(s => `${s.first_name} ${s.last_name} ${s.matricule}`.toLowerCase().includes(clean));
    if (student) {
      this.switchTab('students');
      const input = document.getElementById('filter-students-query');
      if (input) {
        input.value = clean;
        this.renderStudentsList();
      }
    }
  }
}

// Initialiser l'application
const app = new EcoliaApp();
