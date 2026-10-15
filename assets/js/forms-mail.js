/**
 * Envoi AJAX des formulaires contact / devis (API fm-k4n8 + captcha cp-x7m2).
 */
(function () {
    'use strict';

    function apiBase() {
        return window.location.pathname.includes('/pages/') ? '../api/' : 'api/';
    }

    /**
     * Retire balises HTML et motifs script courants avant envoi (couche client).
     */
    function sanitizeField(value, singleLine) {
        if (typeof value !== 'string') {
            return '';
        }
        var cleaned = value.trim()
            .replace(/\0/g, '')
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<[^>]+>/g, '');
        cleaned = cleaned.replace(/javascript\s*:/gi, '').replace(/on\w+\s*=/gi, '');
        if (singleLine) {
            cleaned = cleaned.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();
        }
        return cleaned;
    }

    function showFormMessage(form, text, isError) {
        var box = form.querySelector('.form-feedback');
        if (!box) {
            box = document.createElement('div');
            box.className = 'form-feedback';
            form.appendChild(box);
        }
        box.classList.toggle('form-feedback-error', !!isError);
        box.classList.toggle('form-feedback-success', !isError);
        box.textContent = text;
        box.setAttribute('role', 'alert');
    }

    function loadCaptcha(form) {
        var questionEl = form.querySelector('.captcha-question');
        var tokenEl = form.querySelector('[name="captcha_token"]');
        var answerEl = form.querySelector('[name="captcha_answer"]');
        if (!questionEl || !tokenEl) {
            return Promise.resolve();
        }

        questionEl.textContent = 'Chargement…';

        return fetch(apiBase() + 'cp-x7m2.php', { credentials: 'same-origin', cache: 'no-store' })
            .then(function (res) {
                return res.json();
            })
            .then(function (data) {
                if (!data.ok) {
                    throw new Error(data.error || 'Captcha');
                }
                questionEl.textContent = 'Combien font ' + data.question + ' ?';
                tokenEl.value = data.token;
                if (answerEl) {
                    answerEl.value = '';
                }
            })
            .catch(function () {
                questionEl.textContent = 'Captcha indisponible. Rechargez la page.';
            });
    }

    function readContactFields(form) {
        return {
            nom: sanitizeField(form.querySelector('[name="nom"]')?.value || '', true),
            prenom: sanitizeField(form.querySelector('[name="prenom"]')?.value || '', true),
            email: sanitizeField(form.querySelector('[name="email"]')?.value || '', true),
            telephone: sanitizeField(form.querySelector('[name="telephone"]')?.value || '', true),
            sujet: sanitizeField(form.querySelector('[name="sujet"]')?.value || '', true),
            message: sanitizeField(form.querySelector('[name="message"]')?.value || '', false),
        };
    }

    function readDevisFields(form) {
        return {
            nom: sanitizeField(form.querySelector('[name="nom"]')?.value || '', true),
            prenom: sanitizeField(form.querySelector('[name="prenom"]')?.value || '', true),
            email: sanitizeField(form.querySelector('[name="email"]')?.value || '', true),
            telephone: sanitizeField(form.querySelector('[name="telephone"]')?.value || '', true),
            societe: sanitizeField(form.querySelector('[name="societe"]')?.value || '', true),
            type_demande: sanitizeField(form.querySelector('[name="type_demande"]')?.value || '', true),
            produit: sanitizeField(form.querySelector('[name="produit"]')?.value || '', true),
            quantite: sanitizeField(form.querySelector('[name="quantite"]')?.value || '', true),
            message: sanitizeField(form.querySelector('[name="message"]')?.value || '', false),
        };
    }

    function bindForm(form, formType) {
        loadCaptcha(form);

        var refreshBtn = form.querySelector('.captcha-refresh');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', function (e) {
                e.preventDefault();
                loadCaptcha(form);
            });
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var submitBtn = form.querySelector('[type="submit"]');
            if (submitBtn) {
                submitBtn.disabled = true;
            }

            var payload = {
                form: formType,
                captcha_token: form.querySelector('[name="captcha_token"]')?.value || '',
                captcha_answer: form.querySelector('[name="captcha_answer"]')?.value || '',
                website: form.querySelector('[name="website"]')?.value || '',
                fields: formType === 'devis' ? readDevisFields(form) : readContactFields(form),
            };

            fetch(apiBase() + 'fm-k4n8.php', {
                method: 'POST',
                credentials: 'same-origin',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })
                .then(function (res) {
                    return res.json().then(function (data) {
                        return { status: res.status, data: data };
                    });
                })
                .then(function (result) {
                    if (result.data.ok) {
                        showFormMessage(form, result.data.message || 'Message envoyé.', false);
                        form.reset();
                        loadCaptcha(form);
                    } else {
                        showFormMessage(form, result.data.error || 'Envoi refusé.', true);
                        if (result.status === 400) {
                            loadCaptcha(form);
                        }
                    }
                })
                .catch(function () {
                    showFormMessage(form, 'Erreur réseau. Vérifiez votre connexion.', true);
                })
                .finally(function () {
                    if (submitBtn) {
                        submitBtn.disabled = false;
                    }
                });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var contactForm = document.getElementById('contact-form');
        if (contactForm) {
            bindForm(contactForm, 'contact');
        }
        var devisForm = document.getElementById('devisForm');
        if (devisForm) {
            bindForm(devisForm, 'devis');
        }
    });
})();
