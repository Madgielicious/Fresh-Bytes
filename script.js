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

document.addEventListener('DOMContentLoaded', () => {
  initRevealOnScroll();
  initFaqAccordion();
});
