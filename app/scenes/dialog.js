// Visual-novel style dialog box with a portrait and typewriter text.
import { h, reducedMotion } from '../core/dom.js';
import { sfx } from '../core/audio.js';
import { portrait } from '../art/sprites.js';

export function createDialog() {
    const face = h('div', { class: 'dialog__portrait', 'aria-hidden': 'true' });
    const name = h('div', { class: 'dialog__name', id: 'dialog-name' });
    const typed = h('p', { class: 'dialog__text', 'aria-hidden': 'true' });
    const spoken = h('p', { class: 'sr-only', 'aria-live': 'polite' });
    const primary = h('button', { class: 'btn btn--primary', type: 'button' });
    const secondary = h('button', { class: 'btn', type: 'button' });
    const el = h('div', { class: 'dialog', role: 'dialog', 'aria-labelledby': 'dialog-name', hidden: true },
        face,
        h('div', { class: 'dialog__box' }, name, typed, spoken,
            h('div', { class: 'dialog__actions' }, primary, secondary)),
    );

    let session = null; // state of the conversation currently on screen

    function showPage() {
        const s = session;
        const text = s.pages[s.index];
        const last = s.index === s.pages.length - 1;
        spoken.textContent = text;
        primary.textContent = last ? (s.choice?.yes || 'Close') : 'Continue';
        secondary.textContent = last && s.choice ? s.choice.no : 'Cancel';
        secondary.hidden = last && !s.choice;
        clearInterval(s.timer);
        if (reducedMotion()) { typed.textContent = text; s.typing = false; return; }
        let n = 0;
        s.typing = true;
        typed.textContent = '';
        s.timer = setInterval(() => {
            n++;
            typed.textContent = text.slice(0, n);
            if (n % 2 === 0) sfx.type();
            if (n >= text.length) { clearInterval(s.timer); s.typing = false; }
        }, 22);
    }

    function finish(result) {
        const s = session;
        if (!s) return;
        clearInterval(s.timer);
        session = null;
        el.hidden = true;
        s.resolve(result);
    }

    function advance() {
        const s = session;
        if (!s) return;
        if (s.typing) {
            clearInterval(s.timer);
            s.typing = false;
            typed.textContent = s.pages[s.index];
            return;
        }
        if (s.index < s.pages.length - 1) { s.index++; sfx.move(); showPage(); return; }
        sfx.select();
        finish(Boolean(s.choice));
    }

    primary.addEventListener('click', advance);
    secondary.addEventListener('click', () => { sfx.cancel(); finish(false); });

    return {
        el,
        get open() { return session !== null; },
        // Resolves true when the visitor accepts the entry's choice, false otherwise.
        play(entry) {
            return new Promise((resolve) => {
                const pages = [...entry.lines];
                if (entry.choice) pages.push(entry.choice.prompt);
                session = { pages, index: 0, choice: entry.choice, resolve, timer: 0, typing: false };
                name.textContent = entry.speaker;
                face.replaceChildren(portrait(entry.speaker, 5));
                el.hidden = false;
                showPage();
                primary.focus({ preventScroll: true });
            });
        },
        handleKey(e) {
            if (!session) return;
            if (e.key === 'Escape') { sfx.cancel(); finish(false); return; }
            // Enter / Space on a focused dialog button already fires its click handler.
            const onButton = e.target.closest?.('.dialog button');
            if (e.key === 'e' || e.key === 'E' || (!onButton && (e.key === ' ' || e.key === 'Enter'))) {
                e.preventDefault();
                advance();
            }
        },
        close: () => finish(false),
    };
}
