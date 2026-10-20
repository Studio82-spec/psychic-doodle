// Keep each service card's soft light under the pointer.
(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    document.querySelectorAll('.service-card').forEach((card) => {
        let frame = 0;
        let pointerX = 0;
        let pointerY = 0;
        const updateGlow = (event) => {
            if (event.pointerType === 'touch' || reducedMotion.matches) return;
            pointerX = event.clientX;
            pointerY = event.clientY;
            if (frame) return;
            frame = requestAnimationFrame(() => {
                const bounds = card.getBoundingClientRect();
                card.style.setProperty('--glow-x', `${pointerX - bounds.left}px`);
                card.style.setProperty('--glow-y', `${pointerY - bounds.top}px`);
                frame = 0;
            });
        };
        card.addEventListener('pointerenter', updateGlow);
        card.addEventListener('pointermove', updateGlow);
        card.addEventListener('pointerleave', () => {
            cancelAnimationFrame(frame);
            frame = 0;
        });
        reducedMotion.addEventListener('change', () => {
            cancelAnimationFrame(frame);
            frame = 0;
            card.style.removeProperty('--glow-x');
            card.style.removeProperty('--glow-y');
        });
    });
})();

// Keep visitors on Studio82 and preserve their message if delivery fails.
(() => {
    const form = document.querySelector('.project-form');
    const success = document.querySelector('.contact-success');
    if (!form || !success) return;
    const button = form.querySelector('[type="submit"]');
    const error = form.querySelector('.form-error');
    const label = button.textContent;
    let sending = false;
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (sending) return;
        sending = true;
        button.disabled = true;
        button.textContent = 'Sending…';
        form.setAttribute('aria-busy', 'true');
        error.hidden = true;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);
        try {
            const response = await fetch(form.action, {
                method: 'POST', body: new FormData(form),
                headers: { Accept: 'application/json' }, signal: controller.signal
            });
            if (!response.ok) throw new Error('Submission failed');
            document.querySelector('.contact-hero').hidden = true;
            document.querySelector('.contact-form-section').hidden = true;
            success.hidden = false;
            document.title = 'Message Received — Studio82';
            form.reset();
            document.getElementById('success-title').focus({ preventScroll: true });
            window.scrollTo({ top: 0, behavior: 'instant' });
        } catch {
            error.textContent = 'We couldn’t confirm your message was sent. Your details are still here. Please try again, or email studio82_design@yahoo.com.';
            error.hidden = false;
            error.focus();
        } finally {
            clearTimeout(timeout);
            sending = false;
            button.disabled = false;
            button.textContent = label;
            form.removeAttribute('aria-busy');
        }
    });
})();
