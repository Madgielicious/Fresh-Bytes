// FreshStart — Services page logic

(function () {
  const tablist = document.getElementById('serviceTablist');
  const panel = document.getElementById('servicePanel');
  const searchInput = document.getElementById('serviceSearch');
  const searchBtn = document.getElementById('serviceSearchBtn');

  if (!tablist || !panel || typeof SERVICES_DATA === 'undefined') return;

  const STORAGE_PREFIX = 'freshstart_checklist_';

  function getChecklistState(serviceId) {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + serviceId);
      return raw ? JSON.parse(raw) : {};
    } catch (e) {
      return {};
    }
  }

  function setChecklistState(serviceId, state) {
    try {
      localStorage.setItem(STORAGE_PREFIX + serviceId, JSON.stringify(state));
    } catch (e) {
      // ignore storage errors (e.g. private browsing)
    }
  }

  function renderTabs(filterText = '') {
    tablist.innerHTML = '';
    const filtered = SERVICES_DATA.filter((s) =>
      s.name.toLowerCase().includes(filterText.toLowerCase())
    );

    if (filtered.length === 0) {
      tablist.innerHTML = '<p class="no-results">No services match your search.</p>';
      return;
    }

    filtered.forEach((service) => {
      const btn = document.createElement('button');
      btn.className = 'service-tab';
      btn.dataset.id = service.id;
      btn.innerHTML = `
        <span class="service-tab-icon">${service.tag}</span>
        <span class="service-tab-name">${service.name}</span>
      `;
      btn.addEventListener('click', () => selectService(service.id));
      tablist.appendChild(btn);
    });
  }

  function selectService(serviceId) {
    const service = SERVICES_DATA.find((s) => s.id === serviceId);
    if (!service) return;

    document.querySelectorAll('.service-tab').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.id === serviceId);
    });

    window.location.hash = serviceId;
    renderPanel(service);
  }

  function renderPanel(service) {
    const checklistState = getChecklistState(service.id);
    const checkedCount = service.requirements.filter((_, i) => checklistState[i]).length;

    panel.innerHTML = `
      <div class="service-panel-header">
        <span class="service-panel-icon">${service.tag}</span>
        <div>
          <h2>${service.name}</h2>
          <p>${service.blurb}</p>
        </div>
      </div>

      <div class="service-subtabs" role="tablist">
        <button class="subtab active" data-panel="requirements">Requirements <span class="subtab-count">${checkedCount}/${service.requirements.length}</span></button>
        <button class="subtab" data-panel="guide">Step-by-Step Guide</button>
        <button class="subtab" data-panel="office">Office Info</button>
      </div>

      <div class="subpanel" id="panel-requirements">
        <ul class="checklist">
          ${service.requirements
            .map(
              (req, i) => `
            <li>
              <label>
                <input type="checkbox" data-index="${i}" ${checklistState[i] ? 'checked' : ''} />
                <span>${req}</span>
              </label>
            </li>`
            )
            .join('')}
        </ul>
      </div>

      <div class="subpanel hidden" id="panel-guide">
        <ol class="guide-steps">
          ${service.steps.map((step) => `<li>${step}</li>`).join('')}
        </ol>
      </div>

      <div class="subpanel hidden" id="panel-office">
        <div class="office-card">
          <h4>${service.office.label}</h4>
          <p><strong>Typical hours:</strong> ${service.office.hours}</p>
          <p>${service.office.note}</p>
          <a href="${service.office.link}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary">${service.office.linkLabel} ↗</a>
        </div>
      </div>
    `;

    // Subtab switching
    panel.querySelectorAll('.subtab').forEach((tab) => {
      tab.addEventListener('click', () => {
        panel.querySelectorAll('.subtab').forEach((t) => t.classList.remove('active'));
        panel.querySelectorAll('.subpanel').forEach((p) => p.classList.add('hidden'));
        tab.classList.add('active');
        document.getElementById(`panel-${tab.dataset.panel}`).classList.remove('hidden');
      });
    });

    // Checklist persistence
    panel.querySelectorAll('.checklist input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', () => {
        const state = getChecklistState(service.id);
        state[checkbox.dataset.index] = checkbox.checked;
        setChecklistState(service.id, state);

        const newCheckedCount = service.requirements.filter((_, i) => state[i]).length;
        const countLabel = panel.querySelector('.subtab-count');
        if (countLabel) countLabel.textContent = `${newCheckedCount}/${service.requirements.length}`;
      });
    });
  }

  // Init
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  if (searchInput && initialQuery) searchInput.value = initialQuery;

  renderTabs(initialQuery);
  const hashId = window.location.hash ? window.location.hash.replace('#', '') : null;
  const firstMatch = tablist.querySelector('.service-tab');
  const initialId = hashId && SERVICES_DATA.some((s) => s.id === hashId)
    ? hashId
    : firstMatch
      ? firstMatch.dataset.id
      : SERVICES_DATA[0].id;
  const initial = SERVICES_DATA.find((s) => s.id === initialId) || SERVICES_DATA[0];
  selectService(initial.id);

  // Search filtering
  function runSearch() {
    renderTabs(searchInput.value.trim());
    const firstVisible = tablist.querySelector('.service-tab');
    if (firstVisible) selectService(firstVisible.dataset.id);
  }

  if (searchInput) {
    searchInput.addEventListener('input', runSearch);
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', runSearch);
  }
})();
