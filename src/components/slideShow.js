export function initSlideShow() {
    const container = document.querySelector('.slideshow-container');
    if (!container) return;

    const slides = container.querySelectorAll('.mySlides');
    const dots = document.querySelectorAll('.carousel-dot');
    const prevBtn = container.querySelector('.slide-prev');
    const nextBtn = container.querySelector('.slide-next');
    const total = slides.length;

    if (total === 0) return;

    let current = 0;
    let timer = null;
    let paused = false;
    const INTERVAL = 36000;
    const RESUME_DELAY = 36000;

    // ——— Core ———

    function goTo(index) {
        if (index >= total) index = 0;
        if (index < 0) index = total - 1;

        slides.forEach((slide, i) => {
            slide.classList.toggle('is-active', i === index);
        });

        dots.forEach((dot, i) => {
            dot.classList.toggle('is-active', i === index);
        });

        current = index;
        restartTimer();
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // ——— Auto-play ———

    function restartTimer() {
        clearInterval(timer);
        if (!paused) {
            timer = setInterval(() => goTo(current + 1), INTERVAL);
        }
    }

    function pause() {
        paused = true;
        clearInterval(timer);
    }

    function resume() {
        paused = false;
        clearInterval(timer);
        timer = setInterval(() => goTo(current + 1), RESUME_DELAY);
        // po pirmo tick grįžtam prie normalaus intervalo
        setTimeout(() => {
            if (!paused) restartTimer();
        }, RESUME_DELAY);
    }

    // ——— Event listeners ———

    prevBtn?.addEventListener('click', prev);
    nextBtn?.addEventListener('click', next);

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goTo(i));
    });

    // pries builda nuimti!!!
    container.addEventListener('mouseenter', pause);
    container.addEventListener('mouseleave', resume);

    // ——— Keyboard ———

    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    // ——— Swipe (touch) ———

    let touchStartX = 0;
    let touchStartY = 0;
    let isSwiping = false;

    container.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
        touchStartY = e.changedTouches[0].clientY;
        isSwiping = true;
        pause();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        isSwiping = false;

        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;

        // tik horizontalus swipe (ne scroll)
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
            dx < 0 ? next() : prev();
        }

        resume();
    }, { passive: true });

    // ——— Init ———

    goTo(0);
}
