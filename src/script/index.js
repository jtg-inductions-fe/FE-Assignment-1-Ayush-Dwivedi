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
const logo = document.querySelector('.header__logo');
const focusableSelectors = 'a[href]:not([tabindex="-1"]):not([hidden])';

let isScrolled = false;
let firstFocusable = null;
let lastFocusable = null;

/**
 * Trap keyboard focus inside the mobile nav while it's open.
 */
function trapFocus(e) {
    if (e.key === 'Escape') {
        closeSidebar();
        toggleBtn.focus(); // Return focus to hamburger
        return;
    }
    if (e.key !== 'Tab') return;

    const focusableElements = Array.from(
        navList.querySelectorAll(focusableSelectors),
    ).filter((el) => el.offsetParent !== null);
    if (focusableElements.length === 0) return;
    firstFocusable = focusableElements[0];
    lastFocusable = focusableElements[focusableElements.length - 1];

    // Shift + Tab: backwards
    if (e.shiftKey && document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable.focus();
    }

    // Tab forward at end
    if (!e.shiftKey && document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable.focus();
    }
}

/**
 * Enable or disable focus trap based on nav state.
 */
function handleFocusTrap(enable) {
    if (enable) {
        document.addEventListener('keydown', trapFocus);
    } else {
        document.removeEventListener('keydown', trapFocus);
    }
}

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
    handleFocusTrap(false);
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

    const width = window.innerWidth;
    if (!expanded && width >= BREAKPOINT_MD && width < BREAKPOINT_LG) {
        // Temporarily skip logo from focus
        logo.setAttribute('tabindex', '-1');
    } else {
        // Restore normal tabbing to logo
        logo.removeAttribute('tabindex');
    }
    handleFocusTrap(!expanded);
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

/**
 * Initializes toggle functionality for collapsible footer groups.
 *
 * - Expands/collapses groups on user interaction.
 * - Updates `aria-expanded` for accessibility.
 * - Hides or reveals panels using the is-footer-group-open class.
 *
 * Assumes:
 * - Each group has `data-footer-group`
 * - Each toggle has `footer__group-toggle`
 * - Each panel has `footer__group-panel`
 */
function initFooterToggles() {
    const footerNav = document.querySelector('.footer__nav');

    if (!footerNav) return;

    footerNav.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('.footer__nav-group-toggle');

        if (!toggleBtn) return;

        const group = toggleBtn.closest('[data-footer-group]');
        const panel = group.querySelector('.footer__nav-group-panel');
        const arrow = toggleBtn.querySelector('.footer__nav-arrow');

        const isExpanded = panel.classList.contains('is-footer-group-open');

        toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
        panel.classList.toggle('is-footer-group-open', !isExpanded);
        panel.hidden = isExpanded;

        if (arrow) {
            arrow.classList.toggle('footer__nav-arrow--rotated', !isExpanded);
        }
    });
}

/**
 * Updates tab focus on footer headings depending on viewport size.
 * In desktop view, removes heading from tab flow.
 */
function updateFooterHeadingTabFocus() {
    const isTab = window.matchMedia(`(min-width: ${BREAKPOINT_MD}px)`).matches;
    const headings = document.querySelectorAll('.footer__nav-group-toggle');

    headings.forEach((heading) => {
        if (isTab) {
            heading.setAttribute('tabindex', '-1');
        } else {
            heading.removeAttribute('tabindex');
        }
    });
}

// Initial check
setMobileTabOrder();

// Re-check on resize
window.addEventListener('resize', () => {
    setMobileTabOrder();
    updateFooterHeadingTabFocus();
});

// Attach listener to the form
document
    .querySelector('#newsletter-form')
    .addEventListener('submit', handleNewsletterSubmit);

// Carousel
initCarousel();

// Footer toggle
initFooterToggles();

// Footer h3 tab focus remove in tab and desktop
updateFooterHeadingTabFocus();
