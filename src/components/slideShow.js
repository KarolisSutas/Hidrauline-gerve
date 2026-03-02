export function initSlideShow() {
    const container = document.querySelector('.slideshow-container');
    if (!container) return;

    const slides = Array.from(container.querySelectorAll('.mySlides'));
    const dots = Array.from(container.querySelectorAll('.carousel-dot'));
    const prevBtn = container.querySelector('.slide-prev');
    const nextBtn = container.querySelector('.slide-next');
    const total = slides.length;

    if (total === 0) return;

    let current = 0;
    let timerId = null;

    const INTERVAL = 5000; // kas 5 sekundes

    function render(index) {
        slides.forEach((slide, i) => {
            const active = i === index;

            // vizualinė būsena
            slide.classList.toggle('is-active', active);

            // accessibility
            slide.setAttribute('aria-hidden', active ? 'false' : 'true');

            // kad TAB nevaikščiotų per nematomas slides
            slide.setAttribute('tabindex', active ? '0' : '-1');
        });

        dots.forEach((dot, i) => {
            const active = i === index;

            dot.classList.toggle('is-active', active);

            // kuris dot aktyvus
            dot.setAttribute('aria-current', active ? 'true' : 'false');
        });
    }

    function wrapSlides(index) {
        if (index >= total) return 0;
        if (index < 0) return total - 1;
        return index;
    }

    function startTimer() {
        stopTimer();
        timerId = setInterval(() => {
            goTo(current + 1, { restart: false }); // intervalas pats save jau valdo
        }, INTERVAL);
    }

    function stopTimer() {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    }

    function goTo(index, { restart = true } = {}) {
        current = wrapSlides(index);
        render(current);
        if (restart) startTimer();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // ---- Event handlers (su nuorodomis, kad būtų galima destroy) ----
    const onPrevClick = () => prev();
    const onNextClick = () => next();

    const dotHandlers = dots.map((_, i) => () => goTo(i));

    const onKeyDown = (e) => {
        // jei yra input/textarea – nelendam (kad netrukdytų rašant)
        const tag = document.activeElement?.tagName?.toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;

        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    };

    // ---- Swipe (touch) ----
    let touchStartX = 0;
    let touchStartY = 0;
    let touching = false;

    const onTouchStart = (e) => {
        const t = e.changedTouches[0];
        touchStartX = t.clientX;
        touchStartY = t.clientY;
        touching = true;
    };

    const onTouchEnd = (e) => {
        if (!touching) return;
        touching = false;

        const t = e.changedTouches[0];
        const dx = t.clientX - touchStartX;
        const dy = t.clientY - touchStartY;

        // tik horizontalus swipe (ne scroll)
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            dx < 0 ? next() : prev();
        } else {
            // jei nebuvo swipe, timerio nereikia restartint
            // (palieku ramiai)
        }
    };

    // ---- Listeners ----
    prevBtn?.addEventListener('click', onPrevClick);
    nextBtn?.addEventListener('click', onNextClick);

    dots.forEach((dot, i) => dot.addEventListener('click', dotHandlers[i]));

    document.addEventListener('keydown', onKeyDown);

    container.addEventListener('touchstart', onTouchStart, { passive: true });
    container.addEventListener('touchend', onTouchEnd, { passive: true });

    // ---- Init ----
    render(0);
    startTimer();

    // ---- Optional: grąžinam destroy(), kad neliktų "prikabintų" listenerių ----
    return function destroy() {
        stopTimer();

        prevBtn?.removeEventListener('click', onPrevClick);
        nextBtn?.removeEventListener('click', onNextClick);

        dots.forEach((dot, i) => dot.removeEventListener('click', dotHandlers[i]));

        document.removeEventListener('keydown', onKeyDown);

        container.removeEventListener('touchstart', onTouchStart, { passive: true });
        container.removeEventListener('touchend', onTouchEnd, { passive: true });
    };
}