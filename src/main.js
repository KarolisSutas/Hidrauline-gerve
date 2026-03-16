import './main.css';

import { initCountUp } from './components/countUp';
import { initGallery } from './components/gallery';
import { initSlideShow } from './components/slideShow';
import { initDrawer } from './components/drawer';
import { initNavDropdown } from './components/navDropdown';
import { initForm } from './components/form';
import { initCardScrollAnimation } from './components/cardScrollAnimation';
import { initNavLink } from './components/navLink';

// Navbar mobile collapse (replaces Flowbite)
function initNavCollapse() {
    const btn = document.querySelector('[aria-controls="navbar-default"]');
    const nav = document.getElementById('navbar-default');
    if (!btn || !nav) return;

    btn.addEventListener('click', () => {
        const isOpen = !nav.classList.contains('hidden');
        nav.classList.toggle('hidden', isOpen);
        btn.setAttribute('aria-expanded', String(!isOpen));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initNavCollapse();
    initCountUp();
    initGallery();
    initSlideShow();
    initDrawer();
    initNavDropdown();
    initForm('contact-form', 'form-success', 'form-error');
    initForm('contact-page-form', 'page-form-success', 'page-form-error')
    initCardScrollAnimation();
    initNavLink();
    
});

// FAQ akordeonas
document.querySelectorAll('.faq-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
        const answer = btn.nextElementSibling;
        const icon = btn.querySelector('.faq-icon');
        const isOpen = !answer.classList.contains('hidden');

        answer.classList.toggle('hidden', isOpen);
        icon.classList.toggle('rotate-180', !isOpen);
        btn.setAttribute('aria-expanded', !isOpen);
    });
});