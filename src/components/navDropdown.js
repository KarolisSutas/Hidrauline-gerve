
export function initNavDropdown() {
    const link = document.getElementById('nav-dropdown-toggle');
    const arrowBtn = document.getElementById('nav-dropdown-arrow-btn');
    const mobileMenu = document.getElementById('nav-dropdown-mobile');
    const arrow = document.getElementById('nav-dropdown-arrow');

    if (!link || !mobileMenu || !arrowBtn) return;

    let isOpen = false;

    function isMobile() {
        return window.innerWidth < 768;
    }

    function openDropdown() {
        mobileMenu.classList.add('is-open');
        mobileMenu.classList.remove('hidden');
        arrow.classList.add('is-rotated');
        isOpen = true;
    }

    function closeDropdown() {
        mobileMenu.classList.remove('is-open');
        arrow.classList.remove('is-rotated');
        isOpen = false;
        setTimeout(() => {
            if (!isOpen) mobileMenu.classList.add('hidden');
        }, 300);
    }

    function toggleDropdown() {
        if (isOpen) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }

    // Arrow button: always toggles dropdown on mobile
    arrowBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isMobile()) return;
        toggleDropdown();
    });

    // "Produktai" link: first click opens dropdown, second click navigates
    link.addEventListener('click', (e) => {
        if (!isMobile()) return;

        if (!isOpen) {
            e.preventDefault();
            openDropdown();
        }
        // isOpen = true: don't preventDefault, navigates to /produktai.html
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!isMobile() || !isOpen) return;

        const dropdown = document.getElementById('nav-dropdown');
        if (!dropdown.contains(e.target)) {
            closeDropdown();
        }
    });

    // Reset state on resize
    window.addEventListener('resize', () => {
        if (!isMobile() && isOpen) {
            mobileMenu.classList.remove('is-open');
            mobileMenu.classList.add('hidden');
            arrow.classList.remove('is-rotated');
            isOpen = false;
        }
    });
}
