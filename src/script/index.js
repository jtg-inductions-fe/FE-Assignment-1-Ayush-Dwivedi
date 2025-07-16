import '../styles/main.scss';
import { initCarousel } from './carousel.js';

const BREAKPOINT_MD = 1024;
const BREAKPOINT_LG = 1440;

const toggleBtn = document.querySelector('.header__menu-toggle');
const navWrapper = document.querySelector('.header__nav'); // <nav>
const navList = document.getElementById('primary-navigation'); // <ul>

let isScrolled = false;

function closeSidebar() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    navList.hidden = true;
    navWrapper.classList.remove('is-open');
    toggleBtn.classList.remove('is-active');
    document.body.classList.remove('is-active');
}

toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !expanded);
    navList.hidden = expanded;
    navWrapper.classList.toggle('is-open');

    // ✅ Toggle rotation class on hamburger icon
    toggleBtn.classList.toggle('is-active');
    document.body.classList.toggle('is-active', !expanded);
});

// Click outside to close (for tab view only)
document.addEventListener('click', (e) => {
    const isClickInsideNav = navWrapper.contains(e.target);
    const isClickOnToggle = toggleBtn.contains(e.target);
    const isNavOpen = navWrapper.classList.contains('is-open');

    if (
        window.innerWidth < BREAKPOINT_LG && // Only apply on tab/mobile
        window.innerWidth >= BREAKPOINT_MD && // Only for tab, not mobile
        isNavOpen &&
        !isClickInsideNav &&
        !isClickOnToggle
    ) {
        closeSidebar();
    }
});

window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (!isScrolled && y > 100) {
        document.body.classList.add('scrolled');
        isScrolled = true;
    } else if (isScrolled && y < 50) {
        document.body.classList.remove('scrolled');
        isScrolled = false;
    }
});

function setMobileTabOrder() {
    const logo = document.querySelector('.header__logo');
    const toggle = document.querySelector('.header__menu-toggle');

    if (window.innerWidth < BREAKPOINT_MD) {
        // mobile & tablet
        logo.setAttribute('tabindex', '1');
        toggle.setAttribute('tabindex', '2');
    } else {
        // Let natural order work on desktop
        logo.removeAttribute('tabindex');
        toggle.removeAttribute('tabindex');
    }
}

// Initial check
setMobileTabOrder();

// Re-check on resize
window.addEventListener('resize', setMobileTabOrder);

// Carousel
initCarousel();
