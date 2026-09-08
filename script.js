/* ===========================================
   HUEVO HOUSE — INTERACTIONS
   Transparent WebM plays directly — no hacks needed.
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initScrollReveal();
  initEggAutoPlay();
  initScrollNav();
  initCtaAnimation();
});

/* --- MOBILE NAV --- */
function initMobileNav() {
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!toggle || !mobileNav) return;

  toggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', isOpen);
    mobileNav.setAttribute('aria-hidden', !isOpen);
  });

  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
}

/* --- SCROLL REVEAL --- */
function initScrollReveal() {
  const els = document.querySelectorAll(
    '.menu-card, .location-card, .stat-card, .contact-form, .contact-info, .order-card'
  );
  els.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
}

/* --- SCROLL NAV — slides initial header up, reveals scrolled header --- */
function initScrollNav() {
  const header = document.getElementById('site-header');
  const initial = header?.querySelector('.header-initial');
  if (!header || !initial) return;

  /* Measure initial header height and set as CSS var for the slide distance */
  function measureHeader() {
    const h = initial.offsetHeight;
    header.style.setProperty('--initial-h', `-${h}px`);
  }
  measureHeader();
  window.addEventListener('resize', measureHeader);

  let ticking = false;
  const threshold = 5;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        if (window.scrollY > threshold) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
        ticking = false;
      });
      ticking = true;
    }
  });
}

/* --- EGG AUTO-PLAY --- */
function initEggAutoPlay() {
  const video = document.querySelector('.egg-video');
  if (!video) return;

  video.playbackRate = 1.8;
  video.play().catch(() => {
    const playOnInteract = () => {
      video.play();
      document.removeEventListener('click', playOnInteract);
      document.removeEventListener('touchstart', playOnInteract);
    };
    document.addEventListener('click', playOnInteract);
    document.addEventListener('touchstart', playOnInteract);
  });
}

/* --- CTA ANGRY BIRDS ANIMATION --- */
function initCtaAnimation() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  const section = document.getElementById('cta-section');
  if (!section) return;

  document.querySelectorAll('.cta-scene').forEach(scene => {
    const bacon = scene.querySelector('.cta-bacon');
    const stack = scene.querySelector('.cta-egg-stack');
    const splats = scene.querySelectorAll('.cta-egg-splat');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        toggleActions: 'play none none reset'
      }
    });

    /* Egg stack wobbles in */
    tl.from(stack, {
      y: 60,
      opacity: 0,
      duration: 0.4,
      ease: 'back.out(1.7)'
    });

    /* Small anticipation wobble */
    tl.to(stack, {
      rotation: -3,
      duration: 0.15,
      ease: 'power1.inOut',
      yoyo: true,
      repeat: 1
    });

    /* Bacon strip flies in like a projectile */
    tl.to(bacon, {
      opacity: 1,
      x: 180,
      rotation: 45,
      duration: 0.35,
      ease: 'power3.in'
    });

    /* IMPACT — stack explodes */
    tl.to(stack, {
      rotation: 25,
      y: 80,
      x: 30,
      opacity: 0,
      scale: 0.5,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.05');

    /* Bacon continues through */
    tl.to(bacon, {
      x: 250,
      y: -30,
      rotation: 90,
      opacity: 0,
      duration: 0.3,
      ease: 'power1.out'
    }, '-=0.3');

    /* Splattered eggs appear */
    splats.forEach((splat, i) => {
      tl.to(splat, {
        opacity: 1,
        y: gsap.utils.random(-20, 10),
        x: gsap.utils.random(-30, 30),
        rotation: gsap.utils.random(-45, 45),
        scale: gsap.utils.random(0.8, 1.2),
        duration: 0.3,
        ease: 'back.out(2)'
      }, '-=0.25');
    });

    /* Splats settle with a little bounce */
    tl.to(splats, {
      y: '+=5',
      duration: 0.2,
      ease: 'bounce.out',
      stagger: 0.05
    });
  });
}
