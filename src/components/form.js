// ============================================
// Kontaktų formos frontend logika
// Honeypot + reCAPTCHA v3 + fetch() į backend
// ============================================

// reCAPTCHA v3 site key (pakeisk į savo!)
// Jei tuščias — reCAPTCHA bus praleista
const RECAPTCHA_SITE_KEY = '6LfbwYEsAAAAAEO62dcUHCCWWDCWdAV3cR6BJI_h';

/**
 * Gauti reCAPTCHA v3 token
 */
async function getRecaptchaToken() {
    if (!RECAPTCHA_SITE_KEY || typeof grecaptcha === 'undefined') {
        return '';
    }

    return new Promise((resolve) => {
        grecaptcha.ready(() => {
            grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'contact' })
                .then(resolve)
                .catch(() => resolve(''));
        });
    });
}

/**
 * Inicializuoti formą
 * @param {string} formId - formos HTML id
 * @param {string} successId - sėkmės pranešimo HTML id
 * @param {string} errorId - klaidos pranešimo HTML id
 */
export function initForm(formId, successId, errorId) {
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);
    const error = document.getElementById(errorId);

    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

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
            // Gauti reCAPTCHA token
            const recaptchaToken = await getRecaptchaToken();

            // Surinkti duomenis
            const formData = new FormData(form);
            const data = {
                vardas: formData.get('vardas'),
                telefonas: formData.get('telefonas'),
                email: formData.get('email'),
                tema: formData.get('tema'),
                zinute: formData.get('zinute'),
                website: formData.get('website'), // honeypot
                recaptchaToken,
            };

            // Siųsti į backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                // Sėkmė
                form.reset();
                success?.classList.remove('hidden');
                setTimeout(() => success?.classList.add('hidden'), 8000);
            } else {
                // Serveris grąžino klaidą
                showError(error, result.message || 'Nepavyko išsiųsti. Pabandykite vėliau.');
            }

        } catch (err) {
            // Tinklo klaida
            console.error('Formos klaida:', err);
            showError(error, 'Ryšio klaida. Patikrinkite internetą arba susisiekite telefonu.');
        } finally {
            // Grąžinti mygtuką
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

