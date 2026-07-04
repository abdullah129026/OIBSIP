/* ═══════════════════════════════════════════════════════════
   TASKFLOW — app.js
   Full vanilla JS: state management, CRUD, localStorage,
   inline editing, theme toggling, animations, rendering.
═══════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════════════════════
   1. STATE
══════════════════════════════════════ */
const STORAGE_KEY = 'taskflow_v1';

const state = {
  tasks:          [],
  theme:          'light',
  activeCategory: 'Meeting',
  activePriority: 'medium',
  alertOn:        false,
  activeFilter:   'all',
};

/* ══════════════════════════════════════
   2. PERSISTENCE
══════════════════════════════════════ */
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      tasks: state.tasks,
      theme: state.theme,
    }));
  } catch (e) {
    console.warn('localStorage unavailable:', e);
  }
}

function hydrate() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.tasks)) state.tasks = saved.tasks;
    if (saved.theme) state.theme = saved.theme;
  } catch (e) {
    console.warn('Failed to hydrate state:', e);
  }
}

/* ══════════════════════════════════════
   3. UTILITY HELPERS
══════════════════════════════════════ */
function formatTime(iso) {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function escapeHtml(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str));
  return d.innerHTML;
}

function generateId() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2) + Date.now();
}

function categoryToAvatar(cat) {
  const map = {
    'Meeting':   'coral',
    'Design':    'blue',
    'Personal':  'pink',
    'Work':      'indigo',
    'Free time': 'mint',
    'Travel':    'travel',
  };
  return map[cat] || 'coral';
}

/* ══════════════════════════════════════
   4. TOAST NOTIFICATION
══════════════════════════════════════ */
let toastTimer = null;

function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('is-visible');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2800);
}

/* ══════════════════════════════════════
   5. THEME
══════════════════════════════════════ */
function applyTheme() {
  document.documentElement.dataset.theme = state.theme;
  document.body.dataset.theme = state.theme;
}

function toggleTheme() {
  state.theme = state.theme === 'light' ? 'dark' : 'light';
  applyTheme();
  persist();
}

/* ══════════════════════════════════════
   6. CREATE / EDIT PANEL
══════════════════════════════════════ */
let panelOpen = false;

function openCreatePanel(editId = null) {
  const panel   = document.getElementById('panel-create');
  const overlay = document.getElementById('overlay');
  const title   = document.getElementById('create-panel-title');
  const cta     = document.getElementById('cta-label');
  const editInput = document.getElementById('editing-id');

  if (editId) {
    const task = state.tasks.find(t => t.id === editId);
    if (!task) return;
    title.textContent   = 'Edit Task';
    cta.textContent     = 'Save Changes';
    editInput.value     = editId;
    document.getElementById('input-task-title').value = task.title;
    document.getElementById('input-task-desc').value  = task.description || '';
    setActiveCategory(task.category || 'Meeting');
    setActivePriority(task.priority  || 'medium');
    const alertBtn = document.getElementById('toggle-alert');
    const alertOn = task.alertOn || false;
    alertBtn.setAttribute('aria-checked', alertOn ? 'true' : 'false');
    state.alertOn = alertOn;
  } else {
    title.textContent = 'New Task';
    cta.textContent   = 'Create Task';
    editInput.value   = '';
    document.getElementById('create-form').reset();
    setActiveCategory(state.activeCategory);
    setActivePriority('medium');
    document.getElementById('toggle-alert').setAttribute('aria-checked', 'false');
    state.alertOn = false;
    document.getElementById('title-error').textContent = '';
  }

  panel.classList.remove('is-desktop-hidden');
  panel.classList.add('is-open');
  panel.setAttribute('aria-hidden', 'false');
  overlay.classList.add('is-visible');
  panelOpen = true;

  setTimeout(() => document.getElementById('input-task-title').focus(), 350);
}

function closeCreatePanel() {
  const panel   = document.getElementById('panel-create');
  const overlay = document.getElementById('overlay');

  // On desktop, slide out to the right
  if (window.innerWidth >= 1024) {
    panel.classList.add('is-desktop-hidden');
  } else {
    panel.classList.remove('is-open');
  }

  panel.setAttribute('aria-hidden', 'true');
  overlay.classList.remove('is-visible');
  panelOpen = false;
}

/* ── Category selection ── */
function setActiveCategory(cat) {
  state.activeCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(btn => {
    const isActive = btn.dataset.cat === cat;
    btn.classList.toggle('cat-pill--active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

/* ── Priority selection ── */
function setActivePriority(priority) {
  state.activePriority = priority;
  document.querySelectorAll('.priority-btn').forEach(btn => {
    const isActive = btn.dataset.priority === priority;
    btn.classList.toggle('priority-btn--active', isActive);
    btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
}

/* ══════════════════════════════════════
   7. CRUD OPERATIONS
══════════════════════════════════════ */

/* ── Add task ── */
function addTask() {
  const titleInput = document.getElementById('input-task-title');
  const errorEl    = document.getElementById('title-error');
  const title = titleInput.value.trim();

  if (!title) {
    errorEl.textContent = 'Task title is required.';
    titleInput.focus();
    titleInput.style.borderColor = '#e05252';
    setTimeout(() => { titleInput.style.borderColor = ''; errorEl.textContent = ''; }, 2500);
    return;
  }

  const task = {
    id:          generateId(),
    title,
    description: document.getElementById('input-task-desc').value.trim(),
    category:    state.activeCategory,
    priority:    state.activePriority,
    alertOn:     state.alertOn,
    completed:   false,
    createdAt:   new Date().toISOString(),
    completedAt: null,
  };

  state.tasks.unshift(task);
  persist();
  render();
  closeCreatePanel();
  showToast('✅ Task added!');
}

/* ── Save edit ── */
function saveEdit(editId) {
  const titleInput = document.getElementById('input-task-title');
  const errorEl    = document.getElementById('title-error');
  const title = titleInput.value.trim();

  if (!title) {
    errorEl.textContent = 'Task title is required.';
    titleInput.focus();
    return;
  }

  const task = state.tasks.find(t => t.id === editId);
  if (!task) return;

  task.title       = title;
  task.description = document.getElementById('input-task-desc').value.trim();
  task.category    = state.activeCategory;
  task.priority    = state.activePriority;
  task.alertOn     = state.alertOn;

  persist();
  render();
  closeCreatePanel();
  showToast('✏️ Task updated!');
}

/* ── Toggle complete ── */
function toggleComplete(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;
  task.completed   = !task.completed;
  task.completedAt = task.completed ? new Date().toISOString() : null;
  persist();
  render();
  showToast(task.completed ? '🎉 Task completed!' : '↩️ Moved back to pending');
}

/* ── Delete task ── */
function deleteTask(id) {
  const item = document.getElementById(`task-${id}`);
  if (!item) return;

  item.classList.add('task-item--removing');
  item.addEventListener('animationend', () => {
    state.tasks = state.tasks.filter(t => t.id !== id);
    persist();
    render();
    showToast('🗑️ Task deleted');
  }, { once: true });
}

/* ── Inline quick edit (from task row) ── */
function startInlineEdit(id) {
  openCreatePanel(id);
}

/* ══════════════════════════════════════
   8. FILTER
══════════════════════════════════════ */
function setFilter(filter) {
  state.activeFilter = filter;
  document.querySelectorAll('.filter-pill').forEach(btn => {
    const isActive = btn.dataset.filter === filter;
    btn.classList.toggle('filter-pill--active', isActive);
    btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });
  render();
}

function getFilteredTasks() {
  if (state.activeFilter === 'all') return state.tasks;
  return state.tasks.filter(t => t.category === state.activeFilter);
}

/* ══════════════════════════════════════
   9. RENDER
══════════════════════════════════════ */
function render() {
  const filtered  = getFilteredTasks();
  const pending   = filtered.filter(t => !t.completed);
  const completed = filtered.filter(t =>  t.completed);

  renderList(pending,   'list-pending',   'empty-pending');
  renderList(completed, 'list-completed', 'empty-completed');
  updateCounts(pending.length, completed.length);
}

function renderList(tasks, listId, emptyId) {
  const list  = document.getElementById(listId);
  const empty = document.getElementById(emptyId);

  // Remove items that are no longer in list (soft delete animation keeps them briefly)
  const existingIds = new Set(tasks.map(t => t.id));
  Array.from(list.children).forEach(li => {
    if (!existingIds.has(li.dataset.taskId) && !li.classList.contains('task-item--removing')) {
      li.remove();
    }
  });

  // Rebuild — only update changed items to avoid jank
  const existingEls = {};
  Array.from(list.children).forEach(li => {
    if (li.dataset.taskId) existingEls[li.dataset.taskId] = li;
  });

  // Re-render full list cleanly
  list.innerHTML = '';
  tasks.forEach(task => {
    list.appendChild(buildTaskItem(task));
  });

  // Toggle empty state
  const hasItems = tasks.length > 0;
  list.style.display  = hasItems ? 'flex'  : 'none';
  empty.style.display = hasItems ? 'none'  : 'flex';
}

function buildTaskItem(task) {
  const li = document.createElement('li');
  li.className = 'task-item';
  li.id = `task-${task.id}`;
  li.dataset.taskId = task.id;
  li.dataset.cat = task.category || '';
  li.setAttribute('role', 'listitem');

  const priorityLabel = { high: '🔴 High', medium: '🟡 Medium', low: '🟢 Low' }[task.priority] || '';
  const createdStr    = task.createdAt   ? `Added ${formatTime(task.createdAt)}` : '';
  const completedStr  = task.completedAt ? `Completed ${formatTime(task.completedAt)}` : '';

  li.innerHTML = `
    <button
      class="toggle-btn ${task.completed ? 'toggle-btn--done' : ''}"
      onclick="toggleComplete('${task.id}')"
      aria-label="${task.completed ? 'Mark as pending' : 'Mark as complete'}"
      title="${task.completed ? 'Undo' : 'Complete'}"
    >
      <span class="check-icon" aria-hidden="true">✓</span>
    </button>

    <div class="task-body">
      <span class="task-title ${task.completed ? 'task-title--done' : ''}">${escapeHtml(task.title)}</span>
      ${task.description
        ? `<span class="task-desc">${escapeHtml(task.description)}</span>`
        : ''}
      <div class="task-meta-row">
        ${task.category
          ? `<span class="task-cat-badge" data-cat="${escapeHtml(task.category)}">${escapeHtml(task.category)}</span>`
          : ''}
        ${task.priority
          ? `<span class="task-priority-badge task-priority-badge--${task.priority}">${priorityLabel}</span>`
          : ''}
      </div>
      <div class="task-meta-row">
        <span class="task-timestamp">${createdStr}</span>
        ${completedStr ? `<span class="task-timestamp">· ${completedStr}</span>` : ''}
      </div>
    </div>

    <div class="task-actions">
      <button
        class="icon-btn btn-edit"
        onclick="startInlineEdit('${task.id}')"
        aria-label="Edit task"
        title="Edit"
      >✏️</button>
      <button
        class="icon-btn btn-delete"
        onclick="deleteTask('${task.id}')"
        aria-label="Delete task"
        title="Delete"
      >🗑️</button>
    </div>
  `;

  return li;
}

function updateCounts(pendingCount, completedCount) {
  document.getElementById('count-pending').textContent   = `${pendingCount} pending`;
  document.getElementById('count-completed').textContent = `${completedCount} completed`;
}

/* ══════════════════════════════════════
   10. QUICK ADD (mobile bar)
══════════════════════════════════════ */
function handleQuickAdd() {
  const input = document.getElementById('quick-input');
  const title = input.value.trim();
  if (!title) {
    input.focus();
    input.style.outline = '2px solid #e05252';
    setTimeout(() => { input.style.outline = ''; }, 1800);
    return;
  }

  const task = {
    id:          generateId(),
    title,
    description: '',
    category:    state.activeCategory,
    priority:    'medium',
    alertOn:     false,
    completed:   false,
    createdAt:   new Date().toISOString(),
    completedAt: null,
  };

  state.tasks.unshift(task);
  persist();
  render();
  input.value = '';
  showToast('✅ Task added!');
}

/* ══════════════════════════════════════
   11. HEADER DATE
══════════════════════════════════════ */
function setHeaderDate() {
  const el = document.getElementById('header-date');
  if (!el) return;
  const now = new Date();
  el.textContent = now.toLocaleDateString(undefined, {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}

/* ══════════════════════════════════════
   12. EVENT WIRING
══════════════════════════════════════ */
function wireEvents() {

  /* ── Theme toggles (all three) ── */
  ['theme-toggle-rail', 'theme-toggle-header', 'theme-toggle-mobile'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', toggleTheme);
  });

  /* ── Open create panel ── */
  const btnRail   = document.getElementById('btn-new-task-rail');
  const fabMobile = document.getElementById('fab-mobile');
  if (btnRail)   btnRail.addEventListener('click',   () => openCreatePanel());
  if (fabMobile) fabMobile.addEventListener('click', () => openCreatePanel());

  /* ── Close create panel ── */
  document.getElementById('btn-close-create').addEventListener('click', closeCreatePanel);
  document.getElementById('overlay').addEventListener('click', closeCreatePanel);

  /* ── Form submit ── */
  document.getElementById('create-form').addEventListener('submit', e => {
    e.preventDefault();
    const editId = document.getElementById('editing-id').value;
    if (editId) {
      saveEdit(editId);
    } else {
      addTask();
    }
  });

  /* ── Category pills ── */
  document.getElementById('category-pills').addEventListener('click', e => {
    const pill = e.target.closest('.cat-pill');
    if (pill) setActiveCategory(pill.dataset.cat);
  });

  /* ── Priority buttons ── */
  document.querySelector('.priority-row').addEventListener('click', e => {
    const btn = e.target.closest('.priority-btn');
    if (btn) setActivePriority(btn.dataset.priority);
  });

  /* ── Alert toggle ── */
  document.getElementById('toggle-alert').addEventListener('click', function () {
    state.alertOn = !state.alertOn;
    this.setAttribute('aria-checked', state.alertOn ? 'true' : 'false');
  });

  /* ── Filter pills ── */
  document.querySelector('.filter-row').addEventListener('click', e => {
    const pill = e.target.closest('.filter-pill');
    if (pill) setFilter(pill.dataset.filter);
  });

  /* ── Quick add bar ── */
  document.getElementById('btn-quick-add').addEventListener('click', handleQuickAdd);
  document.getElementById('quick-input').addEventListener('keydown', e => {
    if (e.key === 'Enter') handleQuickAdd();
  });

  /* ── Keyboard: Escape closes panel ── */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panelOpen) closeCreatePanel();
  });

  /* ── Bottom nav / sidebar nav tabs ── */
  function handleTabClick(btn) {
    const tab = btn.dataset.tab;
    // Future: navigate between views. For now just mark active.
    document.querySelectorAll('.bottom-tab, .nav-tab').forEach(t => {
      t.classList.remove('bottom-tab--active', 'nav-tab--active');
      t.removeAttribute('aria-current');
    });
    btn.classList.add(btn.classList.contains('bottom-tab') ? 'bottom-tab--active' : 'nav-tab--active');
    btn.setAttribute('aria-current', 'page');
  }

  document.querySelectorAll('.bottom-tab[data-tab], .nav-tab[data-tab]').forEach(btn => {
    btn.addEventListener('click', () => handleTabClick(btn));
  });

  /* ── Hamburger (mobile menu — no sidebar on mobile, can open create) ── */
  const hamburger = document.getElementById('hamburger-btn');
  if (hamburger) hamburger.addEventListener('click', () => openCreatePanel());
}

/* ══════════════════════════════════════
   13. SAMPLE TASKS (first launch)
══════════════════════════════════════ */
function seedSampleTasks() {
  const now = new Date();
  const past = (mins) => new Date(now - mins * 60000).toISOString();

  state.tasks = [
    {
      id:          generateId(),
      title:       'Design the new landing page mockup',
      description: 'Create wireframes and high-fidelity designs for the homepage revamp.',
      category:    'Design',
      priority:    'high',
      alertOn:     true,
      completed:   false,
      createdAt:   past(45),
      completedAt: null,
    },
    {
      id:          generateId(),
      title:       'Team sync meeting',
      description: 'Weekly standup — review sprint progress and blockers.',
      category:    'Meeting',
      priority:    'medium',
      alertOn:     true,
      completed:   false,
      createdAt:   past(120),
      completedAt: null,
    },
    {
      id:          generateId(),
      title:       'Book flights for the conference',
      description: 'Check prices on Google Flights and book before end of day.',
      category:    'Travel',
      priority:    'medium',
      alertOn:     false,
      completed:   false,
      createdAt:   past(200),
      completedAt: null,
    },
    {
      id:          generateId(),
      title:       'Submit quarterly report',
      description: 'Compile Q2 metrics and send to management.',
      category:    'Work',
      priority:    'high',
      alertOn:     false,
      completed:   true,
      createdAt:   past(1440),
      completedAt: past(60),
    },
    {
      id:          generateId(),
      title:       'Gym session — leg day 💪',
      description: '',
      category:    'Personal',
      priority:    'low',
      alertOn:     false,
      completed:   true,
      createdAt:   past(1500),
      completedAt: past(480),
    },
  ];
}

/* ══════════════════════════════════════
   14. INIT
══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  hydrate();

  // Seed sample data on very first launch
  if (state.tasks.length === 0) {
    seedSampleTasks();
    persist();
  }

  applyTheme();
  setHeaderDate();
  wireEvents();
  render();

  // On desktop, show create panel by default (persistent right rail)
  if (window.innerWidth >= 1024) {
    const panel = document.getElementById('panel-create');
    panel.classList.remove('is-desktop-hidden');
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    panelOpen = true;
  }
});

/* ══════════════════════════════════════
   15. EXPOSE GLOBALS for onclick attrs
══════════════════════════════════════ */
window.toggleComplete    = toggleComplete;
window.deleteTask        = deleteTask;
window.startInlineEdit   = startInlineEdit;
