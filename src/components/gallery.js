export function initGallery() {
    const section = document.querySelector('.gallery-section');
    if (!section) return;

    const mainBtn = section.querySelector('.gallery-main');
    const mainImg = section.querySelector('.gallery-main-img');

    const strip = section.querySelector('.gallery-strip');
    const thumbs = Array.from(section.querySelectorAll('.gallery-thumb'));

    const prev = section.querySelector('.gallery-prev');
    const next = section.querySelector('.gallery-next');

    const modal = section.querySelector('.gallery-modal');
    const modalImg = section.querySelector('.gallery-modal-img');
    const modalCaption = section.querySelector('.gallery-modal-caption');
    const modalPrev = section.querySelector('.gallery-modal-arrow.left');
    const modalNext = section.querySelector('.gallery-modal-arrow.right');

    let activeIndex = Math.max(0, thumbs.findIndex(t => t.classList.contains('is-active')));

    function setActive(index, { scrollThumb = true } = {}) {
        activeIndex = (index + thumbs.length) % thumbs.length;

        thumbs.forEach(t => t.classList.remove('is-active'));
        const active = thumbs[activeIndex];
        active.classList.add('is-active');

        const fullSrc = active.dataset.full || active.src;
        mainImg.src = fullSrc;
        mainImg.alt = active.alt || 'Galerijos nuotrauka';

        if (scrollThumb) {
            active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        }
    }

    function openModal() {
        const active = thumbs[activeIndex];
        const fullSrc = active.dataset.full || active.src;

        modalImg.src = fullSrc;
        modalImg.alt = active.alt || 'Galerijos nuotrauka';
        modalCaption.textContent = active.alt || '';

        modal.classList.add('is-open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    // Thumbnail click -> main
    thumbs.forEach((thumb, idx) => {
        thumb.addEventListener('click', () => setActive(idx));
    });

    // Strip arrows
    prev?.addEventListener('click', () => {
        strip.scrollBy({ left: -320, behavior: 'smooth' });
    });
    next?.addEventListener('click', () => {
        strip.scrollBy({ left: 320, behavior: 'smooth' });
    });

    // Main click -> modal
    mainBtn?.addEventListener('click', openModal);

    // Modal close
    modal.addEventListener('click', (e) => {
        const el = e.target;
        if (el?.dataset?.close === 'true') closeModal();
    });

    // Modal arrows
    modalPrev.addEventListener('click', () => {
        setActive(activeIndex - 1);
        openModal(); // atnaujina vaizdą modale
    });

    modalNext.addEventListener('click', () => {
        setActive(activeIndex + 1);
        openModal();
    });

    // Keyboard
    window.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('is-open')) return;

        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') { setActive(activeIndex - 1); openModal(); }
        if (e.key === 'ArrowRight') { setActive(activeIndex + 1); openModal(); }
    });

    // Init (užfiksuoja pradinį aktyvų thumb)
    if (thumbs.length) setActive(activeIndex, { scrollThumb: false });
}
