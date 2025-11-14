/* Year in footer */
document.getElementById('year').textContent = new Date().getFullYear();

/* Mobile nav toggle */
const navToggle = document.getElementById('navToggle');
const navList = document.getElementById('navList');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    navList.classList.toggle('open');
  });
  // Close nav on link click (mobile)
  navList.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navList.classList.remove('open'));
  });
}

/* Reveal on scroll */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  },
  { threshold: 0.12 }
);
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* Magnetic buttons */
document.querySelectorAll('.magnetic').forEach((btn) => {
  const strength = 14;
  const reset = () => { btn.style.transform = 'translate3d(0,0,0)'; };
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate3d(${(x / rect.width) * strength}px, ${(y / rect.height) * strength}px, 0)`;
  });
  btn.addEventListener('mouseleave', reset);
});

/* Tilt effect on project cards */
document.querySelectorAll('.project-card').forEach((card) => {
  const damp = 20;
  const reset = () => {
    card.style.transform = 'translateY(0) rotateX(0) rotateY(0)';
  };
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -damp;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * damp;
    card.style.transform = `translateY(-2px) rotateX(${rx}deg) rotateY(${ry}deg)`;
  });
  card.addEventListener('mouseleave', reset);
});

/* Smooth scroll for internal links with minor offset consideration */
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight + 4;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});