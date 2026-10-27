(() => {
  'use strict';
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const themeColor = document.querySelector('meta[name="theme-color"]');
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)');
  const updateTheme = (theme, save = false) => {
    root.dataset.theme = theme;
    const label = 'Switch to ' + (theme === 'dark' ? 'light' : 'dark') + ' mode';
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
    themeColor.setAttribute('content', theme === 'dark' ? '#0a101d' : '#fcfcfd');
    if (save) { try { localStorage.setItem('kb-theme', theme); } catch {} }
  };
  updateTheme(root.dataset.theme);
  themeToggle.addEventListener('click', () => updateTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true));
  systemTheme.addEventListener('change', event => {
    let stored;
    try { stored = localStorage.getItem('kb-theme'); } catch {}
    if (!stored) updateTheme(event.matches ? 'light' : 'dark');
  });
  const menuButton = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');
  const closeMenu = () => {
    document.body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
  };
  menuButton.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
      closeMenu(); menuButton.focus();
    }
    if (event.key === 'Tab' && document.body.classList.contains('menu-open')) {
      const links = [...nav.querySelectorAll('a')];
      if (!event.shiftKey && document.activeElement === menuButton) { event.preventDefault(); links[0].focus(); }
      if (event.shiftKey && document.activeElement === links[0]) { event.preventDefault(); menuButton.focus(); }
    }
  });
  document.addEventListener('click', event => {
    if (document.body.classList.contains('menu-open') && !event.target.closest('.site-header')) closeMenu();
  });
  window.matchMedia('(min-width: 641px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
  if ('IntersectionObserver' in window) {
    const navLinks = [...nav.querySelectorAll('a')];
    const sectionObserver = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const current = link.hash === '#' + entry.target.id;
          link.classList.toggle('active', current);
          if (current) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        });
      }
    }, { rootMargin: '-15% 0px -55% 0px', threshold: 0 });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));
  }
  document.getElementById('year').textContent = String(new Date().getFullYear());
  document.getElementById('form-url').value = window.location.href.split('#')[0];

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  const button = form.querySelector('button[type="submit"]');
  const buttonLabel = button.querySelector('span');
  let sending = false;
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (sending || !form.reportValidity()) return;
    const data = new FormData(form);
    if (String(data.get('_honey') || '').trim()) return;
    if (String(data.get('name')).trim().length < 2 || String(data.get('message')).trim().length < 10) {
      status.className = 'form-status error';
      status.textContent = 'Please include your name and a message of at least 10 characters.';
      return;
    }
    sending = true;
    button.disabled = true;
    buttonLabel.textContent = 'Sending…';
    form.setAttribute('aria-busy', 'true');
    status.className = 'form-status';
    status.textContent = 'Sending your message securely…';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const payload = Object.fromEntries(data.entries());
      payload.name = payload.name.trim();
      payload.email = payload.email.trim();
      payload.message = payload.message.trim();
      payload._subject = 'Portfolio · ' + payload.subject + ' · ' + payload.name;
      payload._replyto = payload.email;
      const response = await fetch('https://formsubmit.co/ajax/koushikbiswas2423@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      const result = await response.json();
      if (!response.ok || !(result.success === true || result.success === 'true')) throw new Error('Submission not accepted');
      const providerMessage = String(result.message || '');
      if (/activat|confirm|verify/i.test(providerMessage)) {
        status.className = 'form-status';
        status.textContent = 'Your message was received by the form service. Email delivery is awaiting inbox activation. You can also contact me directly at koushikbiswas2423@gmail.com.';
      } else {
        status.className = 'form-status success';
        status.textContent = 'Thanks! Your message has been submitted. I look forward to connecting with you.';
      }
      form.reset();
    } catch (error) {
      status.className = 'form-status error';
      status.textContent = error.name === 'AbortError'
        ? 'The request timed out. Your message is still here — please try again or email koushikbiswas2423@gmail.com directly.'
        : 'Your message could not be sent. Please try again or email koushikbiswas2423@gmail.com directly. Your message has been kept.';
    } finally {
      clearTimeout(timeout);
      sending = false;
      button.disabled = false;
      buttonLabel.textContent = 'Send message';
      form.removeAttribute('aria-busy');
    }
  });
})();