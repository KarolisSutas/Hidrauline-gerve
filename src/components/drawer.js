let recaptchaLoaded = false;

function loadRecaptcha() {
    if (recaptchaLoaded) return;
    recaptchaLoaded = true;

    const script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/enterprise.js?render=6LfbwYEsAAAAAEO62dcUHCCWWDCWdAV3cR6BJI_h';
    document.head.appendChild(script);
}

export function initDrawer() {
    const drawer   = document.getElementById('contact-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close');

    if (!drawer) return;

    const triggers = document.querySelectorAll('[data-open-drawer]');
    const navbar    = document.getElementById('navbar-default');
    const burgerBtn = document.querySelector('[data-collapse-toggle="navbar-default"]');

    function openDrawer() {
        loadRecaptcha();

        if (navbar && !navbar.classList.contains('hidden')) {
            navbar.classList.add('hidden');
            if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
        }

        drawer.removeAttribute('inert');
        drawer.classList.remove('translate-x-full');

        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');

        document.body.style.overflow = 'hidden';
        closeBtn.focus();
    }

    function closeDrawer() {
        drawer.classList.add('translate-x-full');

        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0', 'pointer-events-none');

        document.body.style.overflow = '';

        const lastTrigger = document.activeElement?._drawerTrigger;
        if (lastTrigger) lastTrigger.focus();

        drawer.addEventListener('transitionend', () => {
            drawer.setAttribute('inert', '');
        }, { once: true });
    }

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            closeBtn._drawerTrigger = trigger;
            openDrawer();
        });
    });

    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !drawer.classList.contains('translate-x-full')) {
            closeDrawer();
        }
    });
}