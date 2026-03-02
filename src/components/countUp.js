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
                const raw = elem.dataset.target;

                // Jei reikšmė yra diapazonas (pvz. "60-120"), animuojam iki galutinio skaičiaus
                if (raw && raw.includes('-')) {
                    const parts = raw.split('-');
                    const endVal = parseFloat(parts[parts.length - 1]);
                    const startVal = parseFloat(parts[0]);
                    animateRange(elem, startVal, endVal, raw, 1500);
                } else {
                    const target = parseFloat(raw);
                    animateValue(elem, 0, target, 1500);
                }
            });

            observer.unobserve(entry.target);
        });
    }, observerOptions);

    const specsGrid = document.querySelector('.specs-grid');
    if (specsGrid) observer.observe(specsGrid);
}

function animateRange(elem, start, end, finalText, duration) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        const currentEnd = Math.floor(start + (end - start) * easeOutQuart);

        // Rodome "X-currentEnd" kol animacija eina
        elem.textContent = `${start}-${currentEnd}`;

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            elem.textContent = finalText;
        }
    }

    requestAnimationFrame(update);
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