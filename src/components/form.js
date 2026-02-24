export function initForm(formId, successId) {
    
    const form = document.getElementById(formId);
    const success = document.getElementById(successId);

    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        console.log('Forma išsiųsta:', {
            email: form.email.value,
            tema: form.tema.value,
            zinute: form.zinute.value,
        });

        form.reset();
        success.classList.remove('hidden');
        setTimeout(() => success.classList.add('hidden'), 5000);
    });
}
