// ============================================
// Kontaktų formos frontend logika
// Honeypot + reCAPTCHA v3 + fetch() į backend
// ============================================

const RECAPTCHA_SITE_KEY = '6LfbwYEsAAAAAEO62dcUHCCWWDCWdAV3cR6BJI_h';

/**
 * Lazy load reCAPTCHA – kraunama tik kai vartotojas fokusuoja formą
 */
export function lazyLoadRecaptcha(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    let loaded = false;
    form.addEventListener('focusin', () => {
        if (loaded) return;
        loaded = true;
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/enterprise.js?render=${RECAPTCHA_SITE_KEY}`;
        document.head.appendChild(script);
    }, { once: true });
}

/**
 * Gauti reCAPTCHA v3 token
 */
async function getRecaptchaToken() {
    if (!RECAPTCHA_SITE_KEY || typeof grecaptcha === 'undefined' || !grecaptcha?.enterprise?.ready) {
        console.warn('reCAPTCHA dar neužsikrovė');
        return '';
    }

    return new Promise((resolve) => {
        grecaptcha.enterprise.ready(() => {
            grecaptcha.enterprise.execute(RECAPTCHA_SITE_KEY, { action: 'contact' })
                .then(resolve)
                .catch(() => resolve(''));
        });
    });
}

/**
 * Inicializuoti formą
 */
export function initForm(formId, successId, errorId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    const error = document.getElementById(errorId);

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Patikrinti ar reCAPTCHA užsikrovė
        if (typeof grecaptcha === 'undefined' || !grecaptcha?.enterprise) {
            showError(error, 'Apsaugos patikra dar kraunasi. Palaukite kelias sekundes ir bandykite dar kartą.');
            return;
        }

        // Validacija
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // UI: loading būsena
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25"/>
                <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75"/>
            </svg>
            Siunčiama...
        `;

        // Paslėpti ankstesnius pranešimus
        success?.classList.add('hidden');
        error?.classList.add('hidden');

        try {
            const recaptchaToken = await getRecaptchaToken();

            const formData = new FormData(form);
            const data = {
                vardas: formData.get('vardas'),
                telefonas: formData.get('telefonas'),
                email: formData.get('email'),
                tema: formData.get('tema'),
                zinute: formData.get('zinute'),
                website: formData.get('website'),
                recaptchaToken,
            };

            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                form.reset();
                success?.classList.remove('hidden');
                setTimeout(() => success?.classList.add('hidden'), 8000);
            } else {
                let message = result.message || 'Nepavyko išsiųsti. Pabandykite vėliau.';

                if (result.code === 'recaptcha_missing' || result.code === 'recaptcha_failed') {
                    message += ' Arba rašykite tiesiogiai: info@aukstaitijosvilktis.lt';
                }

                showError(error, message);
            }

        } catch (err) {
            console.error('Formos klaida:', err);
            showError(error, 'Ryšio klaida. Patikrinkite internetą arba susisiekite telefonu.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
        }
    });
}

function showError(errorEl, message) {
    if (!errorEl) return;
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
    setTimeout(() => errorEl.classList.add('hidden'), 8000);
}