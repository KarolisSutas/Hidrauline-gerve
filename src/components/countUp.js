
export function initCountUp() {
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const valueElements = entry.target.querySelectorAll('.spec-value');

            valueElements.forEach(elem => {
                const target = parseFloat(elem.dataset.target);
                animateValue(elem, 0, target, 1500);
            });

            observer.unobserve(entry.target);
        });
    }, observerOptions);

    const specsGrid = document.querySelector('.specs-grid');
    if (specsGrid) observer.observe(specsGrid);
}

function animateValue(elem, start, end, duration) {
    const isDecimal = end % 1 !== 0;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = start + (end - start) * easeOutQuart;

        elem.textContent = isDecimal
            ? current.toFixed(1)
            : Math.floor(current);

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            elem.textContent = isDecimal
                ? end.toFixed(1)
                : end;
        }
    }

    requestAnimationFrame(update);
}
