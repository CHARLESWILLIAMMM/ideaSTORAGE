/* =========================================================
   AI Workflow Vault — app.js
   Local Storage · Category filtering · Copy to clipboard
   ========================================================= */

'use strict';

// ── Constants ─────────────────────────────────────────────
const STORAGE_KEY = 'aivault_prompts';

// ── DOM refs ───────────────────────────────────────────────
const titleInput    = document.getElementById('prompt-title');
const categorySelect= document.getElementById('prompt-category');
const bodyInput     = document.getElementById('prompt-body');
const saveBtn       = document.getElementById('save-btn');
const toast         = document.getElementById('save-toast');
const promptList    = document.getElementById('prompt-list');
const emptyState    = document.getElementById('empty-state');
const promptCount   = document.getElementById('prompt-count');
const filterBar     = document.getElementById('filter-bar');
const charCount     = document.getElementById('char-count');

let activeFilter = 'All';

// ── Helpers ────────────────────────────────────────────────
function loadPrompts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function savePrompts(prompts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prompts));
}

function generateId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast ${type} show`;
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2800);
}

// ── Character counter ──────────────────────────────────────
bodyInput.addEventListener('input', () => {
  const len = bodyInput.value.length;
  charCount.textContent = `${len} / 5000`;
  charCount.style.color = len > 4800 ? '#fc8181' : '';
});

// ── Save ───────────────────────────────────────────────────
saveBtn.addEventListener('click', () => {
  const title    = titleInput.value.trim();
  const category = categorySelect.value;
  const body     = bodyInput.value.trim();

  if (!title) {
    showToast('⚠️ Please enter a title.', 'error');
    titleInput.focus();
    return;
  }
  if (!category) {
    showToast('⚠️ Please choose a category.', 'error');
    categorySelect.focus();
    return;
  }
  if (!body) {
    showToast('⚠️ Please type your AI prompt.', 'error');
    bodyInput.focus();
    return;
  }

  const prompts = loadPrompts();
  const newPrompt = {
    id:        generateId(),
    title,
    category,
    body,
    createdAt: new Date().toISOString(),
  };
  prompts.unshift(newPrompt);   // newest first
  savePrompts(prompts);

  // Clear form
  titleInput.value    = '';
  categorySelect.value = '';
  bodyInput.value     = '';
  charCount.textContent = '0 / 5000';

  showToast('✅ Prompt saved to your vault!');
  renderPrompts();
});

// ── Render all cards ───────────────────────────────────────
function renderPrompts() {
  const prompts  = loadPrompts();
  const filtered = activeFilter === 'All'
    ? prompts
    : prompts.filter(p => p.category === activeFilter);

  // Update count badge
  const total = prompts.length;
  promptCount.textContent = `${total} prompt${total !== 1 ? 's' : ''}`;

  // Clear list
  promptList.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.hidden = false;
    emptyState.textContent = total === 0
      ? 'No prompts here yet. Start adding some above! 🚀'
      : `No prompts in "${activeFilter}" yet.`;
    return;
  }

  emptyState.hidden = true;

  filtered.forEach(prompt => {
    const card = buildCard(prompt);
    promptList.appendChild(card);
  });
}

// ── Build a single card ────────────────────────────────────
function buildCard(prompt) {
  const card = document.createElement('article');
  card.className = 'prompt-card';
  card.dataset.id       = prompt.id;
  card.dataset.category = prompt.category;

  const isLong = prompt.body.length > 200;

  card.innerHTML = `
    <div class="card-header">
      <h3 class="card-title">${escapeHTML(prompt.title)}</h3>
      <span class="card-badge">${escapeHTML(prompt.category)}</span>
    </div>
    <p class="card-body" id="body-${prompt.id}">${escapeHTML(prompt.body)}</p>
    ${isLong ? `<button class="card-expand-btn" data-id="${prompt.id}">Show more ▾</button>` : ''}
    <div class="card-footer">
      <span class="card-date">${formatDate(prompt.createdAt)}</span>
      <div class="card-actions">
        <button class="btn btn-copy" data-id="${prompt.id}" title="Copy prompt to clipboard">
          📋 Copy
        </button>
        <button class="btn btn-delete" data-id="${prompt.id}" title="Delete prompt">
          🗑️ Delete
        </button>
      </div>
    </div>
  `;

  return card;
}

// ── Escape HTML to prevent XSS ─────────────────────────────
function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ── Delegated events on the list ──────────────────────────
promptList.addEventListener('click', (e) => {
  // Copy button
  const copyBtn = e.target.closest('.btn-copy');
  if (copyBtn) {
    const id = copyBtn.dataset.id;
    const prompts = loadPrompts();
    const prompt = prompts.find(p => p.id === id);
    if (!prompt) return;

    navigator.clipboard.writeText(prompt.body).then(() => {
      copyBtn.textContent = '✅ Copied!';
      copyBtn.classList.add('copied');
      setTimeout(() => {
        copyBtn.textContent = '📋 Copy';
        copyBtn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      // Fallback for browsers without the Clipboard API
      try {
        const ta = document.createElement('textarea');
        ta.value = prompt.body;
        ta.style.position = 'fixed';
        ta.style.opacity  = '0';
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (!ok) throw new Error('execCommand returned false');
        copyBtn.textContent = '✅ Copied!';
        setTimeout(() => { copyBtn.textContent = '📋 Copy'; }, 2000);
      } catch {
        // Both methods failed — notify the user visibly
        showToast('⚠️ Copy failed — please select and copy the text manually.', 'error');
        copyBtn.textContent = '📋 Copy';
        copyBtn.classList.remove('copied');
      }
    });
    return;
  }

  // Delete button
  const deleteBtn = e.target.closest('.btn-delete');
  if (deleteBtn) {
    const id = deleteBtn.dataset.id;
    const prompts = loadPrompts();
    const updated = prompts.filter(p => p.id !== id);
    savePrompts(updated);
    renderPrompts();
    return;
  }

  // Expand button
  const expandBtn = e.target.closest('.card-expand-btn');
  if (expandBtn) {
    const id = expandBtn.dataset.id;
    const bodyEl = document.getElementById(`body-${id}`);
    if (bodyEl.classList.toggle('expanded')) {
      expandBtn.textContent = 'Show less ▴';
    } else {
      expandBtn.textContent = 'Show more ▾';
    }
  }
});

// ── Category filter ────────────────────────────────────────
filterBar.addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-filter');
  if (!btn) return;

  document.querySelectorAll('.btn-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  renderPrompts();
});

// ── Initial render ─────────────────────────────────────────
renderPrompts();

// ── Register Service Worker ────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {
      // SW registration failed silently — app still works online
    });
  });
}
