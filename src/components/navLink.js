export function initNavLink() {
    
    document.querySelectorAll('nav a').forEach(link => {
        if (link.href === window.location.href) {
            link.classList.remove('border-transparent', 'text-white/80');
            link.classList.add('border-red-600', 'text-white');
        }
    });
}