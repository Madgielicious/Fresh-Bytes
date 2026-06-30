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

  function matchesQuery(service, query) {
    if (!query) return true;
    const q = query.toLowerCase();
    const haystack = [
      service.name,
      service.blurb,
      ...(service.keywords || [])
    ]
      .join(' ')
      .toLowerCase();
    return haystack.includes(q);
  }

  function renderTabs(filterText = '') {
    tablist.innerHTML = '';
    const filtered = SERVICES_DATA.filter((s) => matchesQuery(s, filterText.trim()));

    if (filtered.length === 0) {
      tablist.innerHTML = `<p class="no-results">No services match "${filterText}".</p>`;
      panel.innerHTML = `
        <div class="panel-empty">
          <h2>No matching services</h2>
          <p>Try a different word, like a service name (e.g. "PhilHealth"), a document (e.g. "birth certificate"), or an agency (e.g. "DFA").</p>
          <button type="button" class="btn btn-secondary" id="clearSearchBtn">Clear search</button>
        </div>
      `;
      const clearBtn = document.getElementById('clearSearchBtn');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          runSearch();
        });
      }
      return [];
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

    return filtered;
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

        <div class="map-locator" data-map-query="${service.office.mapQuery}">
          <div class="map-locator-header">
            <h4>Find the Nearest Office</h4>
            <button type="button" class="btn btn-accent map-locate-btn">📍 Use My Location</button>
          </div>
          <p class="map-locator-hint">Allow location access for a map centered near you, or browse the general area below.</p>
          <div class="map-frame-wrap">
            <iframe
              class="map-frame"
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps?q=${encodeURIComponent(service.office.mapQuery + ' Philippines')}&output=embed">
            </iframe>
          </div>
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
    // Map locator — "Use My Location"
    const locateBtn = panel.querySelector('.map-locate-btn');
    const mapLocator = panel.querySelector('.map-locator');
    const mapFrame = panel.querySelector('.map-frame');
    const mapHint = panel.querySelector('.map-locator-hint');

    if (locateBtn && mapFrame && mapLocator) {
      locateBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
          mapHint.textContent = 'Location access is not supported on this browser. Showing the general area instead.';
          return;
        }

        locateBtn.disabled = true;
        locateBtn.textContent = 'Locating...';

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            const query = mapLocator.dataset.mapQuery;
            mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(query)}&ll=${latitude},${longitude}&z=14&output=embed`;
            mapHint.textContent = 'Showing offices near your current location.';
            locateBtn.disabled = false;
            locateBtn.textContent = '📍 Location Found';
          },
          () => {
            mapHint.textContent = 'Location access was denied. Showing the general area instead — search your city directly on the map.';
            locateBtn.disabled = false;
            locateBtn.textContent = '📍 Use My Location';
          }
        );
      });
    }
  }

  // Init
  const urlParams = new URLSearchParams(window.location.search);
  const initialQuery = urlParams.get('q') || '';
  if (searchInput && initialQuery) searchInput.value = initialQuery;

  const initialFiltered = renderTabs(initialQuery);
  const hashId = window.location.hash ? window.location.hash.replace('#', '') : null;
  const hashMatchesFiltered = hashId && initialFiltered.some((s) => s.id === hashId);
  const initialId = hashMatchesFiltered
    ? hashId
    : initialFiltered.length > 0
      ? initialFiltered[0].id
      : null;

  if (initialId) {
    const initial = SERVICES_DATA.find((s) => s.id === initialId);
    if (initial) selectService(initial.id);
  }

  // Search filtering
  function runSearch() {
    const filtered = renderTabs(searchInput.value);
    if (filtered.length > 0) {
      selectService(filtered[0].id);
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', runSearch);
    searchInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        runSearch();
      }
    });
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', runSearch);
  }
})();
