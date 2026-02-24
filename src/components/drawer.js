
export function initDrawer() {
    const drawer   = document.getElementById('contact-drawer');
    const backdrop = document.getElementById('drawer-backdrop');
    const closeBtn = document.getElementById('drawer-close');

    if (!drawer) return;

    // Visi mygtukai/nuorodos, kurie atidaro drawer
    const triggers = document.querySelectorAll('[data-open-drawer]');

    // Navbar (burger menu) – uždarysime kai atidaromas drawer
    const navbar    = document.getElementById('navbar-default');
    const burgerBtn = document.querySelector('[data-collapse-toggle="navbar-default"]');

    function openDrawer() {
        // Uždaryti burger menu jei atidarytas (mobiliuose)
        if (navbar && !navbar.classList.contains('hidden')) {
            navbar.classList.add('hidden');
            if (burgerBtn) burgerBtn.setAttribute('aria-expanded', 'false');
        }

        drawer.removeAttribute('inert');
        drawer.classList.remove('translate-x-full');

        backdrop.classList.remove('opacity-0', 'pointer-events-none');
        backdrop.classList.add('opacity-100');

        document.body.style.overflow = 'hidden';

        // Fokusas ant uždarymo mygtuko
        closeBtn.focus();
    }

    function closeDrawer() {
        drawer.classList.add('translate-x-full');

        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0', 'pointer-events-none');

        document.body.style.overflow = '';

        // Grąžinti fokusą prie trigger mygtuko (jei yra)
        const lastTrigger = document.activeElement?._drawerTrigger;
        if (lastTrigger) lastTrigger.focus();

        // inert grąžiname po animacijos pabaigos
        drawer.addEventListener('transitionend', () => {
            drawer.setAttribute('inert', '');
        }, { once: true });
    }

    // Eventai
    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            closeBtn._drawerTrigger = trigger; // išsaugom šaltinį fokusui
            openDrawer();
        });
    });

    closeBtn.addEventListener('click', closeDrawer);

    backdrop.addEventListener('click', closeDrawer);

    // Uždaryti per Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !drawer.classList.contains('translate-x-full')) {
            closeDrawer();
        }
    });
}
