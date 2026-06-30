// Hero search redirects to the services page
const heroSearchForm = document.getElementById('heroSearchForm');
const heroSearchInput = document.getElementById('heroSearchInput');

if (heroSearchForm && heroSearchInput) {
  heroSearchForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const query = heroSearchInput.value.trim();
    window.location.href = query
      ? `services.html?q=${encodeURIComponent(query)}`
      : 'services.html';
  });
}

// Mobile menu toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  // Close menu when a link is clicked (mobile)
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
    });
  });
}

// Gemini chat integration
const chatForm = document.getElementById('chatForm');
const chatInput = document.getElementById('chatInput');
const chatWindow = document.getElementById('chatWindow');
const chatStatus = document.getElementById('chatStatus');

const GEMINI_MODEL = 'gemini-2.0-flash';

function addMessage(text, role = 'bot') {
  if (!chatWindow) return;

  const message = document.createElement('div');
  message.className = `message ${role}`;
  message.textContent = text;
  chatWindow.appendChild(message);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function setStatus(text) {
  if (chatStatus) {
    chatStatus.textContent = text;
  }
}

if (chatForm && chatInput && chatWindow) {
  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const question = chatInput.value.trim();
    if (!question) return;

    addMessage(question, 'user');
    chatInput.value = '';
    setStatus('Thinking...');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question })
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMessage = data?.error || data?.message || `Request failed with status ${response.status}`;
        throw new Error(errorMessage);
      }

      const answer = data?.answer || 'Sorry, I could not generate a response.';

      addMessage(answer.replace(/\n+/g, '\n').trim(), 'bot');
      setStatus('Ready');
    } catch (error) {
      console.error(error);
      const detail = error.message || 'Unknown error';
      addMessage(`The AI service is unavailable right now. Backend reported: ${detail}`, 'bot');
      setStatus('Error');
    }
  });
}

function initRevealOnScroll() {
  const options = {
    root: null,
    rootMargin: '0px 0px -100px 0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.remove('leave');
      } else {
        entry.target.classList.remove('visible');
        entry.target.classList.add('leave');
      }
    });
  }, options);

  document.querySelectorAll('.card.reveal').forEach((card) => {
    observer.observe(card);
  });
}

function initFaqAccordion() {
  const faqToggles = document.querySelectorAll('.faq-toggle');

  faqToggles.forEach((toggle) => {
    toggle.addEventListener('click', () => {
      const card = toggle.closest('.faq-card');
      if (!card) return;

      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      card.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(!expanded));
    });
  });
}

function initServiceCardPreviews() {
  if (typeof SERVICES_DATA === 'undefined') return;

  document.querySelectorAll('.card-expandable').forEach((card) => {
    const serviceId = card.dataset.service;
    const service = SERVICES_DATA.find((s) => s.id === serviceId);
    if (!service) return;

    const expand = document.createElement('div');
    expand.className = 'card-expand';
    expand.innerHTML = `
      <p class="card-expand-label">Top requirements:</p>
      <ul class="card-expand-list">
        ${service.requirements.slice(0, 3).map((req) => `<li>${req}</li>`).join('')}
      </ul>
      <a href="services.html#${service.id}" class="card-link">Open full guide →</a>
    `;
    card.appendChild(expand);
    card.classList.add('clickable');
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-expanded', 'false');

    const toggle = () => {
      const isOpen = card.classList.toggle('open');
      card.setAttribute('aria-expanded', String(isOpen));
    };

    card.addEventListener('click', (event) => {
      if (event.target.closest('a')) return; // let the link navigate normally
      toggle();
    });

    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        if (event.target.closest('a')) return;
        event.preventDefault();
        toggle();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initRevealOnScroll();
  initFaqAccordion();
  initServiceCardPreviews();
});
