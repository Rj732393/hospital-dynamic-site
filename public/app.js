// ════ Gopal Hospital And Nature Care — Shared JS ════

document.addEventListener('DOMContentLoaded', function () {

  /* Header shadow on scroll */
  var header = document.getElementById('mainHeader');
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 10) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll);
  onScroll();

  /* Mobile hamburger menu */
  var hamburgerBtn = document.getElementById('hamburgerBtn');
  var hamburgerIcon = document.getElementById('hamburgerIcon');
  var mobileMenu = document.getElementById('mobileMenu');
  if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
      if (hamburgerIcon) {
        hamburgerIcon.textContent = mobileMenu.classList.contains('open') ? 'close' : 'menu';
      }
    });
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        mobileMenu.classList.remove('open');
        if (hamburgerIcon) hamburgerIcon.textContent = 'menu';
      });
    });
  }

  /* Reveal-on-scroll animation */
  var revealEls = document.querySelectorAll('.reveal, .reveal-group');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('active'); });
  }

  /* Programs page tabs */
  var tabBtns = document.querySelectorAll('.tab-btn');
  if (tabBtns.length) {
    tabBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tab = btn.getAttribute('data-tab');
        tabBtns.forEach(function (b) {
          b.classList.remove('active', 'border-primary', 'text-primary');
          b.classList.add('border-outline-variant', 'text-on-surface-variant');
        });
        btn.classList.add('active', 'border-primary', 'text-primary');
        btn.classList.remove('border-outline-variant', 'text-on-surface-variant');

        document.querySelectorAll('.tab-content').forEach(function (tc) {
          tc.classList.remove('active');
        });
        var target = document.getElementById('tab-' + tab);
        if (target) target.classList.add('active');
      });
    });
  }

  /* Generic toast helper, available globally */
  window.showToast = function (msg) {
    var toast = document.getElementById('toast');
    var toastMsg = document.getElementById('toastMsg');
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = msg || 'Done!';
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(function () {
      toast.classList.remove('show');
    }, 3000);
  };

  /* Appointment form (appointment.html) */
  var apptForm = document.getElementById('appointmentForm');
  if (apptForm) {
    apptForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('Appointment request received! We will call you shortly.');
      apptForm.reset();
    });
  }

  /* Contact form (contact.html) */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('Message sent! We will get back to you soon.');
      contactForm.reset();
    });
  }

});
