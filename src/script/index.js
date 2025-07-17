import '../styles/main.scss';
import { initCarousel } from './carousel.js';

const BREAKPOINT_MD = 1024;
const BREAKPOINT_LG = 1440;
const SCROLL_THRESHOLD_DOWN = 100;
const SCROLL_THRESHOLD_UP = 50;

const toggleBtn = document.querySelector('.header__menu-toggle');
const navWrapper = document.querySelector('.header__nav'); // <nav>
const navList = document.getElementById('primary-navigation'); // <ul>
const desktopMediaQuery = window.matchMedia(`(min-width: ${BREAKPOINT_LG}px)`);

let isScrolled = false;

/**
 * Close the mobile/tablet sidebar navigation.
 * Resets ARIA attributes and removes open-related classes.
 */
function closeSidebar() {
    toggleBtn.setAttribute('aria-expanded', 'false');
    navList.hidden = true;
    navWrapper.classList.remove('is-nav-open');
    toggleBtn.classList.remove('is-nav-open');
    document.body.classList.remove('is-nav-open');
}

/**
 * Automatically close sidebar when switching to desktop view.
 */
desktopMediaQuery.addEventListener('change', closeSidebar);

/**
 * Toggle sidebar visibility on hamburger button click.
 * Updates ARIA state and adds/removes necessary classes.
 */
toggleBtn.addEventListener('click', () => {
    const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', !expanded);
    navList.hidden = expanded;
    navWrapper.classList.toggle('is-nav-open');

    // ✅ Toggle rotation class on hamburger icon
    toggleBtn.classList.toggle('is-nav-open');
    document.body.classList.toggle('is-nav-open', !expanded);
});

/**
 * Close sidebar when clicking outside it.
 */
document.addEventListener('click', (e) => {
    const isClickInsideNav = navWrapper.contains(e.target);
    const isClickOnToggle = toggleBtn.contains(e.target);
    const isNavOpen = navWrapper.classList.contains('is-nav-open');

    if (isNavOpen && !isClickInsideNav && !isClickOnToggle) {
        closeSidebar();
    }
});

/**
 * Adjust header scroll behavior:
 * - Adds `.scrolled` class after scrolling 100px
 * - Removes it if scrolling back near the top
 */
window.addEventListener('scroll', () => {
    const y = window.scrollY;

    if (!isScrolled && y > SCROLL_THRESHOLD_DOWN) {
        document.body.classList.add('scrolled');
        isScrolled = true;
    } else if (isScrolled && y < SCROLL_THRESHOLD_UP) {
        document.body.classList.remove('scrolled');
        isScrolled = false;
    }
});

/**
 * Set explicit tab order for mobile accessibility.
 * Applies tabindex values only below BREAKPOINT_MD.
 */
function setMobileTabOrder() {
    const logo = document.querySelector('.header__logo');
    const toggle = document.querySelector('.header__menu-toggle');

    if (window.innerWidth < BREAKPOINT_MD) {
        // mobile
        logo.setAttribute('tabindex', '1');
        toggle.setAttribute('tabindex', '2');
    } else {
        // Let natural order work on desktop and tab
        logo.removeAttribute('tabindex');
        toggle.removeAttribute('tabindex');
    }
}

/**
 * Handles newsletter form submission.
 * Shows an alert with the entered email address.
 *
 * @param {Event} event - The submit event.
 */
function handleNewsletterSubmit(event) {
    event.preventDefault();

    const emailInput = document.querySelector('#newsletter-email');
    const email = emailInput?.value.trim();

    if (email) {
        alert(`Thank you for subscribing with: ${email}`);
        event.target.reset();
    }
}

// Attach listener to the form
document
    .querySelector('#newsletter-form')
    .addEventListener('submit', handleNewsletterSubmit);

// Initial check
setMobileTabOrder();

// Re-check on resize
window.addEventListener('resize', setMobileTabOrder);

// Carousel
initCarousel();
