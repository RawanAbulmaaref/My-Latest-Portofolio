/**
 * Rawan Abulmaaref - Personal Portfolio JavaScript
 * Modern Vanilla ES6+ implementation
 * Features:
 * - Theme Switcher (Dark/Light) with localStorage persistence
 * - Interactive Space Starfield Particle Canvas
 * - Sticky Header with Scrollspy & Smooth Scrolling
 * - Responsive Mobile Navigation Drawer
 * - Testimonials Slider with Dots & Controls
 * - Scroll Reveal Animations via IntersectionObserver
 * - Floating Back to Top Button
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ==========================================================================
     1. Theme Switcher (Dark Mode / Light Mode)
     ========================================================================== */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlElement = document.documentElement;

  // Check saved theme in localStorage or default to 'dark' (Space theme)
  const savedTheme = localStorage.getItem('rawan_portfolio_theme') || 'dark';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('rawan_portfolio_theme', theme);

    if (themeIcon) {
      if (theme === 'light') {
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeToggleBtn.setAttribute('title', 'Switch to Dark Mode');
      } else {
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeToggleBtn.setAttribute('title', 'Switch to Light Mode');
      }
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  /* ==========================================================================
     2. Interactive Space Starfield Canvas
     ========================================================================== */
  const canvas = document.getElementById('space-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = 0;
    let height = 0;
    let stars = [];
    let animationFrameId = null;

    // Star configuration
    const STAR_COUNT = 90;
    const colorsDark = ['#FFFFFF', '#A78BFA', '#60A5FA', '#38BDF8', '#E0E7FF'];
    const colorsLight = ['#6366F1', '#818CF8', '#0284C7', '#A5B4FC'];

    class Star {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.radius = Math.random() * 1.6 + 0.4;
        this.baseAlpha = Math.random() * 0.7 + 0.3;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
        this.twinkleDirection = Math.random() > 0.5 ? 1 : -1;
        this.vx = (Math.random() - 0.5) * 0.2;
        this.vy = -(Math.random() * 0.25 + 0.05); // Gentle upward drift
      }

      update() {
        // Twinkle effect
        this.alpha += this.twinkleSpeed * this.twinkleDirection;
        if (this.alpha > 0.95) {
          this.alpha = 0.95;
          this.twinkleDirection = -1;
        } else if (this.alpha < 0.15) {
          this.alpha = 0.15;
          this.twinkleDirection = 1;
        }

        // Float movement
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around boundaries
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
      }

      draw(isLight) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        
        const colorPalette = isLight ? colorsLight : colorsDark;
        const colorIndex = Math.floor(this.x % colorPalette.length);
        ctx.fillStyle = colorPalette[colorIndex];
        ctx.globalAlpha = isLight ? this.alpha * 0.45 : this.alpha;
        ctx.shadowBlur = isLight ? 2 : (this.radius > 1.2 ? 6 : 0);
        ctx.shadowColor = isLight ? '#818CF8' : '#7C5CFC';
        ctx.fill();
        ctx.restore();
      }
    }

    function initCanvas() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      stars = [];
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
      }
    }

    function animateStars() {
      const isLight = htmlElement.getAttribute('data-theme') === 'light';
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < stars.length; i++) {
        stars[i].update();
        stars[i].draw(isLight);
      }

      animationFrameId = requestAnimationFrame(animateStars);
    }

    window.addEventListener('resize', () => {
      cancelAnimationFrame(animationFrameId);
      initCanvas();
      animateStars();
    });

    initCanvas();
    animateStars();
  }

  /* ==========================================================================
     3. Header Scrolled State & Active Scrollspy
     ========================================================================== */
  const header = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav__link');

  function handleScroll() {
    const scrollY = window.scrollY;

    // Header blurred background on scroll
    if (header) {
      if (scrollY > 40) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }
    }

    // Back to top button visibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
      if (scrollY > 350) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }

    // Scrollspy active section highlighting
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    if (currentSectionId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });

      mobileNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSectionId}`) {
          link.classList.add('active');
        }
      });
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  /* ==========================================================================
     4. Mobile Navigation Drawer
     ========================================================================== */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileNav = document.getElementById('mobile-nav');

  function toggleMobileMenu() {
    const isOpen = mobileNav.classList.contains('is-open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    mobileNav.classList.add('is-open');
    hamburgerBtn.classList.add('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent page scroll
  }

  function closeMobileMenu() {
    mobileNav.classList.remove('is-open');
    hamburgerBtn.classList.remove('is-active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleMobileMenu);
  }

  // Close mobile drawer when clicking any nav link
  mobileNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // Close when clicking outside of mobile nav
  document.addEventListener('click', (e) => {
    if (
      mobileNav &&
      mobileNav.classList.contains('is-open') &&
      !mobileNav.contains(e.target) &&
      !hamburgerBtn.contains(e.target)
    ) {
      closeMobileMenu();
    }
  });

  /* ==========================================================================
     5. Testimonial Slider
     ========================================================================== */
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.testimonial-dots .dot');
  const prevBtn = document.getElementById('prev-testimonial');
  const nextBtn = document.getElementById('next-testimonial');
  let currentSlideIndex = 0;
  let autoSlideTimer = null;

  function showSlide(index) {
    if (!slides.length) return;

    if (index >= slides.length) {
      currentSlideIndex = 0;
    } else if (index < 0) {
      currentSlideIndex = slides.length - 1;
    } else {
      currentSlideIndex = index;
    }

    slides.forEach((slide, idx) => {
      if (idx === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, idx) => {
      if (idx === currentSlideIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  }

  function startAutoSlide() {
    stopAutoSlide();
    autoSlideTimer = setInterval(() => {
      showSlide(currentSlideIndex + 1);
    }, 6000);
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlideIndex + 1);
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlideIndex - 1);
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const targetIndex = parseInt(e.currentTarget.getAttribute('data-slide'), 10);
      if (!isNaN(targetIndex)) {
        showSlide(targetIndex);
        startAutoSlide();
      }
    });
  });

  // Pause on hover
  const sliderContainer = document.getElementById('testimonial-slider');
  if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
  }

  showSlide(0);
  startAutoSlide();

  /* ==========================================================================
     6. Back to Top Button
     ========================================================================== */
  const backToTopBtn = document.getElementById('back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ==========================================================================
     7. Scroll Reveal Animations (IntersectionObserver)
     ========================================================================== */
  const revealElements = document.querySelectorAll(
    '.stat-card, .education-card, .timeline__item, .skill-category, .project-card, .service-card, .contact-card'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  /* ==========================================================================
     8. Hero Typewriter Animation
     ========================================================================== */
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const roleText = 'Full-Stack .NET Developer';
    let charIndex = 0;
    let isDeleting = false;
    const typingSpeed = 95;
    const deletingSpeed = 45;
    const pauseBeforeDelete = 2200;
    const pauseBeforeType = 550;

    // Clear initial fallback text for typing animation
    typewriterElement.textContent = '';

    function typeLoop() {
      if (!isDeleting) {
        // Typing phase
        typewriterElement.textContent = roleText.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === roleText.length) {
          // Finished typing word, pause then delete
          isDeleting = true;
          setTimeout(typeLoop, pauseBeforeDelete);
          return;
        }
        setTimeout(typeLoop, typingSpeed);
      } else {
        // Deleting phase
        typewriterElement.textContent = roleText.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          // Finished deleting, pause then type again
          isDeleting = false;
          setTimeout(typeLoop, pauseBeforeType);
          return;
        }
        setTimeout(typeLoop, deletingSpeed);
      }
    }

    // Start typing after initial smooth delay
    setTimeout(typeLoop, 400);
  }
});
